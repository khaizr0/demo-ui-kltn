import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Save, Plus, FileText, User, Activity, Stethoscope, LogOut, ClipboardList, Thermometer, Pill, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Record, Patient } from "@/types";

import { AdministrativeSection } from "./sections/AdministrativeSection";
import { PatientManagementSection } from "./sections/PatientManagementSection";
import { DiagnosisSection } from "./sections/DiagnosisSection";
import { DischargeStatusSection } from "./sections/DischargeStatusSection";
import { MedicalHistorySection } from "./sections/MedicalHistorySection";
import { ExaminationSection } from "./sections/ExaminationSection";
import { TreatmentSection } from "./sections/TreatmentSection";
import { DocumentSection } from "./sections/DocumentSection";

interface RecordFormProps {
  record?: Record;
  patient: Patient;
  mode: "create" | "edit";
  initialType?: "internal" | "surgery";
  onSubmit: (data: Record) => void;
  onCancel: () => void;
}

const createInitialRecord = (patient: Patient, type: "internal" | "surgery" = "internal"): Record => {
  const departmentName = type === "surgery" ? "Ngoại Khoa" : "Nội Khoa";
  return {
    id: `REC${Date.now()}`,
    patientId: patient.id,
    patientName: patient.fullName,
    age: patient.age,
    dob: patient.dob,
    gender: patient.gender,
    admissionDate: new Date().toISOString().split("T")[0],
    dischargeDate: "",
    department: departmentName,
    type: type,
    documents: [],
    managementData: {
      admissionTime: "",
      admissionType: "KKB",
      referralSource: "Tự đến",
      admissionCount: 1,
      hospitalTransfer: { type: "", destination: "" },
      dischargeType: "",
      totalDays: 0,
      transfers: [{ department: departmentName, date: new Date().toISOString().split("T")[0], time: "", days: 0 }],
    },
    diagnosisInfo: {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: { name: "", code: "", isSurgery: type === "surgery", isProcedure: false },
      dischargeDiagnosis: {
        mainDisease: { name: "", code: "" },
        comorbidities: { name: "", code: "" },
        isAccident: false,
        isComplication: false,
      },
    },
    dischargeStatusInfo: {
      treatmentResult: "",
      pathology: "",
      deathStatus: { description: "", cause: "", time: "" },
      mainCauseOfDeath: { name: "", code: "" },
      isAutopsy: false,
      autopsyDiagnosis: { name: "", code: "" },
    },
    medicalRecordContent: {
      reason: "",
      dayOfIllness: "",
      pathologicalProcess: "",
      personalHistory: "",
      familyHistory: "",
      relatedCharacteristics: {
        allergy: { isChecked: false, time: "" },
        drugs: { isChecked: false, time: "" },
        alcohol: { isChecked: false, time: "" },
        tobacco: { isChecked: false, time: "" },
        pipeTobacco: { isChecked: false, time: "" },
        other: { isChecked: false, time: "" },
      },
      overallExamination: "",
      vitalSigns: { pulse: "", temperature: "", bloodPressure: "", respiratoryRate: "", weight: "" },
      organs: {
        circulatory: "",
        respiratory: "",
        digestive: "",
        kidneyUrology: "",
        neurological: "",
        musculoskeletal: "",
        ent: "",
        maxillofacial: "",
        eye: "",
        endocrineAndOthers: "",
      },
      clinicalTests: "",
      summary: "",
      admissionDiagnosis: { mainDisease: "", comorbidities: "", differential: "" },
      prognosis: "",
      treatmentPlan: "",
    },
  };
};

const prepareRecordData = (record: Record): Record => {
  let transfers = record.managementData?.transfers || [];
  if (transfers.length === 0) {
    transfers = [{ department: record.department || "", date: record.admissionDate || "", time: "", days: 0 }];
  }
  const initializedData: Record = {
    ...record,
    managementData: { ...record.managementData, transfers: transfers },
    diagnosisInfo: record.diagnosisInfo || {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: { name: "", code: "", isSurgery: false, isProcedure: false },
      dischargeDiagnosis: {
        mainDisease: { name: "", code: "" },
        comorbidities: { name: "", code: "" },
        isAccident: false,
        isComplication: false,
      },
    },
    dischargeStatusInfo: record.dischargeStatusInfo || {
      treatmentResult: "",
      pathology: "",
      deathStatus: { description: "", cause: "", time: "" },
      mainCauseOfDeath: { name: "", code: "" },
      isAutopsy: false,
      autopsyDiagnosis: { name: "", code: "" },
    },
    medicalRecordContent: { ...record.medicalRecordContent },
  };
  if (record.medicalRecordContent?.vitalSigns) {
    initializedData.medicalRecordContent.vitalSigns = { ...initializedData.medicalRecordContent.vitalSigns, ...record.medicalRecordContent.vitalSigns };
  }
  if (record.medicalRecordContent?.organs) {
    initializedData.medicalRecordContent.organs = { ...initializedData.medicalRecordContent.organs, ...record.medicalRecordContent.organs };
  }
  return initializedData;
};

const GENERAL_SECTIONS = [
  { id: "administrative", label: "I. Hành Chính", icon: User },
  { id: "management", label: "II. Quản Lý Người Bệnh", icon: LogOut },
  { id: "diagnosis", label: "III. Chẩn Đoán", icon: Activity },
  { id: "discharge", label: "IV. Tình Trạng Ra Viện", icon: FileText },
];

const MEDICAL_SECTIONS = [
  { id: "history", label: "A. Bệnh Án", icon: ClipboardList },
  { id: "examination", label: "B. Khám Bệnh", icon: Thermometer },
  { id: "treatment", label: "C. Tiên Lượng & Điều Trị", icon: Pill },
];

export const RecordForm = ({ record, patient, mode, initialType = "internal", onSubmit, onCancel }: RecordFormProps) => {
  const [formData, setFormData] = useState<Record | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [activeGeneralSection, setActiveGeneralSection] = useState("administrative");
  const [activeMedicalSection, setActiveMedicalSection] = useState("history");

  useEffect(() => {
    if (mode === "create" && patient) {
      setFormData(createInitialRecord(patient, initialType));
    } else if (mode === "edit" && record) {
      setFormData(prepareRecordData(record));
    }
  }, [mode, record, patient, initialType]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formData) {
      onSubmit(formData);
    }
  };

  if (!formData) return null;

  const isCreate = mode === "create";
  const typeLabel = (formData?.type || initialType) === "surgery" ? "Ngoại Khoa" : "Nội Khoa";

  const currentGeneralIndex = GENERAL_SECTIONS.findIndex(s => s.id === activeGeneralSection);
  const handleNextGeneralSection = () => {
    if (currentGeneralIndex < GENERAL_SECTIONS.length - 1) {
      setActiveGeneralSection(GENERAL_SECTIONS[currentGeneralIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab("medical");
      setActiveMedicalSection("history");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handlePrevGeneralSection = () => {
    if (currentGeneralIndex > 0) {
      setActiveGeneralSection(GENERAL_SECTIONS[currentGeneralIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentMedicalIndex = MEDICAL_SECTIONS.findIndex(s => s.id === activeMedicalSection);
  const handleNextMedicalSection = () => {
    if (currentMedicalIndex < MEDICAL_SECTIONS.length - 1) {
      setActiveMedicalSection(MEDICAL_SECTIONS[currentMedicalIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab("documents");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handlePrevMedicalSection = () => {
    if (currentMedicalIndex > 0) {
      setActiveMedicalSection(MEDICAL_SECTIONS[currentMedicalIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab("general");
      setActiveGeneralSection("discharge");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {isCreate ? "Tạo Hồ Sơ Bệnh Án Mới" : "Chỉnh Sửa Hồ Sơ Bệnh Án"}
            <span className="text-gray-400 font-light">|</span>
            <span className="text-vlu-red">{typeLabel}</span>
          </h1>
          <p className="text-gray-500">
            {isCreate ? `Bệnh nhân: ${patient.fullName}` : `Mã hồ sơ: ${record?.id}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy bỏ</Button>
          <Button type="button" onClick={() => handleSubmit()} className="bg-vlu-red hover:bg-red-800 text-white min-w-[120px]">
            {isCreate ? <Plus size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
            {isCreate ? "Tạo Hồ Sơ" : "Lưu Thay Đổi"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[900px]">
          <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
          <TabsTrigger value="medical">Bệnh Án Chi Tiết</TabsTrigger>
          <TabsTrigger value="documents">Tài Liệu Đính Kèm</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-72 flex-shrink-0 space-y-1 lg:sticky lg:top-6">
              {GENERAL_SECTIONS.map((section) => {
                const isActive = activeGeneralSection === section.id;
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    type="button"
                    variant="ghost"
                    onClick={() => { setActiveGeneralSection(section.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full justify-start text-left h-auto py-3 px-4 rounded-lg font-medium transition-all ${
                      isActive ? "bg-vlu-red text-white hover:bg-red-800 shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <Icon size={18} className={`mr-3 ${isActive ? "text-white" : "text-gray-500"}`} />
                    {section.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex-1 w-full min-w-0">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeGeneralSection === "administrative" && <AdministrativeSection patient={patient} />}
                {activeGeneralSection === "management" && <PatientManagementSection formData={formData} setFormData={setFormData} />}
                {activeGeneralSection === "diagnosis" && <DiagnosisSection formData={formData} setFormData={setFormData} />}
                {activeGeneralSection === "discharge" && <DischargeStatusSection formData={formData} setFormData={setFormData} />}
              </div>
              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handlePrevGeneralSection} disabled={currentGeneralIndex === 0} className={currentGeneralIndex === 0 ? "opacity-0 pointer-events-none" : ""}>
                  <ArrowLeft size={16} className="mr-2" /> Quay lại
                </Button>
                <Button type="button" onClick={handleNextGeneralSection} className="bg-black hover:bg-gray-800 text-white">
                  {currentGeneralIndex < GENERAL_SECTIONS.length - 1 ? `Tiếp tục: ${GENERAL_SECTIONS[currentGeneralIndex + 1].label.split(". ")[1]}` : "Tiếp tục: Bệnh Án Chi Tiết"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-72 flex-shrink-0 space-y-1 lg:sticky lg:top-6">
              {MEDICAL_SECTIONS.map((section) => {
                const isActive = activeMedicalSection === section.id;
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    type="button"
                    variant="ghost"
                    onClick={() => { setActiveMedicalSection(section.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full justify-start text-left h-auto py-3 px-4 rounded-lg font-medium transition-all ${
                      isActive ? "bg-vlu-red text-white hover:bg-red-800 shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <Icon size={18} className={`mr-3 ${isActive ? "text-white" : "text-gray-500"}`} />
                    {section.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex-1 w-full min-w-0">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeMedicalSection === "history" && <MedicalHistorySection formData={formData} setFormData={setFormData} />}
                {activeMedicalSection === "examination" && <ExaminationSection formData={formData} setFormData={setFormData} />}
                {activeMedicalSection === "treatment" && <TreatmentSection formData={formData} setFormData={setFormData} />}
              </div>
              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handlePrevMedicalSection}>
                  <ArrowLeft size={16} className="mr-2" />
                  {currentMedicalIndex === 0 ? "Quay lại: Thông Tin Chung" : "Quay lại"}
                </Button>
                <Button type="button" onClick={handleNextMedicalSection} className="bg-black hover:bg-gray-800 text-white">
                  Tiếp tục: Tài Liệu Đính Kèm
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
            <DocumentSection formData={formData} setFormData={setFormData} />
            
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => { setActiveTab("medical"); setActiveMedicalSection("treatment"); }}>
                  <ArrowLeft size={16} className="mr-2" /> Quay lại: Bệnh Án Chi Tiết
                </Button>
                <Button type="button" onClick={() => handleSubmit()} className="bg-vlu-red hover:bg-red-800 text-white min-w-[150px]">
                    {isCreate ? <Plus size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                    {isCreate ? "Hoàn tất & Tạo" : "Lưu Thay Đổi"}
                </Button>
            </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

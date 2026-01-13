import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Record, Patient } from "@/types";

import { AdministrativeSection } from "./sections/AdministrativeSection";
import { PatientManagementSection } from "./sections/PatientManagementSection";
import { DiagnosisSection } from "./sections/DiagnosisSection";
import { DischargeStatusSection } from "./sections/DischargeStatusSection";
import { MedicalContentSection } from "./sections/MedicalContentSection";

interface RecordFormProps {
  record?: Record; // Only for edit mode
  patient: Patient;
  mode: "create" | "edit";
  initialType?: "internal" | "surgery";
  onSubmit: (data: Record) => void;
  onCancel: () => void;
}

// Helper to create empty record structure from patient
const createInitialRecord = (patient: Patient, type: "internal" | "surgery" = "internal"): Record => {
  const departmentName = type === "surgery" ? "Ngoại Khoa" : "Nội Khoa";
  
  return {
    id: `REC${Date.now()}`, // Temporary ID generation
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
      transfers: [
        {
            department: departmentName,
            date: new Date().toISOString().split("T")[0],
            time: "",
            days: 0
        }
      ],
    },
    diagnosisInfo: {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: {
        name: "",
        code: "",
        isSurgery: type === "surgery", // Default surgery flag based on type
        isProcedure: false,
      },
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
      vitalSigns: {
        pulse: "",
        temperature: "",
        bloodPressure: "",
        respiratoryRate: "",
        weight: "",
      },
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
      admissionDiagnosis: {
        mainDisease: "",
        comorbidities: "",
        differential: "",
      },
      prognosis: "",
      treatmentPlan: "",
    },
  };
};

// Helper to prepare data for edit (ensure deep structure)
const prepareRecordData = (record: Record): Record => {
  let transfers = record.managementData?.transfers || [];
  if (transfers.length === 0) {
    transfers = [
      {
        department: record.department || "",
        date: record.admissionDate || "",
        time: "",
        days: 0,
      },
    ];
  }

  const initializedData: Record = {
    ...record,
    managementData: {
      ...record.managementData,
      transfers: transfers,
    },
    diagnosisInfo: record.diagnosisInfo || {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: {
        name: "",
        code: "",
        isSurgery: false,
        isProcedure: false,
      },
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
    medicalRecordContent: {
      ...record.medicalRecordContent,
    },
  };

  // Deep merge to ensure optional nested objects exist
  // (Simplified for brevity, similar to previous EditRecordForm logic)
  if (record.medicalRecordContent?.vitalSigns) {
     initializedData.medicalRecordContent.vitalSigns = {
         ...initializedData.medicalRecordContent.vitalSigns,
         ...record.medicalRecordContent.vitalSigns
     }
  }
   if (record.medicalRecordContent?.organs) {
     initializedData.medicalRecordContent.organs = {
         ...initializedData.medicalRecordContent.organs,
         ...record.medicalRecordContent.organs
     }
  }

  return initializedData;
};

export const RecordForm = ({ record, patient, mode, initialType = "internal", onSubmit, onCancel }: RecordFormProps) => {
  const [formData, setFormData] = useState<Record | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (mode === "create" && patient) {
      setFormData(createInitialRecord(patient, initialType));
    } else if (mode === "edit" && record) {
      setFormData(prepareRecordData(record));
    }
  }, [mode, record, patient, initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSubmit(formData);
    }
  };

  if (!formData) return null;

  const isCreate = mode === "create";
  const typeLabel = (formData?.type || initialType) === "surgery" ? "Ngoại Khoa" : "Nội Khoa";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2">
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
            <Button type="button" variant="outline" onClick={onCancel}>
                Hủy bỏ
            </Button>
            <Button type="submit" className="bg-vlu-red hover:bg-red-800 text-white min-w-[120px]">
                {isCreate ? <Plus size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                {isCreate ? "Tạo Hồ Sơ" : "Lưu Thay Đổi"}
            </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general">Thông Tin Chung</TabsTrigger>
          <TabsTrigger value="medical">Bệnh Án Chi Tiết</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <AdministrativeSection patient={patient} />
          <PatientManagementSection formData={formData} setFormData={setFormData} />
          <DiagnosisSection formData={formData} setFormData={setFormData} />
          <DischargeStatusSection formData={formData} setFormData={setFormData} />
          
          <div className="flex justify-end pt-4">
             <Button 
                type="button" 
                onClick={() => setActiveTab("medical")}
                className="bg-black hover:bg-gray-800"
             >
                Tiếp tục: Bệnh Án <ArrowRight size={16} className="ml-2" />
             </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="medical" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <MedicalContentSection formData={formData} setFormData={setFormData} />
           
           <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setActiveTab("general")}
             >
                <ArrowLeft size={16} className="mr-2" /> Quay lại
             </Button>
           </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

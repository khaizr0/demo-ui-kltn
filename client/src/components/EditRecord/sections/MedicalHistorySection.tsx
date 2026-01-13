import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Record } from "@/types";

interface MedicalHistorySectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
}

export const MedicalHistorySection = ({ formData, setFormData }: MedicalHistorySectionProps) => {
  const content = formData.medicalRecordContent;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          [field]: value,
        },
      };
    });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
        <CardTitle className="text-lg font-bold text-gray-800 uppercase">
          A. Bệnh Án
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>1. Lý do vào viện</Label>
          <Textarea 
            value={content.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className="min-h-[60px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>2. Hỏi bệnh (Quá trình bệnh lý)</Label>
          <Textarea 
            value={content.pathologicalProcess}
            onChange={(e) => handleChange("pathologicalProcess", e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>3. Tiền sử bệnh</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Bản thân</Label>
                <Textarea 
                    value={content.personalHistory}
                    onChange={(e) => handleChange("personalHistory", e.target.value)}
                    className="min-h-[80px]"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Gia đình</Label>
                <Textarea 
                    value={content.familyHistory}
                    onChange={(e) => handleChange("familyHistory", e.target.value)}
                    className="min-h-[80px]"
                />
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

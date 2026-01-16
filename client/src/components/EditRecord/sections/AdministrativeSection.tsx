import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "./InfoRow";
import type { Patient } from "@/types";

interface AdministrativeSectionProps {
  patient: Patient;
}

export const AdministrativeSection = ({ patient }: AdministrativeSectionProps) => {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-1">
        <InfoRow label="1. Họ và tên" value={patient.fullName} />
        <InfoRow 
          label="2. Sinh ngày" 
          value={
            <span>
              {patient.dob} <span className="text-gray-400 font-normal ml-2">(Tuổi: {patient.age}, Giới tính: {patient.gender})</span>
            </span>
          } 
        />
        <InfoRow label="3. Dân tộc" value={patient.ethnicity} />
        <InfoRow label="4. Nghề nghiệp" value={`${patient.job || "---"} (Mã: ${patient.jobCode || "---"})`} />
        <InfoRow label="5. Địa chỉ" value={patient.address} />
        <InfoRow label="6. Nơi làm việc" value={patient.workplace} />
        <InfoRow label="7. Đối tượng" value={patient.subjectType} />
        <InfoRow 
          label="8. BHYT" 
          value={`Số: ${patient.insuranceNumber || "---"} (Hạn: ${patient.insuranceExpiry || "---"})`} 
        />
        <InfoRow 
          label="9. Người nhà" 
          value={
            <div>
              <div>{patient.relativeInfo}</div>
              {patient.relativePhone && <div className="text-sm text-gray-500 mt-1">SĐT: {patient.relativePhone}</div>}
            </div>
          } 
        />
      </CardContent>
    </Card>
  );
};

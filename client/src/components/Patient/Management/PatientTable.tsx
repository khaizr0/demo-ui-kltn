import { FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Patient } from "@/types";
import { PatientTableRow } from "./PatientTableRow";

interface PatientTableProps {
  patients: Patient[];
}

export const PatientTable = ({ patients }: PatientTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-24 font-semibold text-gray-700">Mã BN</TableHead>
              <TableHead className="font-semibold text-gray-700">Họ và Tên</TableHead>
              <TableHead className="font-semibold text-gray-700">Ngày Sinh</TableHead>
              <TableHead className="font-semibold text-gray-700">Tuổi / Giới</TableHead>
              <TableHead className="font-semibold text-gray-700">Địa chỉ</TableHead>
              <TableHead className="font-semibold text-gray-700">Đối tượng</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <PatientTableRow key={patient.id} patient={patient} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText size={48} className="text-gray-300 mb-4" />
                    <span className="text-lg font-medium text-gray-600">
                      Không tìm thấy bệnh nhân
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                      Vui lòng thử lại với từ khóa khác
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
            Hiển thị <span className="font-medium">{patients.length}</span> bản ghi
      </div>
    </div>
  );
};

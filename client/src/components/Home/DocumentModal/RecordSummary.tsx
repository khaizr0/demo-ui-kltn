import { useNavigate } from "react-router-dom";
import { FileText, Edit, Eye } from "lucide-react";
import type { Record } from "@/types";

interface RecordSummaryProps {
  record: Record;
  onClose: () => void;
}

export const RecordSummary = ({ record, onClose }: RecordSummaryProps) => {
  const navigate = useNavigate();

  return (
    <section>
      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
        <FileText size={16} className="mr-2 text-vlu-red" />
        1. Hồ sơ bệnh án điện tử (Dữ liệu nhập liệu)
      </h4>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-md border border-blue-100 mr-3 text-blue-600">
            <FileText size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-800">
              Bệnh án {record.type === "internal" ? "Nội Khoa" : record.type}
            </p>
            <p className="text-xs text-gray-500">
              Cập nhật lần cuối: {record.admissionDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { onClose(); navigate(`/record/edit/${record.id}`); }}
            className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-50 transition shadow-sm flex items-center"
          >
            <Edit size={16} className="mr-2" /> Chỉnh sửa
          </button>
          <button
            onClick={() => { onClose(); navigate(`/record/${record.id}`); }}
            className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition shadow-sm flex items-center"
          >
            <Eye size={16} className="mr-2" /> Xem chi tiết
          </button>
        </div>
      </div>
    </section>
  );
};

import { useState } from "react";
import { X, File as FileIcon } from "lucide-react";
import type { Record } from "@/types";
import { RecordSummary } from "./RecordSummary";
import { DocumentUploadForm } from "./DocumentUploadForm";
import { DocumentList } from "./DocumentList";

interface DocumentManagerModalProps {
  record: Record;
  onClose: () => void;
}

export const DocumentManagerModal = ({ record: initialRecord, onClose }: DocumentManagerModalProps) => {
  const [record, setRecord] = useState(initialRecord);

  const handleUpload = (file: File, type: string) => {
    const newDoc = {
      id: `DOC${Date.now()}`,
      name: type,
      type: type,
      fileName: `${record.id}_${type}_${record.patientName.replace(/\s+/g, "")}.pdf`,
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(file),
    };
    setRecord({ ...record, documents: [...(record.documents || []), newDoc] });
  };

  const handleRename = (docId: string, newName: string) => {
    const updatedDocs = record.documents.map((d) => (d.id === docId ? { ...d, name: newName } : d));
    setRecord({ ...record, documents: updatedDocs });
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = record.documents.filter((d) => d.id !== docId);
    setRecord({ ...record, documents: updatedDocs });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Sửa hồ sơ & tài liệu</h3>
            <p className="text-sm text-gray-500">
              Bệnh nhân: <span className="font-medium text-gray-700">{record.patientName}</span> - {record.id}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <RecordSummary record={record} onClose={onClose} />
          <section>
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center">
                <FileIcon size={16} className="mr-2 text-vlu-red" />
                2. Tài liệu đính kèm ({record.documents?.length || 0})
              </h4>
            </div>
            <DocumentUploadForm onUpload={handleUpload} />
            <DocumentList documents={record.documents} onRename={handleRename} onDelete={handleDelete} />
          </section>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

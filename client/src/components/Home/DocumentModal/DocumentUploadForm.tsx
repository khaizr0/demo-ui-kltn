import { useState } from "react";
import { Upload } from "lucide-react";

interface DocumentUploadFormProps {
  onUpload: (file: File, type: string) => void;
}

export const DocumentUploadForm = ({ onUpload }: DocumentUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("Khác");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    onUpload(selectedFile, uploadType);
    setSelectedFile(null);
  };

  return (
    <div className="mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-center">
        <select
          className="p-2 border border-gray-300 rounded-md text-sm outline-none w-full md:w-40"
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
        >
          <option>Xét nghiệm máu</option>
          <option>X-Quang</option>
          <option>Siêu âm</option>
          <option>Đơn thuốc</option>
          <option>Khác</option>
        </select>
        <input
          type="file"
          accept=".pdf"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-700"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <button
          disabled={!selectedFile}
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition"
        >
          <Upload size={16} className="inline mr-1" /> Tải lên
        </button>
      </form>
    </div>
  );
};

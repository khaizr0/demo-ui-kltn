import { useState } from "react";
import { FileText, Upload, Trash2, Eye, Edit2, Save, X } from "lucide-react";
import type { Record, Document } from "@/types";

interface DocumentSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
}

export const DocumentSection = ({ formData, setFormData }: DocumentSectionProps) => {
  const documents = formData.documents || [];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("Khác");
  
  // Edit State
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDoc: Document = {
      id: `DOC${Date.now()}`,
      name: uploadType,
      type: uploadType,
      fileName: selectedFile.name,
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(selectedFile),
    };

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: [...(prev.documents || []), newDoc],
      };
    });

    setSelectedFile(null);
    setUploadType("Khác");
  };

  const handleDelete = (docId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: prev.documents.filter((d) => d.id !== docId),
      };
    });
  };

  const startEdit = (doc: Document) => {
    setEditingDocId(doc.id);
    setEditName(doc.name);
  };

  const saveEdit = (docId: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedDocs = prev.documents.map((d) => 
        d.id === docId ? { ...d, name: editName } : d
      );
      return { ...prev, documents: updatedDocs };
    });
    setEditingDocId(null);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-end mb-3">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center">
          <FileText size={16} className="mr-2 text-vlu-red" />
          Tài liệu đính kèm ({documents.length})
        </h4>
      </div>

      {/* Upload Form */}
      <div className="mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
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
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition"
          >
            <Upload size={16} className="inline mr-1" /> Tải lên
          </button>
        </div>
      </div>

      {/* Document List Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">Tên tài liệu</th>
              <th className="px-4 py-3">Tên file</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {editingDocId === doc.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => saveEdit(doc.id)} className="text-green-600 hover:text-green-700">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingDocId(null)} className="text-red-500 hover:text-red-600">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2 group">
                        {doc.name}
                        <button onClick={() => startEdit(doc)} className="text-gray-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition">
                          <Edit2 size={12} />
                        </button>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs truncate max-w-[200px]" title={doc.fileName}>
                    {doc.fileName}
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition" title="Xem">
                            <Eye size={16} />
                        </a>
                    )}
                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400 italic">
                  Chưa có tài liệu đính kèm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
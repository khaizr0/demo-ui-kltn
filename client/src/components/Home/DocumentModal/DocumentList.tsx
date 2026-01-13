import { useState } from "react";
import { Edit2, Eye, Save, Trash2, X } from "lucide-react";
import type { Document } from "@/types";

interface DocumentListProps {
  documents: Document[];
  onRename: (docId: string, newName: string) => void;
  onDelete: (docId: string) => void;
}

export const DocumentList = ({ documents, onRename, onDelete }: DocumentListProps) => {
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (doc: Document) => {
    setEditingDocId(doc.id);
    setEditName(doc.name);
  };

  const saveEdit = (docId: string) => {
    onRename(docId, editName);
    setEditingDocId(null);
  };

  return (
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
          {documents && documents.length > 0 ? (
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
                  <a href={doc.url} target="_blank" rel="noreferrer" className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition" title="Xem">
                    <Eye size={16} />
                  </a>
                  <button onClick={() => { if (window.confirm("Xóa tài liệu này?")) onDelete(doc.id); }} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition" title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-400 italic">Chưa có tài liệu đính kèm</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

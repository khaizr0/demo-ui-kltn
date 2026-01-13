import { useNavigate } from "react-router-dom";
import { Eye, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Record, User } from "@/types";
import { getTypeName, getStatusColor, getStatusLabel } from "./utils";

interface RecordTableRowProps {
  record: Record;
  user: User | null;
  onEdit: (record: Record) => void;
  onDelete: (record: Record) => void;
}

export const RecordTableRow = ({ record, user, onEdit, onDelete }: RecordTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow className="hover:bg-gray-50 transition group">
      <TableCell className="font-mono text-xs text-gray-600 font-medium">{record.id}</TableCell>
      <TableCell>
        <div className="font-medium text-gray-900 group-hover:text-red-700 transition">
          {record.patientName}
        </div>
        <div className="text-xs text-gray-400 mt-0.5 font-mono">{record.patientId}</div>
      </TableCell>
      <TableCell className="text-gray-600">{record.dob}</TableCell>
      <TableCell className="text-gray-600">{record.age} / {record.gender}</TableCell>
      <TableCell>
        <Badge variant="secondary" className={record.type === "internal" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
          {getTypeName(record.type)}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600">{record.admissionDate}</TableCell>
      <TableCell className="text-center">
        <Badge variant="outline" className={getStatusColor(record)}>
          {getStatusLabel(record)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/record/${record.id}`)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8 px-2">
            <Eye size={14} className="mr-1" /> Xem
          </Button>
          {user?.role !== "student" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit(record)} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2">
                <Settings size={14} className="mr-1" /> Sửa
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(record)} className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2">
                <Trash2 size={14} className="mr-1" /> Xóa
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
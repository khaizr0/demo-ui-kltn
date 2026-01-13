import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DocumentManagerModal } from "./DocumentModal"; // Updated import
import type { Record } from "@/types";
import { RecordFilter } from "./RecordFilter";
import { RecordTable } from "./RecordTable";
import { DeleteRecordDialog } from "./DeleteRecordDialog";
import { INITIAL_RECORDS } from "@/mockData";
import { useRecordFilter } from "./hooks/useRecordFilter";

// Mock user
const mockUser = {
  username: "teacher",
  password: "",
  role: "teacher",
  name: "TS. Trần Văn Giảng Viên",
  status: "active",
};

export const StudentRepositoryView = () => {
  const [records, setRecords] = useState<Record[]>(INITIAL_RECORDS);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("patientId") || "";
  
  const {
    inputValue, setInputValue, filterType, setFilterType,
    currentPage, setCurrentPage, totalPages, startIndex, currentRecords
  } = useRecordFilter(records, initialSearch);

  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  const handleDeleteRecord = () => {
    if (recordToDelete) {
      setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      setRecordToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kho Hồ Sơ Bệnh Án</h1>
      </div>

      <RecordFilter
        inputValue={inputValue}
        setInputValue={setInputValue}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <RecordTable
        records={currentRecords}
        startIndex={startIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        user={mockUser}
        onEdit={setSelectedRecord}
        onDelete={setRecordToDelete}
      />

      {selectedRecord && (
        <DocumentManagerModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}

      <DeleteRecordDialog
        record={recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteRecord}
      />
    </div>
  );
};
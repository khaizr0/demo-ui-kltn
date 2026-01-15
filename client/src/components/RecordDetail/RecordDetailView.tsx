import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { INITIAL_RECORDS, INITIAL_PATIENTS } from "@/mockData";
import { RecordHeader } from "./RecordHeader";
import { NavigationSidebar } from "./NavigationSidebar";
import { RecordContent } from "./RecordContent";
import { Button } from "@/components/ui/button";

export const RecordDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock data fetching
  const record = INITIAL_RECORDS.find((r) => r.id === id);
  const patient = record
    ? INITIAL_PATIENTS.find((p) => p.id === record.patientId)
    : undefined;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".printable-content") as HTMLElement;
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = 297;
      const marginX = 15;
      const marginY = 15;
      const contentWidth = pdfWidth - 2 * marginX;
      const contentHeight = pdfHeight - 2 * marginY;

      const pdf = new jsPDF("p", "mm", "a4");
      // const imgWidth = contentWidth;
      // const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginY;
      let pageCount = 0;

      // First page
      pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
      heightLeft -= contentHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        pageCount++;
        position = marginY - pageCount * contentHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }

      if (record) {
        pdf.save(`HoSoBenhAn_${record.id}.pdf`);
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("Có lỗi xảy ra khi tải xuống PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Không tìm thấy hồ sơ</h2>
        <Button onClick={() => navigate(-1)} variant="link" className="text-vlu-red">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      <RecordHeader
        patientName={record.patientName}
        recordId={record.id}
        onDownload={handleDownloadPDF}
        isDownloading={isDownloading}
      />

      <div className="w-full px-6">
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          <NavigationSidebar onScrollTo={scrollToSection} />

          <div className="flex-1 min-w-0 w-full">
            <RecordContent record={record} patient={patient} />
          </div>
        </div>
      </div>
    </div>
  );
};

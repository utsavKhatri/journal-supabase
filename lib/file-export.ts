import Papa from "papaparse";
import jsPDF from "jspdf";
import { Entry } from "./types";

type ExportableEntry = Pick<Entry, "date" | "mood" | "content">;

/**
 * Generates a CSV file from an array of journal entries and triggers a download.
 */
export const generateCsv = (entries: ExportableEntry[]) => {
  const csv = Papa.unparse(entries);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "mindful_moments.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates a PDF file from an array of journal entries with an improved design and triggers a download.
 */
export const generatePdf = (entries: ExportableEntry[]) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  let y = 0;

  const addHeader = () => {
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Mindful Moments", pageWidth / 2, 20, { align: "center" });
    y = 35;
  };

  addHeader();

  entries.forEach((entry) => {
    const contentWidth = pageWidth - margin * 2;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const dateMoodLine = `${new Date(
      entry.date,
    ).toLocaleDateString()} — Mood: ${entry.mood}`;
    const dateMoodHeight = doc.getTextDimensions(dateMoodLine).h;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const contentLines = doc.splitTextToSize(entry.content ?? "", contentWidth);
    const contentHeight = doc.getTextDimensions(contentLines).h;

    const entryHeight = dateMoodHeight + contentHeight + 15;

    if (y + entryHeight > pageHeight - 25) {
      // 25 for footer margin
      doc.addPage();
      addHeader();
    }

    doc.setDrawColor(200);
    doc.line(margin, y - 5, pageWidth - margin, y - 5);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(dateMoodLine, margin, y);
    y += dateMoodHeight + 2;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(contentLines, margin, y);
    y += contentHeight + 10;
  });

  // Add footers to all pages
  // doc.internal.getNumberOfPages() is not available in the version of jspdf being used.
  // We are using doc.internal.pages.length - 1 as a workaround to get the total number of pages.
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" },
    );
  }

  doc.save("mindful_moments.pdf");
};

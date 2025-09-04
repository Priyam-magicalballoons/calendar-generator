import { useState } from "react";

export interface PDFOptions {
  format: "A4" | "Letter" | "A3";
  orientation: "portrait" | "landscape";
  quality: "standard" | "high";
  includeImages: boolean;
  template: string;
}

export interface CalendarPDFData {
  userDetails: {
    name: string;
    birthdate: string;
    anniversary: string;
    additionalDates: string;
  };
  year: number;
  months: any[]; // each month must contain .dates[] with { date, isCurrentMonth, events }
  images: { [month: string]: string };
  template: string;
  enabledHolidayCategories: string[];
}

export async function generateCalendarPDF(
  data: CalendarPDFData,
  options: PDFOptions
): Promise<Blob> {
  const jsPDF = (await import("jspdf")).default;

  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a3",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Load images helper
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    // Load static template + icons
    const bgImage = await loadImage("/calendar.png");
    const cakeImage = await loadImage("/cake.png");
    const heartImage = await loadImage("/heart.png");

    // Loop through all months
    for (let monthIndex = 0; monthIndex < data.months.length; monthIndex++) {
      if (monthIndex > 0) pdf.addPage();

      const month = data.months[monthIndex];

      // --- Add month image first (behind template frame) ---
      const monthImageSrc = data.images[month.monthName];
      if (monthImageSrc) {
        try {
          const monthImage = await loadImage(monthImageSrc);
          const photoX = pageWidth * 0.58;
          const photoY = 15;
          const photoW = pageWidth * 0.38;
          const photoH = pageHeight * 0.55;
          pdf.addImage(monthImage, "JPEG", photoX, photoY, photoW, photoH);
        } catch (err) {
          console.warn("Month image failed to load:", month.monthName);
        }
      }

      // --- Overlay template (frame effect) ---
      pdf.addImage(bgImage, "PNG", 0, 0, pageWidth, pageHeight);

      // --- Grid mapping ---
      const cols = 7; // SUN–SAT
      const rows = 5; // only 5 rows shown in template
      const marginTop = 150;
      const marginLeft = 31;
      const cellWidth = 35;
      const cellHeight = 26;

      month.dates.forEach((day: any, idx: number) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        const x = marginLeft + col * cellWidth;
        const y = marginTop + row * cellHeight;

        // ✅ Only render if day belongs to the current month
        if (day.isCurrentMonth) {
          // Draw day number
          pdf.setFontSize(18);
          pdf.setTextColor(0, 0, 0);

          const dayNumber =
            day.date instanceof Date
              ? day.date.getDate()
              : typeof day.date === "string"
              ? new Date(day.date).getDate()
              : day.date;

          pdf.text(String(dayNumber), x + 3, y + 8);

          // Render events stacked inside the same cell
          if (day.events && day.events.length > 0) {
            pdf.setFontSize(10);

            day.events.forEach((event: any, i: number) => {
              pdf.setTextColor(event.color || 50, 50, 50);
              pdf.text(
                `${event.title && "-" + event.title}`,
                x - 20,
                y + 14 + i * 6, // stack events vertically
                { maxWidth: cellWidth - 6 }
              );
            });
          }

          // Icons
          const iconSize = 8;
          let iconX = x + cellWidth - iconSize - 47;
          const iconY = y + 2;

          if (day.events?.some((e: any) => e.id === "birthday")) {
            pdf.addImage(cakeImage, "PNG", iconX, iconY, iconSize, iconSize);
            iconX -= iconSize + 2;
          }
          if (day.events?.some((e: any) => e.id === "anniversary")) {
            pdf.addImage(heartImage, "PNG", iconX, iconY, iconSize, iconSize);
          }
        }
      });
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("PDF generation error:", error);
    return createFallbackPDF(data);
  }
}

function createFallbackPDF(data: CalendarPDFData): Promise<Blob> {
  return new Promise((resolve) => {
    const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 120 >> stream
BT /F1 16 Tf 50 750 Td (${data.userDetails.name}'s ${data.year} Calendar) Tj
0 -30 Td (PDF generation encountered an error.) Tj
0 -20 Td (Please try again or contact support.) Tj
ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
400
%%EOF`;
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    resolve(blob);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getOptimalPDFSettings(template: string): PDFOptions {
  const settings: { [key: string]: PDFOptions } = {
    classic: {
      format: "A4",
      orientation: "portrait",
      quality: "standard",
      includeImages: true,
      template: "classic",
    },
    modern: {
      format: "A4",
      orientation: "portrait",
      quality: "high",
      includeImages: true,
      template: "modern",
    },
    minimal: {
      format: "Letter",
      orientation: "portrait",
      quality: "standard",
      includeImages: false,
      template: "minimal",
    },
    elegant: {
      format: "A4",
      orientation: "portrait",
      quality: "high",
      includeImages: true,
      template: "elegant",
    },
  };
  return settings[template] || settings.classic;
}

import { forwardRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from "docx";
import { saveAs } from "file-saver";
import { ResumeData, ResumeContact, ResumeSection as ResumeSectionType, ResumeItem } from "@/types/resume";

// === ResumeHeader ===
const ResumeHeader = ({ name, contact }: { name: string; contact: ResumeContact }) => {
  const contactParts = [contact.email, contact.phone, contact.location].filter(Boolean);
  return (
    <header className="pb-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-resume-text mb-2">{name}</h1>
      <p className="text-sm text-resume-text">{contactParts.join(" | ")}</p>
    </header>
  );
};

// Helper to parse **bold** text
const parseBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

// === ResumeItemEntry ===
const ResumeItemEntry = ({ item }: { item: ResumeItem }) => {
  const hasBoldLine = item.boldLeft || item.boldRight;
  const hasItalicLine = item.italicLeft || item.italicRight;
  const hasBullets = item.bullets && item.bullets.length > 0;
  const hasParagraph = item.paragraph && item.paragraph.trim() !== "";

  return (
    <div className="leading-relaxed">
      {hasBoldLine && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
          {item.boldLeft && <h4 className="font-semibold text-resume-text">{item.boldLeft}</h4>}
          {item.boldRight && <span className="font-semibold text-sm text-resume-text whitespace-nowrap">{item.boldRight}</span>}
        </div>
      )}
      {hasItalicLine && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
          {item.italicLeft && <span className="text-sm text-resume-text-secondary italic">{item.italicLeft}</span>}
          {item.italicRight && <span className="text-sm text-resume-text-secondary">{item.italicRight}</span>}
        </div>
      )}
      {hasBullets && (
        <ul className="list-outside ml-5" style={{ listStyleType: 'disc' }}>
          {item.bullets?.map((bullet, idx) => (
            <li key={idx} className="text-sm text-resume-text marker:text-resume-text marker:text-sm">
              {parseBoldText(bullet)}
            </li>
          ))}
        </ul>
      )}
      {hasParagraph && (
        <p className="text-sm text-resume-text">{item.paragraph}</p>
      )}
    </div>
  );
};

// === ResumeSection ===
const ResumeSection = ({ section }: { section: ResumeSectionType }) => {
  return (
    <section className="mb-5 animate-fade-in">
      <div className="mb-3">
        <h3 className="resume-section-title text-base font-bold pb-1 border-b border-resume-text">{section.title}</h3>
      </div>
      <div className="space-y-4">
        {section.items.map((item, index) => (
          <ResumeItemEntry key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

// === ResumePaper (single continuous page - no artificial pagination) ===
export const ResumePaper = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  return (
    <div ref={ref} className="w-full max-w-[210mm] mx-auto font-serif">
      <div
        className="resume-paper w-full rounded-sm flex flex-col"
        style={{ 
          padding: "clamp(2rem, 7%, 3rem)"
        }}
      >
        <ResumeHeader name={data.name} contact={data.contact} />
        {data.sections.map((section, sIdx) => (
          <ResumeSection key={sIdx} section={section} />
        ))}
        {data.copyright && (
          <footer className="text-center mt-14">
            <p className="text-sm text-resume-text-secondary">{data.copyright}</p>
          </footer>
        )}
      </div>
    </div>
  );
});
ResumePaper.displayName = "ResumePaper";

// === ExportModal ===
interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
}

export const ExportModal = ({ open, onOpenChange, resumeData }: ExportModalProps) => {
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

  const exportToPDF = async () => {
    setExporting("pdf");
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const bottomMargin = 20; // Equal to top margin
      const contentWidth = pageWidth - margin * 2;
      const maxY = pageHeight - bottomMargin; // Stop content before bottom margin
      let yPosition = margin;

      // Check if we need a new page (with proper bottom margin)
      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > maxY) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Header: Full name - 18pt
      pdf.setFont("times", "bold");
      pdf.setFontSize(18);
      pdf.text(resumeData.name, margin, yPosition);
      yPosition += 8;

      // Contact info - 10pt
      pdf.setFontSize(10);
      pdf.setFont("times", "normal");
      const contactParts = [resumeData.contact.email, resumeData.contact.phone, resumeData.contact.location].filter(Boolean);
      pdf.text(contactParts.join(" | "), margin, yPosition);
      yPosition += 10;

      for (const section of resumeData.sections) {
        // Check if section title fits
        checkPageBreak(15);
        
        // Section title - 11pt bold
        pdf.setFontSize(11);
        pdf.setFont("times", "bold");
        pdf.text(section.title.toUpperCase(), margin, yPosition);
        yPosition += 4;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        for (const item of section.items) {
          if (item.boldLeft || item.boldRight) {
            checkPageBreak(5);
            pdf.setFont("times", "bold");
            if (item.boldLeft) pdf.text(item.boldLeft, margin, yPosition);
            if (item.boldRight) {
              const dateWidth = pdf.getTextWidth(item.boldRight);
              pdf.text(item.boldRight, pageWidth - margin - dateWidth, yPosition);
            }
            yPosition += 5;
          }

          if (item.italicLeft || item.italicRight) {
            checkPageBreak(5);
            pdf.setFont("times", "italic");
            if (item.italicLeft) pdf.text(item.italicLeft, margin, yPosition);
            if (item.italicRight) {
              pdf.setFont("times", "normal");
              const textWidth = pdf.getTextWidth(item.italicRight);
              pdf.text(item.italicRight, pageWidth - margin - textWidth, yPosition);
            }
            yPosition += 5;
          }

          if (item.bullets && item.bullets.length > 0) {
            for (const bullet of item.bullets) {
              // Parse bold markers for PDF
              const plainBullet = bullet.replace(/\*\*([^*]+)\*\*/g, "$1");
              const boldMatches = [...bullet.matchAll(/\*\*([^*]+)\*\*/g)];
              const boldTexts = boldMatches.map(m => m[1]);
              
              const bulletText = `• ${plainBullet}`;
              const lines = pdf.splitTextToSize(bulletText, contentWidth - 5);
              
              // Check if bullet fits
              checkPageBreak(lines.length * 4.5);
              
              // Render with bold parts
              for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                const line = lines[lineIdx];
                let remaining = line;
                let xPos = margin + 3;
                
                // Check if line contains bold text
                let hasBold = false;
                for (const boldText of boldTexts) {
                  if (remaining.includes(boldText)) {
                    hasBold = true;
                    const parts = remaining.split(boldText);
                    
                    // Before bold
                    if (parts[0]) {
                      pdf.setFont("times", "normal");
                      pdf.text(parts[0], xPos, yPosition);
                      xPos += pdf.getTextWidth(parts[0]);
                    }
                    
                    // Bold part
                    pdf.setFont("times", "bold");
                    pdf.text(boldText, xPos, yPosition);
                    xPos += pdf.getTextWidth(boldText);
                    
                    // After bold
                    if (parts[1]) {
                      pdf.setFont("times", "normal");
                      pdf.text(parts[1], xPos, yPosition);
                    }
                    break;
                  }
                }
                
                if (!hasBold) {
                  pdf.setFont("times", "normal");
                  pdf.text(line, margin + 3, yPosition);
                }
                yPosition += 4.5;
              }
            }
            yPosition += 1;
          }

          if (item.paragraph && item.paragraph.trim() !== "") {
            pdf.setFont("times", "normal");
            const lines = pdf.splitTextToSize(item.paragraph, contentWidth);
            const paragraphHeight = lines.length * 4.5;
            checkPageBreak(paragraphHeight);
            
            for (let i = 0; i < lines.length; i++) {
              pdf.text(lines[i], margin, yPosition);
              yPosition += 4.5; // Line spacing within paragraph
            }
            yPosition += 1; // Reduced spacing after paragraph
          }

          yPosition += 2;
        }
        yPosition += 2; // Reduced from 3 to 2 for less space before next section
      }

      pdf.save(`${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("PDF exported successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(null);
    }
  };

  const exportToDocx = async () => {
    setExporting("docx");
    try {
      const children: Paragraph[] = [];
      const rightTabStop = TabStopPosition.MAX;

      children.push(
        new Paragraph({
          children: [new TextRun({ text: resumeData.name, bold: true, size: 36, font: "Times New Roman" })],
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
        })
      );

      const contactParts = [resumeData.contact.email, resumeData.contact.phone, resumeData.contact.location].filter(Boolean);
      children.push(
        new Paragraph({
          children: [new TextRun({ text: contactParts.join(" | "), size: 20, font: "Times New Roman" })],
          alignment: AlignmentType.LEFT,
          spacing: { after: 300 },
        })
      );

      for (const section of resumeData.sections) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: section.title.toUpperCase(), bold: true, size: 22, font: "Times New Roman", color: "000000" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            border: { bottom: { color: "000000", size: 6, style: "single", space: 1 } },
          })
        );

        for (const item of section.items) {
          if (item.boldLeft || item.boldRight) {
            const titleRuns: TextRun[] = [];
            if (item.boldLeft) titleRuns.push(new TextRun({ text: item.boldLeft, bold: true, size: 22, font: "Times New Roman" }));
            if (item.boldRight) {
              titleRuns.push(new TextRun({ text: "\t", font: "Times New Roman" }));
              titleRuns.push(new TextRun({ text: item.boldRight, bold: true, size: 22, font: "Times New Roman" }));
            }
            children.push(
              new Paragraph({
                children: titleRuns,
                spacing: { before: 150 },
                tabStops: [{ type: TabStopType.RIGHT, position: rightTabStop }],
              })
            );
          }

          if (item.italicLeft || item.italicRight) {
            const italicRuns: TextRun[] = [];
            if (item.italicLeft) italicRuns.push(new TextRun({ text: item.italicLeft, italics: true, size: 20, font: "Times New Roman" }));
            if (item.italicRight) {
              italicRuns.push(new TextRun({ text: "\t", font: "Times New Roman" }));
              italicRuns.push(new TextRun({ text: item.italicRight, size: 20, font: "Times New Roman" }));
            }
            children.push(
              new Paragraph({
                children: italicRuns,
                tabStops: [{ type: TabStopType.RIGHT, position: rightTabStop }],
              })
            );
          }

          if (item.bullets && item.bullets.length > 0) {
            for (const bullet of item.bullets) {
              // Parse bold markers **text**
              const textRuns: TextRun[] = [];
              const parts = bullet.split(/(\*\*[^*]+\*\*)/g);
              for (const part of parts) {
                if (part.startsWith("**") && part.endsWith("**")) {
                  textRuns.push(new TextRun({ text: part.slice(2, -2), bold: true, size: 20, font: "Times New Roman" }));
                } else if (part) {
                  textRuns.push(new TextRun({ text: part, size: 20, font: "Times New Roman" }));
                }
              }
              children.push(
                new Paragraph({
                  children: textRuns,
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
              );
            }
          }

          if (item.paragraph && item.paragraph.trim() !== "") {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: item.paragraph, size: 20, font: "Times New Roman" })],
                spacing: { after: 100 },
              })
            );
          }
        }
      }

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${resumeData.name.replace(/\s+/g, "_")}_Resume.docx`);
      toast.success("DOCX exported successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("DOCX export error:", error);
      toast.error("Failed to export DOCX");
    } finally {
      setExporting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Export Resume</DialogTitle>
          <DialogDescription>Choose your preferred format to download your resume.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button variant="outline" className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5 hover:text-foreground" onClick={exportToPDF} disabled={exporting !== null}>
            {exporting === "pdf" ? <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" /> : <FileText className="w-8 h-8 text-red-500" aria-hidden="true" />}
            <span className="font-medium">PDF</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5 hover:text-foreground" onClick={exportToDocx} disabled={exporting !== null}>
            {exporting === "docx" ? <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" /> : <FileIcon className="w-8 h-8 text-blue-500" aria-hidden="true" />}
            <span className="font-medium">DOCX</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

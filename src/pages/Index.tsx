import { useState, useRef, useCallback, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ResumePaper, ExportModal } from "@/components/resume/Resume";
import { ResumeData } from "@/types/resume";
import initialResumeData from "@/data/resumeData";

const Index = () => {
  const [resumeData] = useState<ResumeData>(initialResumeData);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLongPressStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      setExportModalOpen(true);
    }, 2000);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <ContextMenu>
        <ContextMenuTrigger
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          onTouchCancel={handleLongPressEnd}
        >
          <article>
            <ResumePaper ref={resumeRef} data={resumeData} />
          </article>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setExportModalOpen(true)}>
            Export
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        resumeData={resumeData}
      />
    </main>
  );
};

export default Index;

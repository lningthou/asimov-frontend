import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

interface RerunViewerProps {
  rrdUrl: string | null;
  className?: string;
}

// Version should match the Rerun SDK version used to generate .rrd files
const RERUN_VERSION = '0.27.2';

export default function RerunViewer({ rrdUrl, className = '' }: RerunViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle URL changes
  useEffect(() => {
    if (!rrdUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Force new iframe instance for each URL change
    setIframeKey(prev => prev + 1);
  }, [rrdUrl]);

  const handleIframeLoad = () => {
    // Give the viewer a moment to initialize after iframe loads
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (!rrdUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-muted-foreground ${className}`}>
        No recording selected
      </div>
    );
  }

  // Use the hosted Rerun viewer with the RRD URL
  const viewerUrl = `https://app.rerun.io/version/${RERUN_VERSION}/?url=${encodeURIComponent(rrdUrl)}`;

  const handleOpenInNewTab = () => {
    window.open(viewerUrl, '_blank');
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-end px-3 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
        <Button variant="ghost" size="sm" onClick={handleOpenInNewTab}>
          <ExternalLink size={14} />
          Open in new tab
        </Button>
      </div>
      {/* Rerun Viewer via iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={viewerUrl}
          onLoad={handleIframeLoad}
          className="w-full h-full border-0"
          allow="fullscreen"
          title="Rerun Viewer"
        />
      </div>
    </div>
  );
}

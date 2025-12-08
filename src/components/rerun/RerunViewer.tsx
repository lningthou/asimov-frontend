import WebViewer from '@rerun-io/web-viewer-react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RerunViewerProps {
  rrdUrl: string | null;
  className?: string;
}

// Version should match the Rerun SDK version used to generate .rrd files
const RERUN_VERSION = '0.27.2';

export default function RerunViewer({ rrdUrl, className = '' }: RerunViewerProps) {
  if (!rrdUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-muted-foreground ${className}`}>
        No recording selected
      </div>
    );
  }

  const viewerUrl = `https://app.rerun.io/version/${RERUN_VERSION}/index.html?url=${encodeURIComponent(rrdUrl)}`;

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
      {/* Rerun React Component */}
      <div className="flex-1">
        <WebViewer
          width="100%"
          height="100%"
          rrd={rrdUrl}
          hide_welcome_screen
        />
      </div>
    </div>
  );
}

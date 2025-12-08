import WebViewer from '@rerun-io/web-viewer-react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface RerunViewerProps {
  rrdUrl: string | null;
  className?: string;
}

// Version should match the Rerun SDK version used to generate .rrd files
const RERUN_VERSION = '0.27.2';

export default function RerunViewer({ rrdUrl, className = '' }: RerunViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewerKey, setViewerKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [deferredUrl, setDeferredUrl] = useState<string | null>(null);

  // Defer WebViewer mounting on initial load to avoid WASM race condition
  useEffect(() => {
    // Give WASM time to initialize on first mount
    const initTimer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(initTimer);
  }, []);

  // Handle URL changes - runs when isReady becomes true OR when rrdUrl changes
  useEffect(() => {
    if (!rrdUrl || !isReady) {
      return;
    }

    setIsLoading(true);
    // Defer URL assignment to next tick to avoid race condition
    setDeferredUrl(null);
    setViewerKey(prev => prev + 1);

    const urlTimer = setTimeout(() => {
      setDeferredUrl(rrdUrl);
    }, 100);

    // Give the viewer time to initialize
    const loadTimer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      clearTimeout(urlTimer);
      clearTimeout(loadTimer);
    };
  }, [rrdUrl, isReady]);

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
      <div className="flex-1 relative">
        {(isLoading || !isReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {isReady && deferredUrl && (
          <WebViewer
            key={viewerKey}
            width="100%"
            height="100%"
            rrd={deferredUrl}
            hide_welcome_screen
          />
        )}
      </div>
    </div>
  );
}

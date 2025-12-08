interface RerunViewerProps {
  rrdUrl: string | null;
  className?: string;
}

// Using iframe approach - more reliable than WASM embedding
// Version should match the Rerun SDK version used to generate .rrd files
const RERUN_VERSION = '0.22.1';

export default function RerunViewer({ rrdUrl, className = '' }: RerunViewerProps) {
  if (!rrdUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-muted-foreground ${className}`}>
        No recording selected
      </div>
    );
  }

  const viewerUrl = `https://app.rerun.io/version/${RERUN_VERSION}/index.html?url=${encodeURIComponent(rrdUrl)}`;

  return (
    <iframe
      src={viewerUrl}
      className={`w-full h-full border-0 ${className}`}
      allow="fullscreen"
      title="Rerun Viewer"
    />
  );
}

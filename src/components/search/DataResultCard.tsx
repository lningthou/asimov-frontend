import { useState } from 'react';
import { Download, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import JSZip from 'jszip';
import type { GroupedDataResult } from './mockData';

const downloadBlob = (blob: Blob, filename: string) => {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 100);
};

const fetchFileBlob = async (url: string, filename: string): Promise<{ blob: Blob; filename: string }> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }
  const blob = await response.blob();
  return { blob, filename };
};

const handleDownloadBoth = async (mp4Url: string, hdf5Url: string, taskName: string, fileIndex: number) => {
  try {
    toast.info('Preparing download...');

    const zip = new JSZip();

    const [mp4Data, hdf5Data] = await Promise.all([
      fetchFileBlob(mp4Url, `${taskName}_${fileIndex}.mp4`),
      fetchFileBlob(hdf5Url, `${taskName}_${fileIndex}.hdf5`),
    ]);

    zip.file(mp4Data.filename, mp4Data.blob);
    zip.file(hdf5Data.filename, hdf5Data.blob);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${taskName}_${fileIndex}.zip`);

    toast.success('Download complete');
  } catch (error) {
    console.error('Download failed:', error);
    toast.error('Failed to download files');
  }
};

const handleDownloadAll = async (result: GroupedDataResult) => {
  try {
    toast.info(`Preparing ${result.files.length * 2} files...`);

    const zip = new JSZip();
    const fetchPromises: Promise<{ blob: Blob; filename: string }>[] = [];

    result.files.forEach((file, idx) => {
      fetchPromises.push(
        fetchFileBlob(file.mp4, `${result.task}_${idx + 1}.mp4`),
        fetchFileBlob(file.hdf5, `${result.task}_${idx + 1}.hdf5`)
      );
    });

    const allFiles = await Promise.all(fetchPromises);

    allFiles.forEach(({ blob, filename }) => {
      zip.file(filename, blob);
    });

    toast.info('Creating zip file...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${result.task}_all.zip`);

    toast.success('Download complete');
  } catch (error) {
    console.error('Download failed:', error);
    toast.error('Failed to download files');
  }
};

interface DataResultCardProps {
  result: GroupedDataResult;
}

export default function DataResultCard({ result }: DataResultCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const formatTaskName = (task: string) => {
    return task
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatScore = (score: number) => {
    return `${(score * 100).toFixed(0)}%`;
  };

  return (
    <>
      <div className="glass-card p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold leading-tight">
            {formatTaskName(result.task)}
          </h3>
          <span className="text-xs text-[var(--accent)] font-medium shrink-0">
            {formatScore(result.avgScore)}
          </span>
        </div>

        {/* Description */}
        <p className="text-secondary text-sm line-clamp-3 flex-1 mb-4">
          {result.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-muted mb-4">
          <span className="font-mono">{result.task}</span>
          {result.files.length > 1 && (
            <span className="flex items-center gap-1">
              <FileVideo size={12} />
              {result.files.length} demos
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleDownloadAll(result)}
            className="flex-1 btn-primary h-9 text-sm"
          >
            <Download size={14} className="mr-1.5" />
            Download
          </Button>
          <Button
            onClick={() => setPreviewOpen(true)}
            variant="outline"
            className="flex-1 btn-ghost h-9 text-sm"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-[var(--bg)] border-[var(--border)] max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formatTaskName(result.task)}</DialogTitle>
            <DialogDescription className="text-secondary">
              {result.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Metadata */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted">Task:</span>
                <span className="ml-2">{result.task}</span>
              </div>
              <div>
                <span className="text-muted">Match:</span>
                <span className="ml-2 text-[var(--accent)]">{formatScore(result.avgScore)}</span>
              </div>
            </div>

            {/* Files List */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-sm text-secondary">
                <FileVideo size={14} />
                <span>{result.files.length} demonstrations</span>
              </div>

              <div className="space-y-2">
                {result.files.map((file, idx) => (
                  <div key={idx} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Demo {idx + 1}</span>
                      <span className="text-xs text-muted ml-2">MP4 + HDF5</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--accent)]">
                        {formatScore(file.score)}
                      </span>
                      <Button
                        onClick={() => handleDownloadBoth(file.mp4, file.hdf5, result.task, idx + 1)}
                        className="btn-primary h-8 text-xs px-4"
                      >
                        <Download size={12} className="mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

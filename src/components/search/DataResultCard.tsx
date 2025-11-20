import { useState } from 'react';
import { Target, FileVideo, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import JSZip from 'jszip';
import type { GroupedDataResult } from './mockData';

// Helper to download a blob as a file
const downloadBlob = (blob: Blob, filename: string) => {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up blob URL after a short delay
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 100);
};

// Fetch file as blob
const fetchFileBlob = async (url: string, filename: string): Promise<{ blob: Blob; filename: string }> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }
  const blob = await response.blob();
  return { blob, filename };
};

// Download both MP4 and HDF5 as a zip
const handleDownloadBoth = async (mp4Url: string, hdf5Url: string, taskName: string, fileIndex: number) => {
  try {
    toast.info('Preparing download...');
    
    const zip = new JSZip();
    
    // Fetch both files
    const [mp4Data, hdf5Data] = await Promise.all([
      fetchFileBlob(mp4Url, `${taskName}_${fileIndex}.mp4`),
      fetchFileBlob(hdf5Url, `${taskName}_${fileIndex}.hdf5`),
    ]);
    
    // Add files to zip
    zip.file(mp4Data.filename, mp4Data.blob);
    zip.file(hdf5Data.filename, hdf5Data.blob);
    
    // Generate zip and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${taskName}_${fileIndex}.zip`);
    
    toast.success('Download complete!');
  } catch (error) {
    console.error('Download failed:', error);
    toast.error('Failed to download files. Please try again.');
  }
};

// Download all files in a grouped result as a zip
const handleDownloadAll = async (result: GroupedDataResult) => {
  try {
    toast.info(`Preparing ${result.files.length * 2} files...`);
    
    const zip = new JSZip();
    
    // Fetch all files in parallel
    const fetchPromises: Promise<{ blob: Blob; filename: string }>[] = [];
    
    result.files.forEach((file, idx) => {
      fetchPromises.push(
        fetchFileBlob(file.mp4, `${result.task}_${idx + 1}.mp4`),
        fetchFileBlob(file.hdf5, `${result.task}_${idx + 1}.hdf5`)
      );
    });
    
    const allFiles = await Promise.all(fetchPromises);
    
    // Add all files to zip
    allFiles.forEach(({ blob, filename }) => {
      zip.file(filename, blob);
    });
    
    // Generate zip and download
    toast.info('Creating zip file...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${result.task}_all.zip`);
    
    toast.success('Download complete!');
  } catch (error) {
    console.error('Download failed:', error);
    toast.error('Failed to download files. Please try again.');
  }
};

interface DataResultCardProps {
  result: GroupedDataResult;
}

export default function DataResultCard({ result }: DataResultCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Format task name for display (e.g., "throw_and_catch_ball" -> "Throw and Catch Ball")
  const formatTaskName = (task: string) => {
    return task
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format score as percentage
  const formatScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <>
      <div className="hairline bg-[var(--surface)] rounded-none p-6 flex flex-col h-full hover:border-[var(--border-strong)] transition-all">
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-primary line-clamp-1">
              {formatTaskName(result.task)}
            </h3>
            <Badge
              variant="outline"
              className="text-xs border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] flex-shrink-0"
              title="Similarity score - how well this matches your query"
            >
              <span className="text-[10px] opacity-70 mr-1">Match:</span>
              {formatScore(result.avgScore)}
            </Badge>
          </div>

          <p className="text-secondary text-sm line-clamp-3">
            {result.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between gap-2 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <Target size={14} />
              <span className="font-mono text-xs">{result.task}</span>
            </div>
            {result.files.length > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <FileVideo size={14} />
                <span>{result.files.length} demos ({result.files.length * 2} files)</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => handleDownloadAll(result)}
            className="flex-1 bg-[var(--accent)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={16} className="mr-2" />
            Download All
          </Button>
          <Button
            onClick={() => setPreviewOpen(true)}
            variant="outline"
            className="flex-1 border-[var(--border)] hover:border-[var(--accent)] rounded-none"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-[var(--bg)] border-[var(--border)] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">{formatTaskName(result.task)}</DialogTitle>
            <DialogDescription className="text-secondary">
              {result.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary">Task:</span>
                <span className="text-primary ml-2">{result.task}</span>
              </div>
              <div>
                <span className="text-secondary">Similarity:</span>
                <span className="text-primary ml-2">{formatScore(result.avgScore)}</span>
              </div>
            </div>

            {/* Files List */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileVideo size={16} className="text-secondary" />
                <span className="text-secondary text-sm font-medium">
                  Demonstrations ({result.files.length}) · {result.files.length * 2} total files
                </span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {result.files.map((file, idx) => (
                  <div key={idx} className="bg-[var(--surface)] hairline p-4 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">Demo {idx + 1} <span className="text-xs text-secondary">(MP4 + HDF5)</span></span>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        title="Similarity score for this file"
                      >
                        <span className="text-[10px] opacity-70 mr-1">Match:</span>
                        {formatScore(file.score)}
                      </Badge>
                    </div>
                    
                    {/* Download Button */}
                    <Button
                      onClick={() => handleDownloadBoth(file.mp4, file.hdf5, result.task, idx + 1)}
                      className="w-full bg-[var(--accent)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity h-9"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                    
                    {/* File URLs */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-secondary text-xs block mb-1">MP4:</span>
                        <p className="text-primary text-xs font-mono break-all opacity-70">
                          {file.mp4}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary text-xs block mb-1">HDF5:</span>
                        <p className="text-primary text-xs font-mono break-all opacity-70">
                          {file.hdf5}
                        </p>
                      </div>
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

import { useState } from 'react';
import { Play, Clock, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { DataResult } from './mockData';

interface DataResultCardProps {
  result: DataResult;
}

export default function DataResultCard({ result }: DataResultCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Asimov':
        return 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]';
      case 'Ego4D':
        return 'bg-[var(--accent-2)]/20 text-[var(--accent-2)] border-[var(--accent-2)]';
      case 'EgoDex':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500';
      default:
        return 'bg-[var(--panel)] text-[var(--text-secondary)]';
    }
  };

  return (
    <>
      <div className="hairline bg-[var(--surface)] rounded-none p-6 flex flex-col h-full hover:border-[var(--border-strong)] transition-all">
        {/* Thumbnail placeholder */}
        <div className="w-full aspect-video bg-[var(--bg)] rounded-none mb-4 flex items-center justify-center hairline">
          <Play size={48} className="text-secondary opacity-50" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-primary line-clamp-2">
            {result.title}
          </h3>

          <p className="text-secondary text-sm line-clamp-2">
            {result.description}
          </p>

          {/* Modalities */}
          <div className="flex flex-wrap gap-2">
            {result.modalities.map((modality) => (
              <Badge
                key={modality}
                variant="outline"
                className="text-xs border-[var(--border)] bg-transparent"
              >
                {modality}
              </Badge>
            ))}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-secondary">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{result.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Database size={14} />
              <span className={`tag ${getSourceColor(result.source)}`}>
                {result.source}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Button */}
        <Button
          onClick={() => setPreviewOpen(true)}
          variant="outline"
          className="w-full mt-4 border-[var(--border)] hover:border-[var(--accent)] rounded-none"
        >
          Preview
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-[var(--bg)] border-[var(--border)] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-primary">{result.title}</DialogTitle>
            <DialogDescription className="text-secondary">
              {result.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video placeholder */}
            <div className="w-full aspect-video bg-[var(--surface)] rounded-none flex items-center justify-center hairline">
              <div className="text-center">
                <Play size={64} className="text-secondary opacity-50 mx-auto mb-2" />
                <p className="text-secondary text-sm">Video preview placeholder</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary">Duration:</span>
                <span className="text-primary ml-2">{result.duration}</span>
              </div>
              <div>
                <span className="text-secondary">Source:</span>
                <span className="text-primary ml-2">{result.source}</span>
              </div>
              <div>
                <span className="text-secondary">Task Type:</span>
                <span className="text-primary ml-2">{result.taskType}</span>
              </div>
              <div>
                <span className="text-secondary">Environment:</span>
                <span className="text-primary ml-2">{result.environment}</span>
              </div>
            </div>

            <div>
              <span className="text-secondary">Modalities:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.modalities.map((modality) => (
                  <Badge key={modality} variant="outline" className="border-[var(--border)]">
                    {modality}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

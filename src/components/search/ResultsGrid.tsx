import { Skeleton } from '@/components/ui/skeleton';
import DataResultCard from './DataResultCard';
import EmptyState from './EmptyState';
import type { DataResult } from './mockData';

interface ResultsGridProps {
  results: DataResult[];
  loading: boolean;
  onReset: () => void;
}

export default function ResultsGrid({ results, loading, onReset }: ResultsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="hairline bg-[var(--surface)] rounded-none p-6 space-y-4">
            <Skeleton className="w-full aspect-video bg-[var(--bg)]" />
            <Skeleton className="h-6 w-3/4 bg-[var(--bg)]" />
            <Skeleton className="h-4 w-full bg-[var(--bg)]" />
            <Skeleton className="h-4 w-2/3 bg-[var(--bg)]" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 bg-[var(--bg)]" />
              <Skeleton className="h-6 w-16 bg-[var(--bg)]" />
              <Skeleton className="h-6 w-16 bg-[var(--bg)]" />
            </div>
            <Skeleton className="h-10 w-full bg-[var(--bg)]" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, index) => (
        <div key={`${result.task}-${index}`}>
          <DataResultCard result={result} />
        </div>
      ))}
    </div>
  );
}

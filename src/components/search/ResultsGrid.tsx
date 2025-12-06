import { Skeleton } from '@/components/ui/skeleton';
import DataResultCard from './DataResultCard';
import EmptyState from './EmptyState';
import type { GroupedDataResult } from './mockData';

interface ResultsGridProps {
  results: GroupedDataResult[];
  loading: boolean;
  onReset: () => void;
}

export default function ResultsGrid({ results, loading, onReset }: ResultsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <Skeleton className="h-5 w-3/4 bg-[var(--surface-elevated)]" />
            <Skeleton className="h-4 w-full bg-[var(--surface-elevated)]" />
            <Skeleton className="h-4 w-2/3 bg-[var(--surface-elevated)]" />
            <div className="pt-2 flex gap-2">
              <Skeleton className="h-9 flex-1 bg-[var(--surface-elevated)]" />
              <Skeleton className="h-9 flex-1 bg-[var(--surface-elevated)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result, index) => (
        <DataResultCard key={`${result.description}-${index}`} result={result} />
      ))}
    </div>
  );
}

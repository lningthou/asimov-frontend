import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="glass rounded-full p-8 mb-6">
        <SearchX size={64} className="text-[var(--text-secondary)]" />
      </div>

      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        No results found
      </h3>

      <p className="text-[var(--text-secondary)] mb-6 max-w-md">
        We couldn't find any data matching your search query. Try different search terms.
      </p>

      <Button
        onClick={onReset}
        variant="outline"
        className="border-[var(--border)] hover:bg-[var(--panel-strong)] hover:border-[var(--accent)]"
      >
        Clear Search
      </Button>
    </div>
  );
}

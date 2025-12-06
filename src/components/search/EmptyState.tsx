import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6">
        <SearchX size={48} className="text-muted" />
      </div>

      <h3 className="text-xl font-semibold mb-2">
        No results found
      </h3>

      <p className="text-secondary mb-8 max-w-sm">
        We couldn't find any data matching your search. Try different terms.
      </p>

      <Button
        onClick={onReset}
        className="btn-ghost"
      >
        Clear Search
      </Button>
    </div>
  );
}

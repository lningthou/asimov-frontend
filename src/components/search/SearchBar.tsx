import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="hairline bg-[var(--surface)] rounded-none p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
          <Input
            type="text"
            placeholder='Try "folding t-shirts in laundry room"'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 bg-[var(--bg)] border-[var(--border)] text-primary h-12"
          />
        </div>
        <Button
          type="submit"
          className="bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent)]/90 shadow-lg h-12 px-8 rounded-none"
        >
          Search
        </Button>
      </div>
      <p className="text-secondary text-sm mt-2 ml-1">
        Search by task, environment, object, or natural language description
      </p>
    </form>
  );
}

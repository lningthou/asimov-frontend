import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void | Promise<void>;
  searchMode: 'semantic' | 'keyword' | 'hybrid';
  onSearchModeChange: (mode: 'semantic' | 'keyword' | 'hybrid') => void;
  kValue: number;
  onKValueChange: (k: number) => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  searchMode,
  onSearchModeChange,
  kValue,
  onKValueChange,
}: SearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <Input
            type="text"
            placeholder='Search for tasks like "stack blocks" or "fold laundry"'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-11 bg-[var(--surface)] border-[var(--border)] text-primary h-12 placeholder:text-muted"
          />
        </div>
        <Button
          type="submit"
          className="btn-primary h-12 px-8"
        >
          Search
        </Button>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors"
      >
        <span>Options</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="search-mode" className="text-xs text-secondary">
              Search Mode
            </Label>
            <Select value={searchMode} onValueChange={onSearchModeChange}>
              <SelectTrigger
                id="search-mode"
                className="bg-[var(--surface)] border-[var(--border)] h-10"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="semantic">Semantic</SelectItem>
                <SelectItem value="keyword">Keyword</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted">
              {searchMode === 'hybrid' && 'Combines semantic and keyword search'}
              {searchMode === 'semantic' && 'Uses AI to find similar results'}
              {searchMode === 'keyword' && 'Exact word matching'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="k-value" className="text-xs text-secondary">
              Max Results
            </Label>
            <Select value={String(kValue)} onValueChange={(v) => onKValueChange(Number(v))}>
              <SelectTrigger
                id="k-value"
                className="bg-[var(--surface)] border-[var(--border)] h-10"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
                <SelectItem value="500">500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </form>
  );
}

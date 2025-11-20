import { Search, Settings2 } from 'lucide-react';
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
      <div className="hairline bg-[var(--surface)] rounded-none p-4 space-y-4">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <Input
              type="text"
              placeholder='Try "jenga" or "throw ball"'
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

        {/* Advanced Settings Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
        >
          <Settings2 size={16} />
          <span>{showAdvanced ? 'Hide' : 'Show'} advanced options</span>
        </button>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
            <div className="space-y-2">
              <Label htmlFor="search-mode" className="text-xs uppercase tracking-wide text-secondary">
                Search Mode
              </Label>
              <Select value={searchMode} onValueChange={onSearchModeChange}>
                <SelectTrigger 
                  id="search-mode"
                  className="bg-[var(--bg)] border-[var(--border)] h-10"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                  <SelectItem value="hybrid" className="hover:bg-[var(--bg)]">
                    Hybrid (Recommended)
                  </SelectItem>
                  <SelectItem value="semantic" className="hover:bg-[var(--bg)]">
                    Semantic
                  </SelectItem>
                  <SelectItem value="keyword" className="hover:bg-[var(--bg)]">
                    Keyword
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-secondary">
                {searchMode === 'hybrid' && 'Combines semantic and keyword search for best results'}
                {searchMode === 'semantic' && 'Uses AI embeddings to find conceptually similar results'}
                {searchMode === 'keyword' && 'Matches exact words and phrases in descriptions'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="k-value" className="text-xs uppercase tracking-wide text-secondary">
                Number of Results
              </Label>
              <Select value={String(kValue)} onValueChange={(v) => onKValueChange(Number(v))}>
                <SelectTrigger 
                  id="k-value"
                  className="bg-[var(--bg)] border-[var(--border)] h-10"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                  <SelectItem value="10" className="hover:bg-[var(--bg)]">10</SelectItem>
                  <SelectItem value="25" className="hover:bg-[var(--bg)]">25</SelectItem>
                  <SelectItem value="50" className="hover:bg-[var(--bg)]">50</SelectItem>
                  <SelectItem value="100" className="hover:bg-[var(--bg)]">100</SelectItem>
                  <SelectItem value="250" className="hover:bg-[var(--bg)]">250</SelectItem>
                  <SelectItem value="500" className="hover:bg-[var(--bg)]">500</SelectItem>
                  <SelectItem value="1000" className="hover:bg-[var(--bg)]">1000</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-secondary">
                More results take longer to load
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-secondary text-sm mt-2 ml-1">
        Search by task, environment, object, or natural language description
      </p>
    </form>
  );
}

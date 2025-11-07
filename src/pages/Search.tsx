import { useState } from 'react';
import { toast } from 'sonner';
import SearchBar from '@/components/search/SearchBar';
import ResultsGrid from '@/components/search/ResultsGrid';
import type { DataResult } from '@/components/search/mockData';

const API_BASE_URL = 'http://54.82.72.60:8000';
const DEFAULT_K = 10; // Number of results to fetch

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DataResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        k: String(DEFAULT_K),
      });

      const response = await fetch(`${API_BASE_URL}/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: DataResult[] = await response.json();
      setResults(data);
      
      if (data.length === 0) {
        toast.info('No results found for your query');
      } else {
        toast.success(`Found ${data.length} ${data.length === 1 ? 'result' : 'results'}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to fetch search results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Search Egocentric Data
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Discover high-quality demonstrations for your robotics and embodied AI projects.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-4xl mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
        </div>

        {/* Results Count */}
        {hasSearched && !loading && (
          <div className="text-[var(--text-secondary)] text-sm mb-6 text-center">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
        )}

        {/* Results Grid */}
        <div className="max-w-7xl mx-auto">
          {hasSearched ? (
            <ResultsGrid results={results} loading={loading} onReset={handleReset} />
          ) : (
            <div className="text-center py-20">
              <p className="text-[var(--text-secondary)] text-lg">
                Enter a search query to find egocentric data demonstrations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { toast } from 'sonner';
import SearchBar from '@/components/search/SearchBar';
import ResultsGrid from '@/components/search/ResultsGrid';
import type { DataResult, GroupedDataResult } from '@/components/search/mockData';
import { s3ToHttps } from '@/utils/s3';

const API_BASE_URL = 'https://apiasimov.com';

function groupResultsByDescription(results: DataResult[]): GroupedDataResult[] {
  const grouped = new Map<string, GroupedDataResult>();

  results.forEach((result) => {
    const key = result.description;

    if (grouped.has(key)) {
      const existing = grouped.get(key)!;
      existing.files.push({
        mp4: result.mp4,
        hdf5: result.hdf5,
        score: result.score,
      });
      existing.avgScore = existing.files.reduce((sum, f) => sum + f.score, 0) / existing.files.length;
    } else {
      grouped.set(key, {
        task: result.task,
        description: result.description,
        avgScore: result.score,
        files: [{
          mp4: result.mp4,
          hdf5: result.hdf5,
          score: result.score,
        }],
      });
    }
  });

  return Array.from(grouped.values()).sort((a, b) => b.avgScore - a.avgScore);
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroupedDataResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword' | 'hybrid'>('hybrid');
  const [kValue, setKValue] = useState(100);

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
        k: String(kValue),
        mode: searchMode,
      });

      const response = await fetch(`${API_BASE_URL}/search?${params}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: DataResult[] = await response.json();

      const dataWithHttpsUrls = data.map(result => ({
        ...result,
        mp4: s3ToHttps(result.mp4),
        hdf5: s3ToHttps(result.hdf5),
      }));

      const dataWithInvertedScores = dataWithHttpsUrls.map(result => ({
        ...result,
        score: 1 - result.score,
      }));

      const groupedData = groupResultsByDescription(dataWithInvertedScores);
      setResults(groupedData);

      if (groupedData.length === 0) {
        toast.info('No results found for your query');
      } else {
        const totalDemos = groupedData.reduce((sum, r) => sum + r.files.length, 0);
        toast.success(`Found ${groupedData.length} ${groupedData.length === 1 ? 'task' : 'tasks'} (${totalDemos} demos)`);
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
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Search Datasets
          </h1>
          <p className="text-xl text-secondary">
            Discover high-quality demonstrations for your robotics projects.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-3xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
            kValue={kValue}
            onKValueChange={setKValue}
          />
        </div>

        {/* Results Count */}
        {hasSearched && !loading && results.length > 0 && (
          <div className="text-secondary text-sm mb-8">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
        )}

        {/* Results Grid */}
        <div className="max-w-7xl">
          {hasSearched ? (
            <ResultsGrid results={results} loading={loading} onReset={handleReset} />
          ) : (
            <div className="py-24 text-center border border-[var(--border)]">
              <p className="text-secondary">
                Enter a search query to find egocentric data demonstrations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

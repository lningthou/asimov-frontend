import { useState, useEffect } from 'react';
import { Box, Lock, Loader2, Download, FolderDown, FileVideo, Database, Brain, Move3D, Eye, Info } from 'lucide-react';
import JSZip from 'jszip';
import RerunViewer from '@/components/rerun/RerunViewer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// API configuration
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8000' : 'https://apiasimov.com';

// S3 bucket configuration
const S3_BUCKET = 'robot-data-skild';
const S3_REGION = 'us-east-1';
const S3_BASE_URL = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

interface EpisodeFile {
  key: string;
  filename: string;
  size: number;
}

interface Episode {
  name: string;
  rrdFile: string | null;
  files: EpisodeFile[];
}

export default function Explore() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [downloadingEpisode, setDownloadingEpisode] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [showDataInfo, setShowDataInfo] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('explore_token');
      if (!token) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (!data.authenticated) {
          localStorage.removeItem('explore_token');
        }
      } catch (err) {
        console.error('Failed to check auth:', err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch episodes directly from S3
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchEpisodes() {
      try {
        const response = await fetch(`${S3_BASE_URL}?list-type=2`);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const contents = xml.getElementsByTagName('Contents');

        const episodeMap: Record<string, Episode> = {};

        for (let i = 0; i < contents.length; i++) {
          const key = contents[i].getElementsByTagName('Key')[0]?.textContent;
          const size = parseInt(contents[i].getElementsByTagName('Size')[0]?.textContent || '0', 10);

          if (key && key.includes('/')) {
            const episodeName = key.split('/')[0];
            const filename = key.split('/').pop() || '';

            if (!episodeMap[episodeName]) {
              episodeMap[episodeName] = { name: episodeName, rrdFile: null, files: [] };
            }

            if (filename) {
              episodeMap[episodeName].files.push({ key, filename, size });
              if (filename.endsWith('.rrd')) {
                episodeMap[episodeName].rrdFile = key;
              }
            }
          }
        }

        setEpisodes(Object.values(episodeMap).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Failed to fetch episodes from S3:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodes();
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('explore_token', data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Download and save a zip file
  const saveZip = async (zip: JSZip, filename: string) => {
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Download all files for an episode as a zip folder
  const handleDownloadEpisode = async (episode: Episode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadingEpisode) return;

    setDownloadingEpisode(episode.name);
    try {
      const zip = new JSZip();
      const folder = zip.folder(episode.name);

      if (!folder) throw new Error('Failed to create folder');

      // Fetch all files and add to zip
      for (const file of episode.files) {
        const response = await fetch(`${S3_BASE_URL}/${file.key}`);
        const blob = await response.blob();
        folder.file(file.filename, blob);
      }

      // Generate and download zip
      await saveZip(zip, `${episode.name}.zip`);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingEpisode(null);
    }
  };

  // Download all episodes as a single zip with subfolders
  const handleDownloadAll = async () => {
    if (downloadingAll || episodes.length === 0) return;

    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('egodex_dataset');

      if (!rootFolder) throw new Error('Failed to create root folder');

      // Fetch all episodes and their files
      for (const episode of episodes) {
        const episodeFolder = rootFolder.folder(episode.name);
        if (!episodeFolder) continue;

        for (const file of episode.files) {
          const response = await fetch(`${S3_BASE_URL}/${file.key}`);
          const blob = await response.blob();
          episodeFolder.file(file.filename, blob);
        }
      }

      // Generate and download zip
      await saveZip(zip, 'egodex_dataset.zip');
    } catch (err) {
      console.error('Download all failed:', err);
    } finally {
      setDownloadingAll(false);
    }
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Calculate total size
  const getTotalSize = () => {
    return episodes.reduce((total, ep) =>
      total + ep.files.reduce((epTotal, f) => epTotal + f.size, 0), 0
    );
  };

  if (checkingAuth) {
    return (
      <div className="h-screen pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen pt-16 flex items-center justify-center">
        <div className="w-full max-w-sm p-6 border border-[var(--border)] rounded-lg bg-[var(--card)]">
          <div className="flex flex-col items-center mb-6">
            <Lock size={32} className="mb-3 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Protected Content</h2>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Enter the password to access the dataset explorer
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
              autoFocus
              disabled={submitting}
            />
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen pt-16 flex flex-col">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Explore</h1>
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-muted-foreground">
            Browse and visualize egocentric demonstrations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadAll}
          disabled={downloadingAll || loading || episodes.length === 0}
          className="gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {downloadingAll ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FolderDown size={14} />
          )}
          <span>Download All</span>
          {!loading && episodes.length > 0 && (
            <span className="text-xs text-muted-foreground ml-1">
              ({formatSize(getTotalSize())})
            </span>
          )}
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar / File list */}
        <div className="w-72 border-r border-[var(--border)] flex flex-col">
          <div className="px-3 py-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Episodes
              </span>
              {!loading && (
                <span className="text-xs text-muted-foreground">
                  {episodes.length} total
                </span>
              )}
            </div>
            <div
              className={cn(
                'rounded-md transition-colors',
                showDataInfo
                  ? 'bg-[var(--accent)]/10'
                  : 'hover:bg-muted/50'
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEpisode(null);
                  setShowDataInfo(true);
                }}
                className={cn(
                  'w-full justify-start gap-2 px-2 font-normal cursor-pointer',
                  showDataInfo
                    ? 'text-[var(--accent)] hover:bg-transparent'
                    : 'text-muted-foreground hover:bg-transparent'
                )}
              >
                <Info size={14} className="shrink-0" />
                <span>Data Overview</span>
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : episodes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No episodes found</p>
            ) : (
              episodes.map(episode => (
                <div
                  key={episode.name}
                  className={cn(
                    'group flex items-center gap-1 rounded-md transition-colors',
                    selectedEpisode?.name === episode.name
                      ? 'bg-[var(--accent)]/10'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedEpisode(episode);
                      setShowDataInfo(false);
                    }}
                    className={cn(
                      'flex-1 justify-start gap-2 px-2 font-normal cursor-pointer',
                      selectedEpisode?.name === episode.name
                        ? 'text-[var(--accent)] hover:bg-transparent'
                        : 'text-muted-foreground hover:bg-transparent'
                    )}
                  >
                    <Box size={14} className="shrink-0" />
                    <span className="truncate text-left">{episode.name}</span>
                  </Button>
                  <button
                    onClick={(e) => handleDownloadEpisode(episode, e)}
                    disabled={downloadingEpisode === episode.name}
                    className={cn(
                      'p-1.5 rounded-md transition-all mr-1 cursor-pointer',
                      'opacity-0 group-hover:opacity-100',
                      'hover:bg-muted text-muted-foreground hover:text-foreground',
                      'disabled:opacity-50 disabled:cursor-wait',
                      downloadingEpisode === episode.name && 'opacity-100'
                    )}
                    title={`Download ${episode.name} (${formatSize(episode.files.reduce((t, f) => t + f.size, 0))})`}
                  >
                    {downloadingEpisode === episode.name ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedEpisode && selectedEpisode.rrdFile && !showDataInfo ? (
            <div className="flex-1">
              <RerunViewer rrdUrl={`${S3_BASE_URL}/${selectedEpisode.rrdFile}`} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground overflow-y-auto">
              <div className="max-w-2xl p-8">
                <div className="text-center mb-8">
                  <Box size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select an episode from the sidebar to visualize</p>
                </div>

                <Separator className="my-6" />

                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground mb-4">What's included in each episode:</h3>

                  <div className="grid gap-4">
                    <div className="flex gap-3">
                      <FileVideo size={18} className="shrink-0 mt-0.5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Stereo RGB Video</p>
                        <p className="text-xs">Left and right camera feeds (H.264 MP4) from egocentric viewpoint</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Eye size={18} className="shrink-0 mt-0.5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Depth Maps</p>
                        <p className="text-xs">Per-frame 320×320 depth maps with camera intrinsics and poses</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Move3D size={18} className="shrink-0 mt-0.5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Full Body Tracking</p>
                        <p className="text-xs">135 skeletal joints with 4×4 transformation matrices per frame, including individual finger joints for both hands</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Database size={18} className="shrink-0 mt-0.5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Object Detections & Segmentation</p>
                        <p className="text-xs">2D bounding boxes, confidence scores, RLE segmentation masks</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Brain size={18} className="shrink-0 mt-0.5 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Semantic Annotations</p>
                        <p className="text-xs">Task descriptions with atomic action labels (reach, grasp, tilt, pour, etc.), object targets, hand assignments, and temporal boundaries</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-xs space-y-2">
                    <p><span className="font-medium text-foreground">File formats:</span> HDF5 (structured data), MP4 (video), JSON (annotations), RRD (visualization)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

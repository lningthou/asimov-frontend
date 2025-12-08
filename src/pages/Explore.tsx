import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Box } from 'lucide-react';
import RerunViewer from '@/components/rerun/RerunViewer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Demo {
  id: string;
  name: string;
  rrdUrl: string;
}

interface Dataset {
  id: string;
  name: string;
  demos: Demo[];
}

// Mock data structure - replace with actual S3 data
const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'kitchen_manipulation',
    demos: [
      { id: '1-1', name: 'open_cabinet_001', rrdUrl: 'https://asimov-ego-data.s3.us-east-1.amazonaws.com/samples/test_output_single_cam.rrd' },
      { id: '1-2', name: 'open_cabinet_002', rrdUrl: 'https://asimov-ego-data.s3.us-east-1.amazonaws.com/samples/test_output_final.rrd' },
      { id: '1-3', name: 'open_drawer_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '1-4', name: 'close_fridge_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
    ],
  },
  {
    id: '2',
    name: 'object_pickup',
    demos: [
      { id: '2-1', name: 'pick_mug_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '2-2', name: 'pick_mug_002', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '2-3', name: 'pick_plate_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '2-4', name: 'pick_bottle_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '2-5', name: 'pick_bottle_002', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
    ],
  },
  {
    id: '3',
    name: 'tool_use',
    demos: [
      { id: '3-1', name: 'use_hammer_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '3-2', name: 'use_screwdriver_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
    ],
  },
  {
    id: '4',
    name: 'navigation',
    demos: [
      { id: '4-1', name: 'walk_hallway_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '4-2', name: 'walk_hallway_002', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '4-3', name: 'avoid_obstacle_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
    ],
  },
  {
    id: '5',
    name: 'folding',
    demos: [
      { id: '5-1', name: 'fold_towel_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
      { id: '5-2', name: 'fold_shirt_001', rrdUrl: 'https://app.rerun.io/version/0.20.3/examples/arkit_scenes.rrd' },
    ],
  },
];

interface FileTreeItemProps {
  dataset: Dataset;
  selectedDemo: Demo | null;
  onSelectDemo: (demo: Demo) => void;
}

function FileTreeItem({ dataset, selectedDemo, onSelectDemo }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = dataset.demos.some(d => d.id === selectedDemo?.id);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start gap-2 px-2 font-normal',
            isActive && 'text-[var(--accent)]'
          )}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {isOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
          <span className="truncate flex-1 text-left">{dataset.name}</span>
          <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
            {dataset.demos.length}
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 pl-2 border-l border-[var(--border)]">
          {dataset.demos.map(demo => (
            <Button
              key={demo.id}
              variant="ghost"
              size="sm"
              onClick={() => onSelectDemo(demo)}
              className={cn(
                'w-full justify-start gap-2 px-2 font-normal',
                selectedDemo?.id === demo.id
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-muted-foreground'
              )}
            >
              <Box size={14} />
              <span className="truncate">{demo.name}</span>
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Explore() {
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);

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
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar / File tree */}
        <div className="w-64 border-r border-[var(--border)] flex flex-col">
          <div className="px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Datasets
            </span>
          </div>
          <Separator />
          <div className="flex-1 overflow-y-auto p-2">
            {mockDatasets.map(dataset => (
              <FileTreeItem
                key={dataset.id}
                dataset={dataset}
                selectedDemo={selectedDemo}
                onSelectDemo={setSelectedDemo}
              />
            ))}
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedDemo ? (
            <div className="flex-1">
              <RerunViewer rrdUrl={selectedDemo.rrdUrl} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Box size={48} className="mx-auto mb-4 opacity-30" />
                <p>Select a demo from the sidebar to visualize</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

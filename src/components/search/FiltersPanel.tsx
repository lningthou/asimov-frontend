import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface FiltersPanelProps {
  filters: {
    taskTypes: string[];
    environments: string[];
    modalities: string[];
    durations: string[];
  };
  onFilterChange: (category: string, value: string) => void;
}

const filterOptions = {
  taskTypes: [
    { id: 'folding', label: 'Folding' },
    { id: 'lifting', label: 'Lifting' },
    { id: 'picking/placing', label: 'Picking/Placing' },
    { id: 'tool use', label: 'Tool Use' },
    { id: 'opening/closing', label: 'Opening/Closing' },
  ],
  environments: [
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'laundry', label: 'Laundry' },
    { id: 'garage', label: 'Garage' },
    { id: 'office', label: 'Office' },
    { id: 'warehouse', label: 'Warehouse' },
  ],
  modalities: [
    { id: 'RGB', label: 'RGB' },
    { id: 'IMU', label: 'IMU' },
    { id: 'Force/Tactile', label: 'Force/Tactile' },
    { id: 'Audio', label: 'Audio' },
    { id: 'Depth', label: 'Depth' },
  ],
  durations: [
    { id: '<10s', label: '< 10s' },
    { id: '10-60s', label: '10–60s' },
    { id: '1-5m', label: '1–5m' },
    { id: '>5m', label: '> 5m' },
  ],
};

export default function FiltersPanel({ filters, onFilterChange }: FiltersPanelProps) {
  const isChecked = (category: string, value: string) => {
    return filters[category as keyof typeof filters].includes(value);
  };

  return (
    <div className="hairline bg-[var(--surface)] rounded-none p-6 space-y-6">
      <h3 className="text-lg font-semibold text-primary">Filters</h3>

      {/* Task Type */}
      <div className="space-y-3">
        <span className="tag">TASK TYPE</span>
        <div className="space-y-2">
          {filterOptions.taskTypes.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`task-${option.id}`}
                checked={isChecked('taskTypes', option.id)}
                onCheckedChange={() => onFilterChange('taskTypes', option.id)}
                className="border-[var(--border)]"
              />
              <label
                htmlFor={`task-${option.id}`}
                className="text-secondary text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[var(--border)]" />

      {/* Environment */}
      <div className="space-y-3">
        <span className="tag">ENVIRONMENT</span>
        <div className="space-y-2">
          {filterOptions.environments.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`env-${option.id}`}
                checked={isChecked('environments', option.id)}
                onCheckedChange={() => onFilterChange('environments', option.id)}
                className="border-[var(--border)]"
              />
              <label
                htmlFor={`env-${option.id}`}
                className="text-secondary text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[var(--border)]" />

      {/* Modalities */}
      <div className="space-y-3">
        <span className="tag">MODALITIES</span>
        <div className="space-y-2">
          {filterOptions.modalities.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`mod-${option.id}`}
                checked={isChecked('modalities', option.id)}
                onCheckedChange={() => onFilterChange('modalities', option.id)}
                className="border-[var(--border)]"
              />
              <label
                htmlFor={`mod-${option.id}`}
                className="text-secondary text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[var(--border)]" />

      {/* Duration */}
      <div className="space-y-3">
        <span className="tag">DURATION</span>
        <div className="space-y-2">
          {filterOptions.durations.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`dur-${option.id}`}
                checked={isChecked('durations', option.id)}
                onCheckedChange={() => onFilterChange('durations', option.id)}
                className="border-[var(--border)]"
              />
              <label
                htmlFor={`dur-${option.id}`}
                className="text-secondary text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

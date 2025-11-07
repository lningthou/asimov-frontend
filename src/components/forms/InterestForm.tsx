import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
  tasks: string;
  modalities: string[];
  timeframe: string;
  budget: string;
  extraContext: string;
}

const modalities = [
  { id: 'rgb', label: 'RGB video' },
  { id: 'imu', label: 'IMU' },
  { id: 'force', label: 'Force/Tactile' },
  { id: 'audio', label: 'Audio' },
  { id: 'depth', label: 'Depth' },
];

export default function InterestForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    role: '',
    tasks: '',
    modalities: [],
    timeframe: '',
    budget: '',
    extraContext: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.company || !formData.role || !formData.tasks) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.modalities.length === 0) {
      toast.error('Please select at least one modality');
      return;
    }

    if (!formData.timeframe || !formData.budget) {
      toast.error('Please select timeframe and budget');
      return;
    }

    // Log payload to console
    console.log('Interest Form Submission:', formData);

    // Show success toast
    toast.success("Thanks — we'll be in touch!");

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      company: '',
      role: '',
      tasks: '',
      modalities: [],
      timeframe: '',
      budget: '',
      extraContext: '',
    });
  };

  const handleModalityToggle = (modalityId: string) => {
    setFormData((prev) => ({
      ...prev,
      modalities: prev.modalities.includes(modalityId)
        ? prev.modalities.filter((m) => m !== modalityId)
        : [...prev.modalities, modalityId],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto hairline bg-[var(--surface)] rounded-none p-8">
      <h2 className="text-3xl font-bold text-primary mb-2">Express Your Interest</h2>
      <p className="text-secondary mb-8">
        Let us know what you're building and we'll help you find the right data.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-primary">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-[var(--bg)] border-[var(--border)] text-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary">
              Email <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[var(--bg)] border-[var(--border)] text-primary"
              required
            />
          </div>
        </div>

        {/* Company and Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-primary">
              Company <span className="text-red-400">*</span>
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-[var(--bg)] border-[var(--border)] text-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-primary">
              Role <span className="text-red-400">*</span>
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="bg-[var(--bg)] border-[var(--border)] text-primary"
              placeholder="e.g. ML Engineer, Researcher"
              required
            />
          </div>
        </div>

        {/* Tasks/Domains */}
        <div className="space-y-2">
          <Label htmlFor="tasks" className="text-primary">
            What tasks or domains are you interested in? <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="tasks"
            value={formData.tasks}
            onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
            className="bg-[var(--bg)] border-[var(--border)] text-primary min-h-[100px]"
            placeholder="e.g. Folding laundry, table setting, tool manipulation..."
            required
          />
        </div>

        {/* Modalities */}
        <div className="space-y-3">
          <Label className="text-primary">
            Modalities <span className="text-red-400">*</span>
          </Label>
          <div className="space-y-2">
            {modalities.map((modality) => (
              <div key={modality.id} className="flex items-center space-x-2">
                <Checkbox
                  id={modality.id}
                  checked={formData.modalities.includes(modality.id)}
                  onCheckedChange={() => handleModalityToggle(modality.id)}
                  className="border-[var(--border)]"
                />
                <label
                  htmlFor={modality.id}
                  className="text-secondary text-sm cursor-pointer"
                >
                  {modality.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Timeframe and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeframe" className="text-primary">
              Timeframe <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.timeframe} onValueChange={(value) => setFormData({ ...formData, timeframe: value })}>
              <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] text-primary">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="asap">ASAP</SelectItem>
                <SelectItem value="1-2months">1–2 months</SelectItem>
                <SelectItem value="3-6months">3–6 months</SelectItem>
                <SelectItem value="6plus">&gt;6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-primary">
              Budget <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
              <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] text-primary">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="under5k">&lt; $5k</SelectItem>
                <SelectItem value="5-25k">$5–25k</SelectItem>
                <SelectItem value="25-100k">$25–100k</SelectItem>
                <SelectItem value="over100k">&gt; $100k</SelectItem>
                <SelectItem value="unsure">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Extra Context */}
        <div className="space-y-2">
          <Label htmlFor="extraContext" className="text-secondary">
            Additional context (optional)
          </Label>
          <Textarea
            id="extraContext"
            value={formData.extraContext}
            onChange={(e) => setFormData({ ...formData, extraContext: e.target.value })}
            className="bg-[var(--bg)] border-[var(--border)] text-primary min-h-[80px]"
            placeholder="Anything else we should know..."
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent)]/90 h-12 text-lg font-semibold rounded-none"
        >
          Submit Interest
        </Button>
      </form>
    </div>
  );
}

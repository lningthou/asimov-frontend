import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface RequestDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestDataModal({ open, onOpenChange }: RequestDataModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    dataNeeds: '',
  });
  
  const scrollPositionRef = useRef(0);

  // Preserve scroll position when modal opens/closes
  useEffect(() => {
    if (open) {
      // Store current scroll position in ref
      scrollPositionRef.current = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      // Prevent layout shift from scrollbar disappearing
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Restore scroll position from ref
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success message
    toast.success("Thanks, we'll reach out to you as soon as we can.");
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      dataNeeds: '',
    });
    
    // Close modal
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--bg)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Request Data</DialogTitle>
          <DialogDescription className="text-secondary">
            Fill out the form below and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          {/* Personal Info Section */}
          <div className="space-y-5">
            <div>
              <span className="tag mb-3 inline-block">PERSONAL INFO</span>
              <p className="text-sm text-secondary">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wide text-secondary">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="hairline bg-[var(--surface)] h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide text-secondary">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="hairline bg-[var(--surface)] h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs uppercase tracking-wide text-secondary">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="hairline bg-[var(--surface)] h-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Data Needs Section */}
          <div className="space-y-5 pt-2">
            <div>
              <span className="tag mb-3 inline-block">DATA NEEDS</span>
              <p className="text-sm text-secondary">Tell us about the data you're looking for</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNeeds" className="text-xs uppercase tracking-wide text-secondary">Description *</Label>
              <Textarea
                id="dataNeeds"
                value={formData.dataNeeds}
                onChange={(e) => setFormData({ ...formData, dataNeeds: e.target.value })}
                placeholder="Describe the type of data you need..."
                className="hairline bg-[var(--surface)] min-h-[120px]"
                rows={5}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[var(--border)]">
            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-[var(--bg)] font-semibold py-3.5 hover:opacity-90 transition-opacity uppercase tracking-wide text-sm"
            >
              Submit Request
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


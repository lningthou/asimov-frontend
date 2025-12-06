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

  useEffect(() => {
    if (open) {
      scrollPositionRef.current = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkgkdpzr';

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          dataNeeds: formData.dataNeeds,
          _replyto: formData.email,
          _subject: `Data Request from ${formData.name} (${formData.company})`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }

      toast.success("Thanks, we'll be in touch soon.");

      setFormData({
        name: '',
        email: '',
        company: '',
        dataNeeds: '',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send request. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Request Data</DialogTitle>
          <DialogDescription className="text-secondary">
            Tell us about your project and we'll get back to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-secondary">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[var(--surface)] border-[var(--border)] h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-secondary">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[var(--surface)] border-[var(--border)] h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm text-secondary">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-[var(--surface)] border-[var(--border)] h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNeeds" className="text-sm text-secondary">What data do you need?</Label>
              <Textarea
                id="dataNeeds"
                value={formData.dataNeeds}
                onChange={(e) => setFormData({ ...formData, dataNeeds: e.target.value })}
                placeholder="Describe the type of demonstrations you're looking for..."
                className="bg-[var(--surface)] border-[var(--border)] min-h-[100px]"
                rows={4}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Submit Request
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  navItems: Array<{ label: string; href: string }>;
}

export default function MobileNav({ open, onClose, navItems }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] bg-[var(--bg)] border-[var(--border)]">
        <SheetHeader>
          <SheetTitle className="text-primary flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              Asimov
            </span>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors duration-200 text-lg font-medium py-2"
            >
              {item.label}
            </Link>
          ))}

          <Separator className="bg-[var(--border)]" />

          <Button
            className="w-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent)]/90 rounded-none"
            onClick={onClose}
          >
            Request Data
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

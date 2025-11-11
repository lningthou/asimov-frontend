import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check actual scroll position or body top offset (when modal is open)
      const scrollY = window.scrollY;
      const bodyTop = parseInt(document.body.style.top || '0');
      const effectiveScroll = scrollY || Math.abs(bodyTop);
      
      setScrolled(effectiveScroll > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Also check on interval when body is fixed (for modal open state)
    const intervalId = setInterval(() => {
      if (document.body.style.position === 'fixed') {
        handleScroll();
      }
    }, 100);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-sm bg-[var(--bg)]/80 border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo - lowercase wordmark */}
          <Link to="/" className="flex items-center group">
            <div className="text-2xl font-bold text-primary">
              asimov
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

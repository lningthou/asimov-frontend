import { useState, useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: 'Docs', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-sm bg-[var(--bg)]/80 border-b border-[var(--border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - lowercase wordmark */}
            <Link to="/" className="flex items-center group">
              <div className="text-2xl font-bold text-primary">
                asimov
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium group"
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[var(--accent)] transition-transform duration-200 ${
                      currentPath === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* CTA and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:inline-flex btn-primary text-sm px-6 h-10">
                Request Data
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-primary hover:text-[var(--accent)] transition-colors"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} navItems={navItems} />
    </>
  );
}

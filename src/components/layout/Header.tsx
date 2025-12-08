import { Link, useRouterState } from '@tanstack/react-router';
import { LogoNodes } from '@/components/icons/AsimovLogo';

export default function Header() {
  const routerState = useRouterState();
  const isSearchPage = routerState.location.pathname === '/search';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-base font-semibold tracking-tight hover:text-[var(--accent)] transition-colors">
        <LogoNodes size={20} />
        asimov
      </Link>

      {!isSearchPage && (
        <Link
          to="/search"
          className="text-secondary hover:text-primary transition-colors text-sm font-medium"
        >
          Search
        </Link>
      )}
    </header>
  );
}

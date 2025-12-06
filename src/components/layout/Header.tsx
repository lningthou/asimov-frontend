import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-base font-semibold tracking-tight hover:text-[var(--accent)] transition-colors">
          asimov
        </Link>

        <Link
          to="/search"
          className="text-secondary hover:text-primary transition-colors text-sm font-medium"
        >
          Search
        </Link>
      </div>
    </header>
  );
}

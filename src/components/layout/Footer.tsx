import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent mb-4">
              Asimov
            </div>
            <p className="text-secondary text-sm">
              Egocentric data for foundational robot models.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Search
                </Link>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Capture Stack
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Research
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-[var(--accent)] transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary text-sm">
            © {currentYear} Asimov. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-secondary hover:text-[var(--accent)] transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-secondary hover:text-[var(--accent)] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-secondary hover:text-[var(--accent)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

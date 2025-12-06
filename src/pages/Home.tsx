import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import RequestDataModal from '@/components/forms/RequestDataModal';
import ycLogo from '@/assets/yc-logo.png';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="gradient-mesh" />
        <div className="grid-pattern" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            {/* YC Badge */}
            <div className="flex items-center gap-2.5 mb-8">
              <span className="text-sm text-secondary">Backed by</span>
              <img src={ycLogo} alt="Y Combinator" className="h-6" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] mb-8">
              Egocentric data for{' '}
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                foundational robot models
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-secondary max-w-2xl mb-12 leading-relaxed">
              A curated marketplace of high-quality egocentric demonstrations, plus an ergonomic capture stack.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary inline-flex items-center justify-center"
              >
                Request Data
                <ArrowRight className="ml-2" size={18} />
              </button>
              <Link
                to="/search"
                className="btn-ghost inline-flex items-center justify-center"
              >
                Explore Datasets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Request Data Modal */}
      <RequestDataModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import HeroViz from '@/components/hero/HeroViz';
import RequestDataModal from '@/components/forms/RequestDataModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 hero-gradient" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Egocentric data for{' '}
                <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                  foundational robot models
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-secondary max-w-2xl">
                A curated marketplace of high-quality egocentric demonstrations, plus an ergonomic capture stack. RGB, motion, force—unified for training.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[var(--accent)] text-[var(--bg)] font-medium text-lg px-8 h-14 inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  Request Data
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </div>

            {/* Right: Animated Canvas */}
            <div className="hidden lg:block">
              <div className="w-full h-[600px]">
                <HeroViz />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backed By Row */}
      {/* <section className="py-16 border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="tag">BACKED BY</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className="px-6 py-3 text-secondary border border-[var(--border)] rounded-none bg-transparent hover:brightness-125 transition-all text-base font-medium"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Problem Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <span className="tag">PROBLEM</span>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Collecting robot training data is slow, fragmented, and bulky.
            </h2>
            <p className="text-xl text-secondary">
              Teams waste months stitching together datasets from different sources, with inconsistent formats and missing modalities.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 container mx-auto px-4 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <span className="tag">SOLUTION</span>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Asimov unifies capture and discovery into a single pipeline.
            </h2>
            <p className="text-xl text-secondary">
              Search existing datasets or capture new data with our hardware kits—all delivered in robot-agnostic formats aligned to Open X-Embodiment.
            </p>
          </div>
        </div>
      </section>

      {/* Three-Step Cards */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[var(--surface)] hairline p-6 md:p-8 rounded-none hover:-translate-y-0.5 hover:border-[var(--border-strong)] transition-all">
            <div className="w-12 h-12 bg-[var(--bg)] hairline-strong flex items-center justify-center font-bold text-xl mb-4">
              1
            </div>
            <h3 className="text-2xl font-bold mb-3">SEARCH</h3>
            <p className="text-secondary">
              Find exactly the task you need across open datasets and Asimov captures.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[var(--surface)] hairline p-6 md:p-8 rounded-none hover:-translate-y-0.5 hover:border-[var(--border-strong)] transition-all">
            <div className="w-12 h-12 bg-[var(--bg)] hairline-strong flex items-center justify-center font-bold text-xl mb-4">
              2
            </div>
            <h3 className="text-2xl font-bold mb-3">CAPTURE</h3>
            <p className="text-secondary">
              Low-profile kits record RGB, motion, and force in sync.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[var(--surface)] hairline p-6 md:p-8 rounded-none hover:-translate-y-0.5 hover:border-[var(--border-strong)] transition-all">
            <div className="w-12 h-12 bg-[var(--bg)] hairline-strong flex items-center justify-center font-bold text-xl mb-4">
              3
            </div>
            <h3 className="text-2xl font-bold mb-3">DELIVER</h3>
            <p className="text-secondary">
              Robot-agnostic data packs aligned to Open X-Embodiment.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to start your pilot?
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Join our early access program and get custom data for your robotics project.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--accent)] text-[var(--bg)] font-medium text-lg px-10 h-14 inline-flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            Request Data
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* Request Data Modal */}
      <RequestDataModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

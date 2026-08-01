import React from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { Reveal, RevealWords } from './Reveal';

export function Footer() {
  return (
    <footer className="bg-ink px-6 pb-12 pt-28 text-sand-50 sm:px-10 lg:px-16 lg:pt-40">
      <h2 className="font-serif text-[13vw] leading-[0.9] sm:text-[10vw]">
        <RevealWords text="Scroll gently." />
      </h2>

      <Reveal
        delay={0.15}
        className="mt-16 flex flex-col gap-8 border-t border-sand-50/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
        
        <p className="max-w-sm text-sm font-light leading-relaxed text-sand-100/80">
          Built with a spring-eased scroll layer, scroll-linked parallax, and
          reveal choreography. Reduced-motion preferences are respected.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group inline-flex items-center gap-3 self-start rounded-full border border-sand-50/40 px-5 py-3 text-xs uppercase tracking-[0.22em] transition-colors duration-500 hover:bg-sand-50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
          
          Back to top
          <ArrowUpIcon
            className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1"
            aria-hidden="true" />
          
        </button>
      </Reveal>

      <p className="mt-16 text-[0.68rem] uppercase tracking-[0.22em] text-sand-50/40">
        © {new Date().getFullYear()} Dune Studio — Motion study
      </p>
    </footer>);

}
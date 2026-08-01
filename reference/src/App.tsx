import React from 'react';
import { ScrollProgress, SmoothScroll } from './components/SmoothScroll';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { HorizontalGallery } from './components/HorizontalGallery';
import { WideBanner } from './components/WideBanner';
import { Footer } from './components/Footer';

export function App() {
  const handleScrollCue = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-sand-50">
      <ScrollProgress />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 mix-blend-difference sm:px-10 lg:px-16">
        <span className="font-serif text-lg text-white">Dune Studio</span>
        <span className="text-[0.68rem] uppercase tracking-[0.25em] text-white/80">
          Motion study — 001
        </span>
      </header>

      <SmoothScroll>
        <main>
          <Hero onScrollCue={handleScrollCue} />
          <Manifesto />
          <HorizontalGallery />
          <WideBanner />
        </main>
        <Footer />
      </SmoothScroll>
    </div>);

}
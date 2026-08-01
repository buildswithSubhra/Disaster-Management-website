import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';
import { RevealWords } from './Reveal';

type HeroProps = {
  onScrollCue: () => void;
};

export function Hero({ onScrollCue }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.18, 0.5]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.img
        src="/7a4a1f57-48af-4fef-ac4e-341cdea2c5b9.jpg"
        alt="Wind-carved sand dunes stretching to the horizon at golden hour"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform" />
      
      <motion.div
        aria-hidden="true"
        style={{ opacity: overlay }}
        className="absolute inset-0 bg-ink" />
      

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative flex h-full flex-col justify-end px-6 pb-16 sm:px-10 lg:px-16 lg:pb-20">
        
        <h1 className="max-w-5xl font-serif text-[13vw] leading-[0.88] text-sand-50 sm:text-[11vw] lg:text-[8.5vw]">
          <RevealWords text="A slower way" />
          <br />
          <RevealWords text="to move" />{' '}
          <RevealWords
            text="through"
            wordClassName="italic text-sand-300" />
          
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-sand-50/25 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-sm font-light leading-relaxed text-sand-100/90">
            Every section eases into place on a spring. Scroll at your own pace —
            the page catches up, settles, and never snaps.
          </p>
          <button
            type="button"
            onClick={onScrollCue}
            className="group inline-flex items-center gap-3 self-start rounded-full border border-sand-50/40 px-5 py-3 text-xs uppercase tracking-[0.22em] text-sand-50 transition-colors duration-500 hover:bg-sand-50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
            
            Begin scrolling
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex">
              
              <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </button>
        </div>
      </motion.div>
    </section>);

}
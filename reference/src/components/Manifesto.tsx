import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from './Reveal';

const LINE =
'Motion is a material. Used well it gives weight to a page, tells you where you are, and makes distance feel deliberate rather than long.';

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35']
  });

  const words = LINE.split(' ');

  return (
    <section className="bg-sand-50 px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <Reveal className="mb-14 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-ink/50">
        <span className="h-px w-10 bg-ink/30" aria-hidden="true" />
        01 — Principle
      </Reveal>

      <div ref={ref}>
        <p className="max-w-5xl font-serif text-3xl leading-[1.25] text-ink sm:text-4xl lg:text-[3.4rem] lg:leading-[1.18]">
          {words.map((word, index) =>
          <Word
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1.6) / words.length]}>
            
              {word}
            </Word>
          )}
        </p>
      </div>
    </section>);

}

type WordProps = {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
};

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.14, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      {'\u00A0'}
    </motion.span>);

}
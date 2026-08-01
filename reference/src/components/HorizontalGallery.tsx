import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Reveal } from './Reveal';

const PLATES = [
{
  src: "/08962c3f-e851-4bff-a55f-7d0579045fde.jpg",
  alt: 'Curved concrete wall washed in warm afternoon light',
  title: 'Weight',
  caption: 'Damping 26 · Mass 0.45'
},
{
  src: "/9dd50da5-8706-448c-af79-b1b0900ee325.jpg",
  alt: 'Folds of draped raw linen in soft directional light',
  title: 'Drift',
  caption: 'Parallax offset 90px'
},
{
  src: "/df6ca8ab-d363-47c6-bd30-41d321b3534a.jpg",
  alt: 'Aerial view of a lone road winding through amber plains',
  title: 'Distance',
  caption: 'Eased, never snapped'
}];


export function HorizontalGallery() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4
  });
  const x = useTransform(smooth, [0, 1], ['8%', '-32%']);

  return (
    <section
      ref={ref}
      className="overflow-hidden bg-ink py-28 text-sand-50 lg:py-36">
      
      <div className="px-6 sm:px-10 lg:px-16">
        <Reveal className="mb-4 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-sand-50/50">
          <span className="h-px w-10 bg-sand-50/30" aria-hidden="true" />
          02 — Drift
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Layers move at different speeds
          </h2>
        </Reveal>
      </div>

      <motion.ul
        style={{ x }}
        className="mt-16 flex list-none gap-6 will-change-transform sm:gap-10 lg:mt-24">
        
        {PLATES.map((plate, index) =>
        <li
          key={plate.title}
          className={`w-[70vw] shrink-0 sm:w-[46vw] lg:w-[34vw] ${
          index % 2 === 1 ? 'lg:mt-24' : ''}`
          }>
          
            <div className="relative aspect-[3/4] overflow-hidden bg-sand-50/10">
              <img
              src={plate.src}
              alt={plate.alt}
              loading="lazy"
              className="h-full w-full object-cover" />
            
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-2xl">{plate.title}</h3>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-sand-50/55">
                {plate.caption}
              </p>
            </div>
          </li>
        )}
      </motion.ul>
    </section>);

}
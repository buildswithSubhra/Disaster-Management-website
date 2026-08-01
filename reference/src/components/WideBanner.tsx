import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from './Reveal';
import { ParallaxImage } from './ParallaxImage';

const METRICS = [
{ value: '140', label: 'Spring stiffness' },
{ value: '26', label: 'Damping' },
{ value: '0.45', label: 'Mass' }];


export function WideBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  });
  const width = useTransform(scrollYProgress, [0, 1], ['72%', '100%']);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section className="bg-sand-50 py-28 lg:py-36">
      <div className="px-6 sm:px-10 lg:px-16">
        <Reveal className="mb-4 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-ink/50">
          <span className="h-px w-10 bg-ink/30" aria-hidden="true" />
          03 — Settle
        </Reveal>
      </div>

      <div ref={ref} className="flex justify-center">
        <motion.div
          style={{ width, borderRadius: radius }}
          className="overflow-hidden">
          
          <ParallaxImage
            src="/65866352-c73e-46c7-bf7a-cf6d693f28fb.jpg"
            alt="Calm ocean horizon dissolving into hazy dusk light"
            distance={70}
            className="h-[46vh] w-full lg:h-[72vh]" />
          
        </motion.div>
      </div>

      <dl className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-10 px-6 sm:grid-cols-3 sm:px-10 lg:px-16">
        {METRICS.map((metric, index) =>
        <Reveal key={metric.label} delay={index * 0.1}>
            <div className="border-t border-ink/15 pt-5">
              <dt className="font-serif text-5xl leading-none text-ink">
                {metric.value}
              </dt>
              <dd className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/55">
                {metric.label}
              </dd>
            </div>
          </Reveal>
        )}
      </dl>
    </section>);

}
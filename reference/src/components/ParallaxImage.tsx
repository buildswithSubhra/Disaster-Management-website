import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type ParallaxImageProps = {
  src: string;
  alt: string;
  /** How far the image drifts against the scroll, in pixels. */
  distance?: number;
  className?: string;
  priority?: boolean;
};

export function ParallaxImage({
  src,
  alt,
  distance = 90,
  className,
  priority = false
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.02, 1.12]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-sand-100 ${className ?? ''}`}>
      
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform" />
      
    </div>);

}
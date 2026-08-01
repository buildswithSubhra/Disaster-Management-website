import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform } from
'framer-motion';

type SmoothScrollProps = {
  children: React.ReactNode;
};

/**
 * Keeps the document scrolling natively (so keyboard, trackpad, anchors and
 * scrollbars all behave) but renders the page in a fixed layer that eases
 * toward the real scroll position with a spring. The result is the weighted,
 * gliding feel of a "smooth scroll" site without hijacking input.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 140,
    damping: 26,
    mass: 0.45,
    restDelta: 0.001
  });
  const y = useTransform(smoothY, (value) => -value);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => setPageHeight(el.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  if (prefersReducedMotion) {
    return <div ref={contentRef}>{children}</div>;
  }

  return (
    <>
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="fixed inset-x-0 top-0 will-change-transform">
        
        {children}
      </motion.div>
      {/* Spacer that gives the document its real scrollable height */}
      <div style={{ height: pageHeight }} aria-hidden="true" />
    </>);

}

/** Thin reading-progress rule pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.3
  });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-ink" />);


}
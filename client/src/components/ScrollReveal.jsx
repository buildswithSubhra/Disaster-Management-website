import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const DECELERATE = [0.16, 1, 0.3, 1];

const ScrollReveal = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.9,
  distance = 28,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-12% 0px -12% 0px' });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const { x, y } = directions[direction] || directions.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{
        duration,
        delay,
        ease: DECELERATE,
      }}
    >
      {children}
    </motion.div>
  );
};

export const RevealWords = ({ text, className = '', wordClassName = '' }) => {
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      transition={{ staggerChildren: 0.055 }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: '105%', opacity: 0 },
              visible: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.85, ease: DECELERATE }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default ScrollReveal;

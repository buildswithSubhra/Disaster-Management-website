import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const ParallaxSection = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const directions = {
    up: [100 * speed, -100 * speed],
    down: [-100 * speed, 100 * speed],
    left: [100 * speed, -100 * speed],
    right: [-100 * speed, 100 * speed],
  };

  const [start, end] = directions[direction] || directions.up;

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;

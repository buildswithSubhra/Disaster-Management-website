import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const StaggerReveal = ({
  children,
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  distance = 30,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const { x, y } = directions[direction] || directions.up;

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, x, y }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default StaggerReveal;

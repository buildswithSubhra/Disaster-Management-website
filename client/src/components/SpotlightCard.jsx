import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

const SpotlightCard = ({ children, className = '', glowColor = '59, 130, 246', size = 'md' }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 ${sizeClasses[size]} overflow-hidden ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(${glowColor}, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(${glowColor}, 0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default SpotlightCard;

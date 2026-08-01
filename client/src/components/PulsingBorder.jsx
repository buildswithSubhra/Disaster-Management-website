import React from 'react';
import { motion } from 'motion/react';

const PulsingBorder = ({ children, className = '', color = 'danger', active = true }) => {
  const colorMap = {
    danger: 'border-danger-500 shadow-danger-500/20',
    warning: 'border-warning-500 shadow-warning-500/20',
    success: 'border-success-500 shadow-success-500/20',
    info: 'border-info-500 shadow-info-500/20',
  };

  return (
    <div className={`relative ${className}`}>
      {active && (
        <motion.div
          className={`absolute inset-0 rounded-2xl border-2 ${colorMap[color]}`}
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(239, 68, 68, 0.2)',
              '0 0 0 4px rgba(239, 68, 68, 0.1)',
              '0 0 0 0px rgba(239, 68, 68, 0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PulsingBorder;

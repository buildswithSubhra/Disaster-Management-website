import React from 'react';
import { motion } from 'motion/react';

const SeverityBadge = ({ severity }) => {
  const config = {
    low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', dot: 'bg-green-500' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', dot: 'bg-yellow-500' },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', dot: 'bg-orange-500' },
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', dot: 'bg-red-500', animate: true },
  };
  const c = config[severity?.toLowerCase()] || config.medium;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot} ${c.animate ? 'animate-pulse' : ''} mr-1.5`}></span>
      {severity}
    </motion.span>
  );
};

export default SeverityBadge;

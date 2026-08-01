import React from 'react';
import { motion } from 'motion/react';

const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', dot: 'bg-yellow-500' },
    assigned: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', dot: 'bg-blue-500' },
    'in progress': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', dot: 'bg-orange-500', animate: true },
    rescued: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', dot: 'bg-green-500' },
    completed: { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300', dot: 'bg-gray-500' },
    available: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', dot: 'bg-green-500' },
    busy: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', dot: 'bg-orange-500' },
    offline: { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300', dot: 'bg-gray-500' },
    active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', dot: 'bg-green-500', animate: true },
  };
  const c = config[status?.toLowerCase()] || config.pending;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${c.dot} ${c.animate ? 'animate-pulse' : ''} mr-1 sm:mr-1.5`}></span>
      <span className="hidden sm:inline">{status}</span>
      <span className="sm:hidden">{status?.substring(0, 4)}</span>
    </motion.span>
  );
};

export default StatusBadge;

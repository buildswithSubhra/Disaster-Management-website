import React from 'react';
import { motion } from 'motion/react';

const LoadingSpinner = ({ size = 'md', message = '', fullScreen = false }) => {
  const sizeClasses = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };

  const spinner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-navy-100 dark:border-navy-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-navy-800 dark:border-navy-300 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-1 border-4 border-navy-200 dark:border-navy-600 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-500 dark:text-gray-400 font-medium"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center py-16">{spinner}</div>;
};

export default LoadingSpinner;

import React from 'react';
import { motion } from 'motion/react';

const GlowButton = ({ children, onClick, className = '', variant = 'primary', disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'bg-navy-800 text-white hover:bg-navy-700 shadow-lg shadow-navy-500/25',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-lg shadow-danger-500/25',
    success: 'bg-success-500 text-white hover:bg-success-600 shadow-lg shadow-success-500/25',
    outline: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative inline-flex items-center justify-center gap-2
        px-5 py-2.5 rounded-xl font-semibold text-sm
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer overflow-hidden
        ${variants[variant]}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      </div>
    </motion.button>
  );
};

export default GlowButton;

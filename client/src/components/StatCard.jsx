import React from 'react';
import { motion } from 'motion/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ icon: Icon, title, value, trend, trendValue, color = 'primary', index = 0 }) => {
  const colorClasses = {
    primary: 'from-primary-600 to-primary-800',
    danger: 'from-danger-500 to-danger-700',
    warning: 'from-warning-500 to-warning-700',
    success: 'from-success-500 to-success-700',
  };
  const iconBg = {
    primary: 'bg-primary-500',
    danger: 'bg-danger-500',
    warning: 'bg-warning-500',
    success: 'bg-success-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-br ${colorClasses[color]} dark:brightness-110 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <motion.p
            className="text-3xl font-bold mt-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          >
            {value}
          </motion.p>
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
              className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-300' : 'text-red-300'}`}
            >
              {trend === 'up' ? <FaArrowUp className="h-4 w-4 mr-1" /> : <FaArrowDown className="h-4 w-4 mr-1" />}
              <span>{trendValue}</span>
            </motion.div>
          )}
        </div>
        <motion.div
          className={`${iconBg[color]} p-3 rounded-lg bg-white/20`}
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatCard;

import React from 'react';
import { motion } from 'motion/react';
import { FaExclamationTriangle, FaSun, FaMoon } from 'react-icons/fa';
import WeatherBackground from '../components/WeatherBackground';
import { useTheme } from '../context/ThemeContext';

const AuthLayout = ({ children }) => {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
        <WeatherBackground />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-elevated">
              <FaExclamationTriangle className="h-6 w-6 text-navy-800" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ReliefOps</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs font-bold">01</span>
              </div>
              <p className="text-sm text-navy-300">Real-time disaster monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs font-bold">02</span>
              </div>
              <p className="text-sm text-navy-300">Instant rescue coordination</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs font-bold">03</span>
              </div>
              <p className="text-sm text-navy-300">Shelter & resource management</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-navy-400 font-semibold mb-3">Operator Brief — SOP-04</p>
          <p className="text-xl font-medium text-white leading-relaxed max-w-md" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
            "In an incident, the interface must recede. Clarity is response."
          </p>
          <p className="text-sm text-navy-400 mt-4 font-medium">Dispatch protocol, ReliefOps HQ</p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative">
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
        >
          {dark ? <FaSun className="h-4 w-4 text-yellow-400" /> : <FaMoon className="h-4 w-4" />}
        </motion.button>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;

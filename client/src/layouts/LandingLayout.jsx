import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaExclamationTriangle, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LandingLayout = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'rescuer') return '/rescuer/dashboard';
    return '/user/dashboard';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 flex flex-col overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-navy-800 dark:bg-white rounded-xl flex items-center justify-center shadow-glow">
              <FaExclamationTriangle className="h-4 w-4 text-white dark:text-navy-900" />
            </div>
            <span className="text-base sm:text-lg font-bold text-navy-900 dark:text-white tracking-tight">ReliefOps</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-navy-600 dark:text-white/60 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              {dark ? <FaSun className="h-4 w-4 text-yellow-400" /> : <FaMoon className="h-4 w-4" />}
            </motion.button>
            {isAuthenticated ? (
              <>
                <span className="text-xs sm:text-sm text-navy-600 dark:text-white/60 hidden md:block">{user?.name}</span>
                <Link to={getDashboardPath()}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-navy-800 dark:bg-white text-white dark:text-navy-900 rounded-xl hover:bg-navy-700 dark:hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Dashboard
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-navy-600 dark:text-white/70 hover:text-navy-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Sign in
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-navy-800 dark:bg-white text-white dark:text-navy-900 rounded-xl hover:bg-navy-700 dark:hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 pt-14 sm:pt-16">
        {children}
      </main>
    </div>
  );
};

export default LandingLayout;

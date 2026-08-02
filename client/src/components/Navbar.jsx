import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaExclamationTriangle, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from './ui/sidebar';
import NotificationPanel from './NotificationPanel';
import notificationService from '../services/notificationService';
import { getCloudinaryUrl } from '../config';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, isAdmin, isRescuer } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        setUnreadCount(res.data?.count || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const dashPath = isAdmin ? '/admin/dashboard' : isRescuer ? '/rescuer/dashboard' : '/user/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to={dashPath} className="flex items-center gap-2.5">
              <motion.div
                className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <FaExclamationTriangle className="h-4 w-4 text-white" />
              </motion.div>
              <span className="text-base font-bold text-navy-900 dark:text-white hidden sm:block">ReliefOps</span>
            </Link>
            <span className="ml-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 bg-navy-50 dark:bg-navy-900/50 rounded">
              {user?.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {dark ? <FaSun className="h-4 w-4 text-yellow-400" /> : <FaMoon className="h-4 w-4" />}
            </motion.button>

            <div ref={notifRef} className="relative">
              <motion.button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaBell className="h-4 w-4" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              {isNotifOpen && <NotificationPanel onClose={() => setIsNotifOpen(false)} />}
            </div>

            <div ref={profileRef} className="relative">
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img src={getCloudinaryUrl(user.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{user?.email}</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-soft py-1.5"
                  >
                    <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email}</p>
                    </div>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center w-full px-3.5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2.5"
                    >
                      <FaSignOutAlt className="h-4 w-4" />Sign out
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              {open ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

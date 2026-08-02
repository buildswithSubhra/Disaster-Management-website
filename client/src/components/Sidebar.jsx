import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FaThLarge, FaExclamationTriangle, FaUsers, FaUserNinja, FaHospital, FaChartBar, FaBell, FaListAlt, FaUser, FaClipboardList, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from './ui/sidebar';
import { getCloudinaryUrl } from '../config';

const SidebarContent = ({ onLinkClick }) => {
  const { isAdmin, isRescuer, user, logout } = useAuth();
  const navigate = useNavigate();
  const { open } = useSidebar();

  const getMenuItems = () => {
    if (isAdmin) return [
      { to: '/admin/dashboard', label: 'Overview', icon: FaThLarge },
      { to: '/admin/disasters', label: 'Reports', icon: FaExclamationTriangle },
      { to: '/admin/users', label: 'Users', icon: FaUsers },
      { to: '/admin/rescuers', label: 'Rescuers', icon: FaUserNinja },
      { to: '/admin/shelters', label: 'Shelters', icon: FaHospital },
      { to: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
      { to: '/admin/notifications', label: 'Notifications', icon: FaBell },
      { to: '/admin/profile', label: 'Profile', icon: FaUser },
    ];
    if (isRescuer) return [
      { to: '/rescuer/dashboard', label: 'Overview', icon: FaThLarge },
      { to: '/rescuer/missions', label: 'My Missions', icon: FaClipboardList },
      { to: '/rescuer/profile', label: 'Profile', icon: FaUser },
      { to: '/rescuer/notifications', label: 'Notifications', icon: FaBell },
    ];
    return [
      { to: '/user/dashboard', label: 'Overview', icon: FaThLarge },
      { to: '/user/reports', label: 'My Reports', icon: FaListAlt },
      { to: '/user/shelters', label: 'Shelters', icon: FaHome },
      { to: '/user/profile', label: 'Profile', icon: FaUser },
      { to: '/user/notifications', label: 'Notifications', icon: FaBell },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mt-2 mb-4">
        <div className={`flex items-center gap-2.5 px-3 py-2.5 ${!open ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-navy-900 dark:text-white whitespace-pre text-sm"
            >
              ReliefOps
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-navy-800 text-white'
                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {open && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
          <div className="w-8 h-8 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            {user?.profileImage ? (
              <img src={getCloudinaryUrl(user.profileImage)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-navy-700 dark:text-navy-300">{user?.name?.charAt(0)}</span>
            )}
          </div>
          {open && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2.5 w-full px-2 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="h-4 w-4 shrink-0" />
          {open && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <motion.aside
        className="hidden md:flex w-[300px] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto"
        animate={{
          width: open ? 300 : 60,
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <nav className="flex-1 p-3">
          <SidebarContent />
        </nav>
      </motion.aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[90] md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-[100] w-72 bg-white dark:bg-gray-900 shadow-xl flex flex-col md:hidden"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">R</span>
                  </div>
                  <span className="font-bold text-navy-900 dark:text-white text-sm">ReliefOps</span>
                </div>
              </div>
              <nav className="flex-1 p-3 overflow-y-auto">
                <SidebarContent onLinkClick={() => setOpen(false)} />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

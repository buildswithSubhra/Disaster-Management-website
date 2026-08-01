import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Sidebar as SidebarContainer } from '../components/ui/sidebar';

const MainLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SidebarContainer open={sidebarOpen} setOpen={setSidebarOpen}>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 flex flex-col overflow-x-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <div className="flex flex-1 overflow-x-hidden">
          <Sidebar />
          <main className="flex-1 p-3 sm:p-4 lg:p-6 min-w-0">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
        {!isAdmin && <Footer />}
      </div>
    </SidebarContainer>
  );
};

export default MainLayout;

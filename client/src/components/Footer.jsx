import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaExclamationTriangle, FaGithub, FaLinkedin, FaHeart, FaArrowUp } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { title: 'Product', links: [
      { name: 'Dashboard', to: '/user/dashboard' },
      { name: 'Report Disaster', to: '/user/report' },
      { name: 'Find Shelters', to: '/user/shelters' },
      { name: 'My Reports', to: '/user/reports' },
    ]},
    { title: 'Resources', links: [
      { name: 'Emergency Contacts', to: '/emergency-contacts' },
      { name: 'Safety Guidelines', to: '/safety-guidelines' },
      { name: 'Disaster Preparedness', to: '/disaster-preparedness' },
    ]},
    { title: 'Company', links: [
      { name: 'About Us', to: '/about' },
      { name: 'Contact', to: '/contact' },
      { name: 'Privacy Policy', to: '/privacy-policy' },
      { name: 'Terms of Service', to: '/terms-of-service' },
    ]},
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 text-navy-900 dark:text-white relative overflow-hidden border-t border-gray-200 dark:border-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-navy-100/50 dark:bg-navy-800/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-navy-100/30 dark:bg-navy-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12">
            {/* Brand column */}
            <ScrollReveal direction="up" className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy-800 dark:bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-elevated">
                  <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-navy-800" />
                </div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight">ReliefOps</span>
              </div>
              <p className="text-navy-500 dark:text-navy-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm">
                Empowering communities with real-time disaster response and rescue coordination. 
                Every second counts when lives are at stake.
              </p>
              <div className="flex items-center gap-3">
                <motion.a
                  href="https://www.linkedin.com/in/subhradipdas6174"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaLinkedin className="h-4 w-4 text-navy-600 dark:text-white" />
                </motion.a>
                <motion.a
                  href="https://github.com/buildswithSubhra"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaGithub className="h-4 w-4 text-navy-600 dark:text-white" />
                </motion.a>
              </div>
            </ScrollReveal>

            {/* Quick link columns */}
            {quickLinks.map((section, i) => (
              <ScrollReveal key={section.title} direction="up" delay={0.1 * (i + 1)}>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-navy-900 dark:text-white mb-4 sm:mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.to}
                        className="text-navy-500 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white text-xs sm:text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-navy-400 text-xs sm:text-sm flex items-center gap-1">
                Built with <FaHeart className="h-3 w-3 text-danger-500" /> by ReliefOps Team
              </p>
              <p className="text-navy-400 text-xs sm:text-sm">
                © {new Date().getFullYear()} ReliefOps. All rights reserved.
              </p>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaArrowUp className="h-4 w-4 text-navy-600 dark:text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${sizeClasses[size]}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                <motion.button
                  onClick={onClose}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="px-4 sm:px-6 py-3 sm:py-4 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>
              {footer && <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

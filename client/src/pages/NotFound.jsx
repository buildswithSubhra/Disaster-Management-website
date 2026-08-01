import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-navy-800 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="h-8 w-8 text-white" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold mb-2">Error 404</p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FaHome className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

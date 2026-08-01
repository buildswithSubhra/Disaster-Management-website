import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import GlowButton from '../components/GlowButton';
import GoogleSignIn from '../components/GoogleSignIn';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'rescuer' ? '/rescuer/dashboard' : '/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credential) => {
    try {
      const user = await googleLogin(credential);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'rescuer' ? '/rescuer/dashboard' : '/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed.');
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold mb-1">Sign in</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome back.</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to your account to continue.</p>

        {/* Google Sign-In */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <GoogleSignIn onSuccess={handleGoogleSuccess} text="Sign in with Google" />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">or continue with email</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="form-label">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input-field" placeholder="you@example.com" required />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="form-label">Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))} className="input-field" placeholder="Enter password" required />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <GlowButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : <>Sign in <FaArrowRight className="h-4 w-4" /></>}
            </GlowButton>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          No account? <Link to="/register" className="text-navy-800 font-medium hover:underline">Register as citizen or rescuer</Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;

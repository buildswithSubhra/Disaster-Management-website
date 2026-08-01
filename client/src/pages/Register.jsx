import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import GoogleSignIn from '../components/GoogleSignIn';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Required';
    if (!formData.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Required';
    else if (formData.password.length < 6) e.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords mismatch';
    if (!formData.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      const userData = await register(data);
      toast.success('Account created!');
      const role = userData?.role || formData.role;
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'rescuer' ? '/rescuer/dashboard' : '/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credential) => {
    try {
      const user = await googleLogin(credential);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'rescuer' ? '/rescuer/dashboard' : '/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-up failed.');
    }
  };

  const input = (name, label, type = 'text', i = 0) => (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
    >
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={formData[name]}
        onChange={e => { setFormData(p => ({ ...p, [name]: e.target.value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); }}
        className={`input-field ${errors[name] ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
      />
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-error"
        >
          {errors[name]}
        </motion.p>
      )}
    </motion.div>
  );

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold mb-1">Create account</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Join ReliefOps.</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Register as a citizen to report incidents or as a rescuer to respond.</p>

        {/* Google Sign-Up */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <GoogleSignIn onSuccess={handleGoogleSuccess} text="Sign up with Google" />
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

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {input('name', 'Full Name', 'text', 0)}
          {input('email', 'Email', 'email', 1)}
          {input('password', 'Password', 'password', 2)}
          {input('confirmPassword', 'Confirm Password', 'password', 3)}
          {input('phone', 'Phone', 'tel', 4)}

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
              className="input-field resize-none"
              rows="2"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <label className="form-label">Register as</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 'user', l: 'Citizen', d: 'Report incidents' }, { v: 'rescuer', l: 'Rescuer', d: 'Respond to emergencies' }].map(r => (
                <motion.button
                  key={r.v}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: r.v }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                    formData.role === r.v
                      ? 'border-navy-800 bg-navy-50 dark:bg-navy-900/30 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className={`text-sm font-semibold ${formData.role === r.v ? 'text-navy-800' : 'text-gray-700 dark:text-gray-300'}`}>{r.l}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{r.d}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Creating...' : <>Create account <FaArrowRight className="h-4 w-4" /></>}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          Already have an account? <Link to="/login" className="text-navy-800 font-semibold hover:underline">Sign in</Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;

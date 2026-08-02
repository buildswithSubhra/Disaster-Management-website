import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { FaUser, FaEnvelope, FaPhone, FaSave, FaLock, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { API_BASE, getCloudinaryUrl } from '../../config';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user?.profileImage || '');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB');
    if (!file.type.startsWith('image/')) return toast.error('Only image files allowed');

    setUploading(true);
    const formDataImg = new FormData();
    formDataImg.append('image', file);

    try {
      const res = await api.post('/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.data.profileImage;
      setPreview(imageUrl);
      await updateProfile({ profileImage: imageUrl });
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Fill all password fields');
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Min 6 characters');
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setPwLoading(false); }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6"
    >
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Admin Account</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Admin Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account settings.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="card">
        <div className="flex items-center mb-6">
          <div className="relative group">
            <div className="w-14 h-14 bg-navy-50 dark:bg-navy-900/30 rounded-full flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={getCloudinaryUrl(preview)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="h-6 w-6 text-navy-800 dark:text-navy-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-navy-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <FaCamera className="h-3 w-3 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-navy-50 dark:bg-navy-900/30 text-navy-800 dark:text-navy-400 rounded-full capitalize">{user?.role}</span>
          </div>
          {uploading && <span className="ml-3 text-xs text-gray-400">Uploading...</span>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 h-4 w-4" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="form-label">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 h-4 w-4" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-10" disabled />
            </div>
          </div>
          <div>
            <label className="form-label">Phone</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 h-4 w-4" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-10" />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            {loading ? 'Saving...' : <><FaSave className="h-4 w-4" /> Save Changes</>}
          </motion.button>
        </form>
      </motion.div>

      <motion.div variants={item} className="card">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><FaLock className="text-navy-800 dark:text-navy-400" /> Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div><label className="form-label">Current Password</label><input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className="input-field" /></div>
          <div><label className="form-label">New Password</label><input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="input-field" /></div>
          <div><label className="form-label">Confirm New Password</label><input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field" /></div>
          <motion.button
            type="submit"
            disabled={pwLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            {pwLoading ? 'Changing...' : <><FaLock className="h-4 w-4" /> Change Password</>}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;

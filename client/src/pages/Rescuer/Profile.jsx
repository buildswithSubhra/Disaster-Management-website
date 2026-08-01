import React, { useState, useRef } from 'react';
import { FaUser, FaMapMarkerAlt, FaSave, FaCircle, FaLock, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import rescuerService from '../../services/rescuerService';
import api from '../../services/api';
import { API_BASE } from '../../config';

const RescuerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [availability, setAvailability] = useState('Available');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user?.profileImage || '');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB');
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) return toast.error('Only image files allowed');

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

  const handleAvailabilityChange = async (newStatus) => {
    setAvailability(newStatus);
    try {
      await rescuerService.updateAvailability(newStatus);
      toast.success(`Availability updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    }
  };

  const handleLocationUpdate = async () => {
    if (!location.lat || !location.lng) return toast.error('Enter latitude and longitude');
    setLoading(true);
    try {
      await rescuerService.updateLocation({ lat: parseFloat(location.lat), lng: parseFloat(location.lng) });
      toast.success('Location updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setLoading(false); }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude.toString(), lng: pos.coords.longitude.toString() });
          toast.success('Location obtained!');
        },
        () => toast.error('Unable to get location.')
      );
    }
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

  const availabilityOptions = [
    { value: 'Available', color: 'bg-green-500' },
    { value: 'Busy', color: 'bg-orange-500' },
    { value: 'Offline', color: 'bg-gray-400' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Rescuer Account</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Rescuer Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your availability and location.</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center mb-6">
          <div className="relative group">
            <div className="w-14 h-14 bg-navy-50 dark:bg-navy-900/30 rounded-full flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview.startsWith('http') ? preview : `${API_BASE}${preview}`} alt="Profile" className="w-full h-full object-cover" />
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
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-navy-50 dark:bg-navy-900/30 text-navy-800 dark:text-navy-400 rounded-full">Rescuer</span>
          </div>
          {uploading && <span className="ml-3 text-xs text-gray-400">Uploading...</span>}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Availability Status</h3>
        <div className="flex gap-3">
          {availabilityOptions.map(opt => (
            <button key={opt.value} onClick={() => handleAvailabilityChange(opt.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${availability === opt.value ? 'border-navy-800 bg-navy-800 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}>
              <FaCircle className={`h-2 w-2 ${opt.color}`} /> {opt.value}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-navy-800 dark:text-navy-400" /> Update Location
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Latitude</label>
              <input type="number" step="any" value={location.lat} onChange={e => setLocation(prev => ({ ...prev, lat: e.target.value }))} className="input-field" placeholder="e.g. 19.0760" />
            </div>
            <div>
              <label className="form-label">Longitude</label>
              <input type="number" step="any" value={location.lng} onChange={e => setLocation(prev => ({ ...prev, lng: e.target.value }))} className="input-field" placeholder="e.g. 72.8777" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={getCurrentLocation} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
              <FaMapMarkerAlt /> Use Current Location
            </button>
            <button onClick={handleLocationUpdate} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <FaSave className="h-4 w-4" />}
              {loading ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><FaLock className="text-navy-800 dark:text-navy-400" /> Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div><label className="form-label">Current Password</label><input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className="input-field" /></div>
          <div><label className="form-label">New Password</label><input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="input-field" /></div>
          <div><label className="form-label">Confirm New Password</label><input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field" /></div>
          <button type="submit" disabled={pwLoading} className="btn-primary flex items-center gap-2">
            {pwLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <FaLock className="h-4 w-4" />}
            {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RescuerProfile;

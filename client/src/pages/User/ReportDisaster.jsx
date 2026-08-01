import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaMapMarkerAlt, FaFire, FaWater, FaCloud, FaMountain, FaBolt, FaExclamationTriangle, FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import disasterService from '../../services/disasterService';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const ReportDisaster = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', type: '', severity: 'Medium', address: '',
    latitude: '', longitude: '', peopleAffected: '', emergencyContact: '', image: null,
  });

  const disasterTypes = [
    { value: 'Flood', label: 'Flood', icon: FaWater },
    { value: 'Earthquake', label: 'Earthquake', icon: FaMountain },
    { value: 'Fire', label: 'Fire', icon: FaFire },
    { value: 'Cyclone', label: 'Cyclone', icon: FaCloud },
    { value: 'Landslide', label: 'Landslide', icon: FaMountain },
    { value: 'Building Collapse', label: 'Building Collapse', icon: FaExclamationTriangle },
    { value: 'Road Accident', label: 'Road Accident', icon: FaBolt },
  ];

  const severityLevels = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
          toast.success('Location obtained!');
        },
        () => toast.error('Unable to get location.')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Please enter a title');
    if (!formData.type) return toast.error('Please select a disaster type');
    if (!formData.description.trim()) return toast.error('Please enter a description');

    setLoading(true);
    try {
      await disasterService.createDisaster({
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        peopleAffected: formData.peopleAffected ? parseInt(formData.peopleAffected) : undefined,
      });
      toast.success('Report submitted successfully!');
      navigate('/user/reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">New Report</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Report a Disaster</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Help us respond faster by providing accurate information.</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div variants={item} className="card">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Disaster Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {disasterTypes.map(t => (
              <motion.button
                key={t.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: t.value }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 rounded-lg border-2 transition-all text-center cursor-pointer ${formData.type === t.value ? 'border-navy-800 bg-navy-50 dark:bg-navy-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <t.icon className={`h-5 w-5 mx-auto ${formData.type === t.value ? 'text-navy-800 dark:text-navy-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <p className={`mt-2 text-sm font-medium ${formData.type === t.value ? 'text-navy-800 dark:text-navy-400' : 'text-gray-700 dark:text-gray-300'}`}>{t.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Details</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="Brief title describing the disaster" />
            </div>
            <div>
              <label className="form-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none" rows="4" placeholder="Provide detailed information..." />
            </div>
            <div>
              <label className="form-label">Severity Level</label>
              <div className="flex flex-wrap gap-2">
                {severityLevels.map(l => (
                  <motion.button
                    key={l.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: l.value }))}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${formData.severity === l.value ? 'border-navy-800 bg-navy-800 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    {l.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Location</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Address</label>
              <div className="flex gap-2">
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field flex-1" placeholder="Enter the address" />
                <motion.button
                  type="button"
                  onClick={getCurrentLocation}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <FaMapMarkerAlt /> Current Location
                </motion.button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Latitude</label><input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="input-field" placeholder="e.g. 28.6139" /></div>
              <div><label className="form-label">Longitude</label><input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="input-field" placeholder="e.g. 77.2090" /></div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Additional Info</h3>
          <div className="space-y-4">
            <div><label className="form-label">People Affected</label><input type="number" name="peopleAffected" value={formData.peopleAffected} onChange={handleChange} className="input-field" placeholder="Number of people" min="0" /></div>
            <div><label className="form-label">Emergency Contact</label><input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="input-field" placeholder="Phone number" /></div>
            <div>
              <label className="form-label">Photo Evidence</label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setFormData(prev => ({ ...prev, image: null })); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 cursor-pointer"><FaTimes className="h-4 w-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaUpload className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                  <span className="text-sm text-gray-400 dark:text-gray-500">Click to upload photo</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex justify-end gap-3">
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Submitting...' : <><FaExclamationTriangle className="h-4 w-4" /> Submit Report</>}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ReportDisaster;

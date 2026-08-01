import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-navy-300 text-lg mb-12 max-w-2xl">
            Have questions, feedback, or need support? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 text-green-400 px-5 py-3 rounded-xl text-sm"
              >
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="bg-navy-900/50 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-navy-800/50 dark:bg-gray-700/50 border border-white/10 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-navy-500 dark:placeholder-gray-400 focus:outline-none focus:border-white/20 dark:focus:border-gray-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-navy-800/50 dark:bg-gray-700/50 border border-white/10 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-navy-500 dark:placeholder-gray-400 focus:outline-none focus:border-white/20 dark:focus:border-gray-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-navy-800/50 dark:bg-gray-700/50 border border-white/10 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-navy-500 dark:placeholder-gray-400 focus:outline-none focus:border-white/20 dark:focus:border-gray-500 transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-navy-800/50 dark:bg-gray-700/50 border border-white/10 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-navy-500 dark:placeholder-gray-400 focus:outline-none focus:border-white/20 dark:focus:border-gray-500 transition-colors resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-gray-800 text-navy-900 dark:text-white font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FaPaperPlane className="h-4 w-4" /> {loading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            {[
              { icon: FaEnvelope, label: 'Email', value: 'contact@disastermanagement.com' },
              { icon: FaPhone, label: 'Phone', value: '+91-XXXXXXXXXX' },
              { icon: FaMapMarkerAlt, label: 'Address', value: 'Your City, India' },
            ].map((item) => (
              <div key={item.label} className="bg-navy-900/50 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-navy-300">{item.label}</span>
                </div>
                <p className="text-white text-sm ml-12">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

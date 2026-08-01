import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft, FaExclamationTriangle, FaUsers, FaGlobe, FaHeart } from 'react-icons/fa';

const values = [
  { title: 'Speed', description: 'Every second matters. Our system is built for rapid disaster reporting and response coordination.', icon: FaExclamationTriangle },
  { title: 'Community', description: 'We believe in empowering communities to help each other during emergencies.', icon: FaUsers },
  { title: 'Accessibility', description: 'Emergency tools should be accessible to everyone, regardless of device or location.', icon: FaGlobe },
  { title: 'Compassion', description: 'We build with empathy, knowing that every alert represents real people in need.', icon: FaHeart },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">About ReliefOps</h1>
          <p className="text-navy-300 text-lg mb-12 max-w-2xl">
            A disaster management and emergency response platform designed to save lives through rapid coordination and community empowerment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900/50 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-8 mb-10"
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-navy-300 leading-relaxed">
            ReliefOps aims to bridge the gap between disaster events and emergency response. By providing a real-time
            platform for reporting, tracking, and coordinating disaster response efforts, we help communities, rescuers,
            and administrators work together to minimize the impact of emergencies. Our goal is to make disaster response
            faster, more efficient, and more accessible to everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="bg-navy-900/30 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-6 hover:border-white/10 dark:hover:border-gray-600 transition-all"
            >
              <div className="w-11 h-11 bg-navy-800 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-navy-400 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

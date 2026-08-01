import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaPhone, FaAmbulance, FaFire, FaShieldAlt, FaHeartbeat, FaHospital, FaUserShield, FaArrowLeft } from 'react-icons/fa';

const contacts = [
  { name: 'National Emergency Number', number: '112', description: 'Unified emergency number for all services', icon: FaPhone, color: 'bg-red-500' },
  { name: 'Police', number: '100', description: 'For crime reporting and law enforcement', icon: FaUserShield, color: 'bg-blue-500' },
  { name: 'Fire Brigade', number: '101', description: 'Fire emergencies and rescue operations', icon: FaFire, color: 'bg-orange-500' },
  { name: 'Ambulance', number: '102', description: 'Medical emergencies and hospital transport', icon: FaAmbulance, color: 'bg-green-500' },
  { name: 'Disaster Management', number: '108', description: 'Natural disasters and large-scale emergencies', icon: FaShieldAlt, color: 'bg-purple-500' },
  { name: 'Health Helpline', number: '104', description: 'Health-related queries and medical guidance', icon: FaHeartbeat, color: 'bg-pink-500' },
  { name: 'Women Helpline', number: '1091', description: 'Women in distress or emergency situations', icon: FaHospital, color: 'bg-teal-500' },
  { name: 'Child Helpline', number: '1098', description: 'Child abuse, neglect, or emergency', icon: FaHeartbeat, color: 'bg-indigo-500' },
];

const EmergencyContacts = () => {
  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">Emergency Contacts</h1>
          <p className="text-navy-300 text-lg mb-12 max-w-2xl">
            Important emergency numbers for India. In case of any emergency, dial the appropriate number immediately.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-navy-900/50 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-6 hover:border-white/10 dark:hover:border-gray-600 transition-all group"
            >
              <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <contact.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{contact.name}</h3>
              <p className="text-3xl font-bold text-white mb-2">{contact.number}</p>
              <p className="text-navy-400 text-sm">{contact.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-navy-900/30 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold mb-4">Important Tips</h2>
          <ul className="space-y-3 text-navy-300 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
              Stay calm and provide clear information about your location and the emergency.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
              Do not call emergency numbers for non-emergency situations.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
              Keep emergency numbers saved in your phone and written somewhere accessible.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
              If you witness an accident or disaster, ensure your own safety first before helping others.
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyContacts;

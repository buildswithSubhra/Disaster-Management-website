import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFirstAid, FaWater, FaBreadSlice, FaBolt, FaMobileAlt, FaUsers } from 'react-icons/fa';

const sections = [
  {
    title: 'Emergency Kit Essentials',
    icon: FaFirstAid,
    color: 'bg-red-500',
    items: [
      'Water — at least 1 gallon per person per day (3-day supply)',
      'Non-perishable food and manual can opener',
      'First aid kit with medications',
      'Flashlight and extra batteries',
      'Battery-powered or hand-crank radio',
      'Whistle to signal for help',
      'Dust masks, plastic sheeting, and duct tape',
      'Moist towelettes, garbage bags, and personal hygiene items',
      'Wrench or pliers to turn off utilities',
      'Local maps and important documents in waterproof container',
    ],
  },
  {
    title: 'Water Safety',
    icon: FaWater,
    color: 'bg-blue-500',
    items: [
      'Store at least 3 days of drinking water per person',
      'Learn how to purify water (boiling, tablets, filtration)',
      'Identify alternate water sources (rainwater collection)',
      'Know how to shut off your water main',
      'Keep a water purification kit in your emergency supplies',
    ],
  },
  {
    title: 'Food Preparedness',
    icon: FaBreadSlice,
    color: 'bg-orange-500',
    items: [
      'Stock non-perishable foods that require no cooking',
      'Keep a manual can opener available',
      'Store foods in cool, dry, dark places',
      'Rotate food supplies every 6 months',
      'Include comfort foods for children and elderly family members',
    ],
  },
  {
    title: 'Power & Communication',
    icon: FaBolt,
    color: 'bg-yellow-500',
    items: [
      'Keep phones and portable chargers fully charged',
      'Have backup batteries and solar chargers',
      'Know the location of your circuit breaker and gas shutoff',
      'Keep a battery-powered radio for emergency broadcasts',
      'Save emergency contacts in your phone and on paper',
    ],
  },
  {
    title: 'Family Communication Plan',
    icon: FaMobileAlt,
    color: 'bg-purple-500',
    items: [
      'Designate an out-of-area emergency contact',
      'Create a family communication plan and practice it',
      'Establish meeting points near home and outside your neighborhood',
      'Teach children how to call emergency services',
      'Keep copies of important documents in a secure, accessible place',
    ],
  },
  {
    title: 'Community Preparedness',
    icon: FaUsers,
    color: 'bg-green-500',
    items: [
      'Know your neighbors and community emergency plans',
      'Identify evacuation routes from your area',
      'Know the location of nearby emergency shelters',
      'Participate in community emergency drills',
      'Consider taking a first aid and CPR course',
    ],
  },
];

const DisasterPreparedness = () => {
  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">Disaster Preparedness</h1>
          <p className="text-navy-300 text-lg mb-12 max-w-2xl">
            Being prepared can make the difference between life and death. Follow these steps to ensure you and your family are ready for any emergency.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-navy-900/50 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-6 hover:border-white/10 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 ${section.color} rounded-xl flex items-center justify-center`}>
                  <section.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-navy-300 text-sm">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisasterPreparedness;

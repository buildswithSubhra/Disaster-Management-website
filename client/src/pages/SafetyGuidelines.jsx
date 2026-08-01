import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft, FaWater, FaFire, FaBuilding, FaWind, FaMountain, FaCarCrash } from 'react-icons/fa';

const guidelines = [
  {
    type: 'Flood',
    icon: FaWater,
    color: 'bg-blue-500',
    tips: [
      'Move to higher ground immediately if water is rising.',
      'Do not walk or drive through floodwaters.',
      'Avoid contact with electrical equipment if wet.',
      'Listen to emergency broadcasts for updates.',
      'Disconnect electrical appliances if safe to do so.',
    ],
  },
  {
    type: 'Fire',
    icon: FaFire,
    color: 'bg-orange-500',
    tips: [
      'Get down low and crawl under smoke.',
      'Feel doors before opening — use the back of your hand.',
      'Stop, drop, and roll if your clothes catch fire.',
      'Have an escape plan and practice it regularly.',
      'Never use elevators during a fire.',
    ],
  },
  {
    type: 'Earthquake',
    icon: FaBuilding,
    color: 'bg-yellow-500',
    tips: [
      'Drop, Cover, and Hold On under sturdy furniture.',
      'Stay away from windows and heavy objects.',
      'If outdoors, move to an open area away from buildings.',
      'If driving, pull over and stay in the car.',
      'Be prepared for aftershocks.',
    ],
  },
  {
    type: 'Cyclone',
    icon: FaWind,
    color: 'bg-purple-500',
    tips: [
      'Secure your home — board up windows and secure loose objects.',
      'Stock up on food, water, and emergency supplies.',
      'Stay indoors and away from windows during the storm.',
      'Follow evacuation orders if issued.',
      'Avoid coastal areas during storm warnings.',
    ],
  },
  {
    type: 'Landslide',
    icon: FaMountain,
    color: 'bg-green-500',
    tips: [
      'Move away from the path of the landslide.',
      'Listen for unusual sounds like trees cracking or boulders knocking.',
      'Avoid steep hillsides during heavy rain.',
      'If driving, do not cross landslide-prone areas.',
      'Report any signs of ground movement to authorities.',
    ],
  },
  {
    type: 'Road Accident',
    icon: FaCarCrash,
    color: 'bg-red-500',
    tips: [
      'Call emergency services immediately.',
      'Do not move injured persons unless they are in danger.',
      'Use warning triangles or hazard lights.',
      'Stay calm and provide first aid if trained.',
      'Move to a safe area away from traffic.',
    ],
  },
];

const SafetyGuidelines = () => {
  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">Safety Guidelines</h1>
          <p className="text-navy-300 text-lg mb-12 max-w-2xl">
            Essential safety tips for different types of emergencies. Knowing what to do can save lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidelines.map((item, i) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-navy-900/50 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-6 hover:border-white/10 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">{item.type}</h2>
              </div>
              <ul className="space-y-3">
                {item.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-3 text-navy-300 text-sm">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full mt-2 shrink-0" />
                    {tip}
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

export default SafetyGuidelines;

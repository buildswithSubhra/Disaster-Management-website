import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaShieldAlt, FaChevronRight } from 'react-icons/fa';

const safetyTips = [
  {
    id: 1,
    title: 'Emergency Kit',
    tip: 'Keep a 72-hour emergency kit with water, food, flashlight, batteries, first aid supplies, and important documents.',
    category: 'Preparedness',
  },
  {
    id: 2,
    title: 'Evacuation Plan',
    tip: 'Know at least two evacuation routes from your home and workplace. Practice with your family regularly.',
    category: 'Planning',
  },
  {
    id: 3,
    title: 'Stay Informed',
    tip: 'Monitor weather alerts and official announcements. Keep a battery-powered radio for emergencies.',
    category: 'Awareness',
  },
  {
    id: 4,
    title: 'Water Safety',
    tip: 'During floods, never walk or drive through standing water. Just 6 inches can knock you down.',
    category: 'Safety',
  },
  {
    id: 5,
    title: 'Fire Safety',
    tip: 'Test smoke alarms monthly. Know how to use a fire extinguisher. Have a family meeting point.',
    category: 'Prevention',
  },
  {
    id: 6,
    title: 'First Aid',
    tip: 'Learn basic first aid and CPR. Keep emergency numbers saved in your phone and written down.',
    category: 'Medical',
  },
];

const SafetyTips = () => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % safetyTips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-navy-50 to-navy-100/50 rounded-xl p-4 border border-navy-100"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-navy-800 flex-shrink-0">
              <FaShieldAlt className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-navy-800">{safetyTips[currentTip].title}</p>
                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-navy-200/50 text-navy-600">
                  {safetyTips[currentTip].category}
                </span>
              </div>
              <p className="text-xs text-navy-600 leading-relaxed">{safetyTips[currentTip].tip}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tip navigation */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          {safetyTips.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTip(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentTip ? 'bg-navy-800 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentTip(prev => (prev + 1) % safetyTips.length)}
          className="flex items-center gap-1 text-[10px] text-navy-600 hover:text-navy-800 transition-colors cursor-pointer"
        >
          Next tip <FaChevronRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
};

export default SafetyTips;

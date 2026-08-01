import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const mockAlerts = [
  {
    id: 1,
    title: 'Cyclone Warning - Gujarat Coast',
    message: 'Severe cyclonic storm expected to make landfall. Evacuate coastal areas immediately.',
    severity: 'critical',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Flood Alert - Mumbai',
    message: 'Heavy rainfall expected. Avoid low-lying areas and stay indoors.',
    severity: 'high',
    time: '4 hours ago',
  },
  {
    id: 3,
    title: 'Heatwave Advisory - Delhi',
    message: 'Extreme heat conditions. Stay hydrated and avoid outdoor activities between 12PM-4PM.',
    severity: 'medium',
    time: '6 hours ago',
  },
];

const EmergencyAlertBanner = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [currentAlert, setCurrentAlert] = useState(0);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAlert(prev => (prev + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  const handleDismiss = (id) => {
    setDismissed(prev => [...prev, id]);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const visibleAlerts = alerts.filter(a => !dismissed.includes(a.id));
  if (visibleAlerts.length === 0) return null;

  const severityColors = {
    critical: 'bg-danger-500/10 border-danger-500/30 text-danger-600',
    high: 'bg-warning-500/10 border-warning-500/30 text-warning-600',
    medium: 'bg-info-500/10 border-info-500/30 text-info-600',
  };

  const severityDot = {
    critical: 'bg-danger-500 animate-pulse',
    high: 'bg-warning-500',
    medium: 'bg-info-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleAlerts[currentAlert]?.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden rounded-xl border p-3 sm:p-4 ${severityColors[visibleAlerts[currentAlert]?.severity]}`}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${severityDot[visibleAlerts[currentAlert]?.severity]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FaExclamationTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-semibold">{visibleAlerts[currentAlert]?.title}</p>
              </div>
              <p className="text-[10px] sm:text-xs opacity-80 line-clamp-2">{visibleAlerts[currentAlert]?.message}</p>
              <p className="text-[9px] sm:text-[10px] opacity-60 mt-1">{visibleAlerts[currentAlert]?.time}</p>
            </div>
            <button
              onClick={() => handleDismiss(visibleAlerts[currentAlert]?.id)}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Progress bar for auto-rotate */}
          {visibleAlerts.length > 1 && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Alert indicators */}
      {visibleAlerts.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {visibleAlerts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentAlert(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentAlert ? 'bg-navy-800 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EmergencyAlertBanner;

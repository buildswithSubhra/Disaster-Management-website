import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WEATHER_STATES = ['rain', 'snow', 'storm', 'cloudy', 'clear', 'fog'];

const WeatherBackground = () => {
  const [currentWeather, setCurrentWeather] = useState('rain');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeather(prev => {
        const currentIndex = WEATHER_STATES.indexOf(prev);
        return WEATHER_STATES[(currentIndex + 1) % WEATHER_STATES.length];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient that changes with weather */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWeather}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            background: getWeatherGradient(currentWeather),
          }}
        />
      </AnimatePresence>

      {/* Weather particles */}
      <AnimatePresence mode="wait">
        {currentWeather === 'rain' && <RainEffect key="rain" />}
        {currentWeather === 'snow' && <SnowEffect key="snow" />}
        {currentWeather === 'storm' && <StormEffect key="storm" />}
        {currentWeather === 'cloudy' && <CloudEffect key="cloudy" />}
        {currentWeather === 'clear' && <SunEffect key="clear" />}
        {currentWeather === 'fog' && <FogEffect key="fog" />}
      </AnimatePresence>

      {/* Weather label */}
      <motion.div
        className="absolute bottom-8 right-8 z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWeather}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
          >
            <span className="text-white/60">{getWeatherIcon(currentWeather)}</span>
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">{currentWeather}</span>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

function getWeatherGradient(weather) {
  const gradients = {
    rain: 'linear-gradient(180deg, #0a1929 0%, #1a365d 50%, #1e3a5f 100%)',
    snow: 'linear-gradient(180deg, #1a2332 0%, #2d3748 50%, #4a5568 100%)',
    storm: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    cloudy: 'linear-gradient(180deg, #1a2332 0%, #2d3748 50%, #4a5568 100%)',
    clear: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
    fog: 'linear-gradient(180deg, #1a202c 0%, #2d3748 50%, #718096 100%)',
  };
  return gradients[weather] || gradients.rain;
}

function getWeatherIcon(weather) {
  const icons = {
    rain: '🌧️',
    snow: '❄️',
    storm: '⛈️',
    cloudy: '☁️',
    clear: '☀️',
    fog: '🌫️',
  };
  return icons[weather] || '🌧️';
}

const RainEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="absolute inset-0"
  >
    {Array.from({ length: 80 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[1px] bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"
        style={{
          left: `${Math.random() * 100}%`,
          height: `${Math.random() * 30 + 20}px`,
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: '110vh',
          opacity: [0, 0.7, 0.7, 0],
        }}
        transition={{
          duration: Math.random() * 0.8 + 0.6,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'linear',
        }}
      />
    ))}
  </motion.div>
);

const SnowEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="absolute inset-0"
  >
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white/60"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: '110vh',
          x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: 'linear',
        }}
      />
    ))}
  </motion.div>
);

const StormEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="absolute inset-0"
  >
    {/* Lightning flashes */}
    <motion.div
      className="absolute inset-0 bg-white/5"
      animate={{
        opacity: [0, 0, 0, 0.3, 0, 0.15, 0, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        times: [0, 0.4, 0.42, 0.43, 0.44, 0.45, 0.46, 1],
      }}
    />
    {/* Rain */}
    {Array.from({ length: 100 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
        style={{
          left: `${Math.random() * 100}%`,
          height: `${Math.random() * 40 + 30}px`,
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: '110vh',
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: Math.random() * 0.4 + 0.3,
          repeat: Infinity,
          delay: Math.random() * 1.5,
          ease: 'linear',
        }}
      />
    ))}
  </motion.div>
);

const CloudEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="absolute inset-0"
  >
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white/5 blur-xl"
        style={{
          width: `${Math.random() * 200 + 100}px`,
          height: `${Math.random() * 60 + 40}px`,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, 100, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: Math.random() * 10 + 15,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);

const SunEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="absolute inset-0"
  >
    {/* Sun glow */}
    <motion.div
      className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.1) 40%, transparent 70%)',
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    {/* Light rays */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/4 right-1/4 w-[2px] h-24 origin-bottom"
        style={{
          background: 'linear-gradient(to top, rgba(251, 191, 36, 0.2), transparent)',
          transform: `rotate(${i * 45}deg)`,
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scaleY: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);

const FogEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="absolute inset-0"
  >
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-full h-32 bg-white/5 blur-2xl"
        style={{
          top: `${20 + i * 15}%`,
        }}
        animate={{
          x: [-100, 100, -100],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: Math.random() * 8 + 8,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);

export default WeatherBackground;

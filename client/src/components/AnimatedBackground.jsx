import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const DISASTER_VIDEOS = [
  'https://cdn.pixabay.com/video/2015/08/11/305-135918495_large.mp4',
  'https://cdn.pixabay.com/video/2015/08/11/304-135918292_large.mp4',
  'https://cdn.pixabay.com/video/2016/05/12/3127-166335864_large.mp4',
  'https://cdn.pixabay.com/video/2025/03/27/267960_large.mp4',
];

const AnimatedBackground = ({ className = '' }) => {
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % DISASTER_VIDEOS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Animated gradient fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />

      {/* Video layer */}
      <div
        key={videoIndex}
        className="absolute inset-0 animate-fade-in"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => {}}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={DISASTER_VIDEOS[videoIndex]} type="video/mp4" />
        </video>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-navy-950/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />

      {/* Atmospheric glow effects */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-[120px]"
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[100px]"
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 35, -25, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/2 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default AnimatedBackground;

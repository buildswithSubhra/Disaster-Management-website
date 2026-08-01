import React from 'react';
import { motion } from 'framer-motion';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/** Fades + lifts a block into place the first time it enters the viewport. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      
      {children}
    </motion.div>);

}

type RevealWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
};

/** Staggers a headline in word by word with a soft mask-style lift. */
export function RevealWords({ text, className, wordClassName }: RevealWordsProps) {
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      transition={{ staggerChildren: 0.055 }}>
      
      {words.map((word, index) =>
      <span
        key={`${word}-${index}`}
        className="inline-block overflow-hidden align-bottom">
        
          <motion.span
          className={`inline-block ${wordClassName ?? ''}`}
          variants={{
            hidden: { y: '105%', opacity: 0 },
            visible: { y: '0%', opacity: 1 }
          }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
          
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      )}
    </motion.span>);

}
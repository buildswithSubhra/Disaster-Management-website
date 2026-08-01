import React from 'react';

const GradientText = ({ children, className = '', from = 'from-navy-800', to = 'to-navy-500', animate = false }) => {
  const isHex = from.startsWith('#') || to.startsWith('#');

  if (isHex) {
    return (
      <span
        className={`bg-clip-text text-transparent ${animate ? 'animate-gradient-x' : ''} ${className}`}
        style={{ backgroundImage: `linear-gradient(to right, ${from}, ${to})` }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`
        bg-clip-text text-transparent bg-gradient-to-r ${from} ${to}
        ${animate ? 'animate-gradient-x' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default GradientText;

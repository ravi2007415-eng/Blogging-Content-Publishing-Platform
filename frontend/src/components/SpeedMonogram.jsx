import React from 'react';

export const SpeedMonogram = ({ size = 26, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`speed-monogram ${className}`}
      style={{ verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="keryxSpeedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="keryxWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#4FACFE" />
        </linearGradient>
      </defs>

      {/* Speed Motion Lines */}
      <path d="M 6 30 L 22 30 L 16 38 L 0 38 Z" fill="url(#keryxWingGrad)" opacity="0.6" />
      <path d="M 2 48 L 20 48 L 14 56 L -4 56 Z" fill="url(#keryxWingGrad)" opacity="0.85" />
      <path d="M 8 66 L 24 66 L 18 74 L 2 74 Z" fill="url(#keryxWingGrad)" opacity="0.5" />

      {/* Stylized Speed Monogram "K" */}
      {/* Main slanted stem of K */}
      <path
        d="M 28 16 L 46 16 L 32 84 L 14 84 Z"
        fill="url(#keryxSpeedGrad)"
      />

      {/* Top diagonal speed wing of K */}
      <path
        d="M 44 48 L 74 16 L 98 16 L 60 54 Z"
        fill="url(#keryxSpeedGrad)"
      />

      {/* Bottom diagonal speed arrow of K */}
      <path
        d="M 52 44 L 88 84 L 66 84 L 38 52 Z"
        fill="url(#keryxWingGrad)"
      />
    </svg>
  );
};

export default SpeedMonogram;

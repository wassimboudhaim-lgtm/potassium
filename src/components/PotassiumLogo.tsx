import React from 'react';

interface PotassiumLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  withBackground?: boolean;
  animated?: boolean;
}

export const PotassiumLogo: React.FC<PotassiumLogoProps> = ({
  className = '',
  size = 32,
  glow = false,
  withBackground = false,
  animated = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${glow ? 'drop-shadow-[0_0_16px_rgba(0,240,255,0.6)]' : ''} ${className}`}
      aria-label="POTASSIUM Official Logo"
    >
      <defs>
        {/* Top Eyelid Gradient: Emerald Green to Vibrant Cyan */}
        <linearGradient id="potassiumTopLidGrad" x1="15%" y1="65%" x2="85%" y2="50%">
          <stop offset="0%" stopColor="#00e887" />
          <stop offset="24%" stopColor="#00f5a0" />
          <stop offset="55%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#00d2ff" />
        </linearGradient>

        {/* Spiral & Lower Lid Gradient: Electric Cyan to Vivid Royal Blue */}
        <linearGradient id="potassiumSpiralGrad" x1="90%" y1="45%" x2="40%" y2="55%">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="35%" stopColor="#00b4ff" />
          <stop offset="68%" stopColor="#0077ff" />
          <stop offset="92%" stopColor="#0055ff" />
          <stop offset="100%" stopColor="#003cd6" stopOpacity="0.8" />
        </linearGradient>

        {/* Ambient Blur Filter */}
        <filter id="potassiumGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" opacity="0.5" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Optional solid black background */}
      {withBackground && <rect width="512" height="512" fill="#000000" rx="90" />}

      <g filter={glow ? 'url(#potassiumGlowFilter)' : undefined} className={animated ? 'animate-pulse' : ''}>
        {/* Top Arc Path: Starts from lower left tail, forms left corner, arches across the top, meets right corner */}
        <path
          d="M 124 308
             L 96 262
             C 155 174 240 156 345 180
             C 376 187 403 216 426 262"
          fill="none"
          stroke="url(#potassiumTopLidGrad)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower Lid and Inner Iris Spiral */}
        <path
          d="M 426 262
             C 400 312 345 362 256 362
             C 192 362 166 318 166 268
             C 166 220 206 200 252 200
             C 288 200 306 222 306 254"
          fill="none"
          stroke="url(#potassiumSpiralGrad)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

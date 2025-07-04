import React from 'react';

const ProgressRing = ({ 
  value = 0, 
  max = 100, 
  size = 80, 
  strokeWidth = 8,
  color = '#0066CC',
  className = '' 
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg
        height={size}
        width={size}
        className="progress-ring"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="progress-ring-circle"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-800">
          {Math.round((value / max) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
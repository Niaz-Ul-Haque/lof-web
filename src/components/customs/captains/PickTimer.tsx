'use client';

import React from 'react';

interface PickTimerProps {
  secondsRemaining: number;
  isActive: boolean;
}

const PickTimer: React.FC<PickTimerProps> = ({ secondsRemaining, isActive }) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining <= 5 && isActive;
  const isWarning = secondsRemaining <= 10 && isActive;

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          text-2xl font-mono font-bold px-4 py-2 rounded-lg transition-all duration-300
          ${isUrgent
            ? 'bg-red-600 text-white animate-pulse shadow-lg scale-110'
            : isWarning
              ? 'bg-yellow-600 text-white shadow-md'
              : isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300'
          }
        `}
      >
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      
      {/* ARIA live region for screen readers */}
      <div
        aria-live={isUrgent ? 'assertive' : 'polite'}
        aria-atomic="true"
        className="sr-only"
      >
        {isActive && (
          isUrgent
            ? `${secondsRemaining} seconds remaining - urgent!`
            : isWarning
              ? `${secondsRemaining} seconds remaining`
              : secondsRemaining % 10 === 0 && secondsRemaining > 0
                ? `${secondsRemaining} seconds remaining`
                : ''
        )}
      </div>
    </div>
  );
};

export default PickTimer;
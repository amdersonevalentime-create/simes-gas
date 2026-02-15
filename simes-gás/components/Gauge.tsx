
import React from 'react';

interface GaugeProps {
  percentage: number;
}

const Gauge: React.FC<GaugeProps> = ({ percentage }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;
  
  const isCritical = percentage <= 10;
  const isWarning = percentage <= 25 && percentage > 10;

  const getColor = () => {
    if (isCritical) return '#ef4444'; // Red
    if (isWarning) return '#f59e0b'; // Amber
    return '#3b82f6'; // Blue
  };

  return (
    <div className="relative flex items-center justify-center p-2">
      {/* Background Glow */}
      {isCritical && (
        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-[80px] animate-pulse" />
      )}
      
      <svg className="w-60 h-60 transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getColor()} />
            <stop offset="100%" stopColor={isCritical ? '#7f1d1d' : isWarning ? '#b45309' : '#1d4ed8'} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          className="text-gray-800/80"
        />
        
        {/* Progress Circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter={isCritical ? "url(#glow)" : ""}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center text-center select-none">
        <div className="flex items-baseline gap-0.5">
          <span className={`text-6xl font-black tracking-tighter ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {Math.round(percentage)}
          </span>
          <span className={`text-xl font-bold ${isCritical ? 'text-red-500' : 'text-gray-500'}`}>%</span>
        </div>
        <div className={`mt-1 flex flex-col items-center`}>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 opacity-80">Nível Gás</span>
          {isCritical && (
            <span className="text-[8px] font-black uppercase text-red-500 mt-0.5 tracking-widest animate-pulse">Recarga Necessária</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gauge;

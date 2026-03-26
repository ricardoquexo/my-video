import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const AnimatedChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress of the chart drawing (0 to 1) over 2 seconds
  const progress = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
    durationInFrames: fps * 2,
  });

  // Number counting from 74 to 300 over the entire video or a specific duration
  const count = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: fps * 2.5,
  }) * (300 - 74) + 74;

  const countFormatted = Math.floor(count);

  return (
    <AbsoluteFill 
      className="bg-[#020617] text-white flex flex-col p-16 font-sans relative"
      style={{
        // A deep blue background with a subtle glow at the bottom matching the image
        backgroundImage: "radial-gradient(circle at 50% 110%, rgba(56, 189, 248, 0.4) 0%, rgba(2, 6, 23, 1) 75%)"
      }}
    >
      
      {/* Top Header */}
      <div className="w-full flex justify-between items-center text-3xl font-light text-slate-400 z-10 pt-4">
        <span>Data updated 2h ago</span>
        <div className="px-6 py-2 rounded-[2rem] border border-slate-700/50 bg-slate-800/30 flex items-center gap-2">
          Monthly
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[600px] mt-32 absolute top-[150px] left-0 right-0 p-16">
        
        {/* Background Grid */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-slate-500" />
          ))}
        </div>
        <div className="absolute inset-0 flex justify-between opacity-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-full w-[1px] bg-slate-500" />
          ))}
        </div>

        {/* SVG Chart Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1080 600">
          
          <defs>
            <linearGradient id="glowPulse" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Defines the curve of the graph */}
          <path 
            id="chartLine"
            d="M 50 450 C 250 500, 350 450, 450 150 C 500 0, 560 0, 600 200 C 660 450, 750 450, 850 460 C 950 470, 1000 450, 1030 430" 
            fill="none" 
            stroke="#60a5fa" 
            strokeWidth="8" 
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress * 100}
            filter="url(#glow)"
          />
          
          {/* Glowing Peak Dot, calculating opacity based on progress so it fades in */}
          {progress > 0.5 && (
            <g 
              transform={`translate(525, 75)`} 
              style={{ opacity: Math.min(1, (progress - 0.5) * 5) }}
            >
              <circle r="30" fill="#7dd3fc" style={{ filter: "blur(20px)", opacity: 0.6 }} />
              <circle r="16" fill="#bae6fd" />
              <circle r="8" fill="#ffffff" />
            </g>
          )}

        </svg>
      </div>

      {/* Bottom Numbers directly matching the picture */}
      <div className="flex flex-col items-center absolute bottom-[100px] left-0 right-0 z-10">
        <span className="text-4xl text-slate-300 font-light mb-2">Conversion rate</span>
        <div className="flex items-start relative pb-6 pt-2">
          <span className="text-[170px] leading-none font-semibold text-white tracking-tighter" style={{ fontFamily: "Arial, sans-serif" }}>
            {countFormatted}%
            <span className="text-5xl text-emerald-400 font-bold ml-2 absolute top-4">↗</span>
          </span>
        </div>
        <span className="text-2xl text-slate-400 font-light mt-2">Increase vs last month</span>
      </div>

    </AbsoluteFill>
  );
};

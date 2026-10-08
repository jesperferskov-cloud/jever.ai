import React from 'react';

interface VectorArtworkProps {
  caption?: string;
}

export const VectorArtwork: React.FC<VectorArtworkProps> = ({
  caption = 'Sideotsikst af jsrer er naturgation',
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#201c18]">
      <svg
        viewBox="0 0 460 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Soft Sage-Green Base Container (Mockup matching) */}
          <linearGradient id="sage-base" x1="0%" y1="100%" x2="60%" y2="0%">
            <stop offset="0%" stopColor="#98a892" />
            <stop offset="100%" stopColor="#a3b49d" />
          </linearGradient>

          {/* Warm Sand dunes ribbon */}
          <linearGradient id="sand-wave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5cc9c" />
            <stop offset="60%" stopColor="#cbb389" />
            <stop offset="100%" stopColor="#8c7757" />
          </linearGradient>
        </defs>

        {/* Dark espresso base */}
        <rect width="460" height="300" fill="#25201c" />

        {/* Soft Sage-Green base container block on bottom-left (1:1 with mockup) */}
        <path
          d="M0 210 C 80 200, 140 230, 210 240 C 240 245, 260 270, 275 300 L 0 300 Z"
          fill="url(#sage-base)"
        />

        {/* Warm wheat/sand architectural flowing ribbon */}
        <path
          d="M 460 110 C 390 140, 310 170, 240 220 C 210 240, 190 280, 210 300 L 460 300 Z"
          fill="url(#sand-wave)"
          fillOpacity="0.85"
        />

        {/* Intricate 3D topographic wave lines (matching mockup moire curves) */}
        {Array.from({ length: 30 }).map((_, i) => {
          const t = i / 29;
          const yStart = 140 + t * 90;
          const cp1x = 110 + t * 50;
          const cp1y = 70 + t * 150;
          const cp2x = 260 - t * 30;
          const cp2y = 180 + t * 120;
          const endX = 450;
          const endY = 150 + t * 160;

          return (
            <path
              key={i}
              d={`M -20 ${yStart} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
              fill="none"
              stroke={i % 3 === 0 ? '#ece7dc' : i % 2 === 0 ? '#382f27' : '#cfbc9a'}
              strokeWidth={i === 15 ? '1.3' : '0.7'}
              strokeOpacity={0.2 + t * 0.5}
            />
          );
        })}

        {/* Subtle diagonal stylus needle line */}
        <line
          x1="260"
          y1="190"
          x2="310"
          y2="220"
          stroke="#ece7dc"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>

      {/* Caption text in bottom-left: "Sideotsikst af jsrer er naturgation" (1:1 with mockup) */}
      <div className="absolute bottom-3 left-4 text-[10px] sm:text-[11px] font-sans text-[#2e362c] font-medium tracking-tight pointer-events-none">
        {caption}
      </div>
    </div>
  );
};

import React from 'react';
import { BlogPost } from '../types/blog';
import { WaveCoverRenderer } from './WaveCoverRenderer';

interface VectorArtworkProps {
  post?: BlogPost;
  caption?: string;
  panOffset?: { x: number; y: number };
}

export const VectorArtwork: React.FC<VectorArtworkProps> = ({
  post,
  caption,
  panOffset = { x: 0, y: 0 },
}) => {
  const displayCaption = caption || post?.hardware || 'Sideotsikst af jsrer er naturgation';

  // If post has a parametric wave cover config, render using the WaveCoverRenderer engine
  if (post?.coverWave) {
    return (
      <WaveCoverRenderer
        config={post.coverWave}
        caption={displayCaption}
        panOffset={panOffset}
      />
    );
  }

  const type = post?.artworkType || 'dunes';

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#201c18]">
      <div
        className="w-full h-full will-change-transform"
        style={{
          transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg
          viewBox="0 0 460 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover scale-[1.04]"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Sage base */}
            <linearGradient id="sage-base" x1="0%" y1="100%" x2="60%" y2="0%">
              <stop offset="0%" stopColor="#98a892" />
              <stop offset="100%" stopColor="#a3b49d" />
            </linearGradient>

            {/* Warm sand dunes ribbon */}
            <linearGradient id="sand-wave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e5cc9c" />
              <stop offset="60%" stopColor="#cbb389" />
              <stop offset="100%" stopColor="#8c7757" />
            </linearGradient>

            {/* Terracotta gradient for post 003 */}
            <linearGradient id="terra-wave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c98a75" />
              <stop offset="50%" stopColor="#b57662" />
              <stop offset="100%" stopColor="#7a4636" />
            </linearGradient>

            {/* Wheat gradient for post 002 */}
            <linearGradient id="wheat-wave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e5cc9c" />
              <stop offset="60%" stopColor="#d1b782" />
              <stop offset="100%" stopColor="#4a3c2c" />
            </linearGradient>
          </defs>

          {/* Dark espresso base */}
          <rect width="460" height="300" fill="#25201c" />

          {/* Dynamic illustration per artworkType */}
          {type === 'dunes' && (
            <>
              {/* Soft Sage-Green base container block on bottom-left (1:1 with mockup) */}
              <path
                d="M0 205 C 80 195, 140 225, 210 238 C 240 244, 260 270, 275 300 L 0 300 Z"
                fill="url(#sage-base)"
              />

              {/* Warm wheat/sand architectural flowing ribbon */}
              <path
                d="M 460 110 C 390 140, 310 170, 240 220 C 210 240, 190 280, 210 300 L 460 300 Z"
                fill="url(#sand-wave)"
                fillOpacity="0.88"
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
                    strokeOpacity={0.22 + t * 0.5}
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
                strokeOpacity="0.65"
              />
            </>
          )}

          {type === 'contours' && (
            <>
              {/* Warm Wheat flow for 002 */}
              <path
                d="M 0 160 C 120 180, 200 130, 320 180 C 390 210, 430 250, 460 300 L 0 300 Z"
                fill="url(#wheat-wave)"
                fillOpacity="0.9"
              />
              {Array.from({ length: 26 }).map((_, i) => {
                const t = i / 25;
                const yStart = 90 + t * 130;
                return (
                  <path
                    key={i}
                    d={`M -10 ${yStart} C ${140 + t * 40} ${110 + t * 80}, ${280 - t * 30} ${230 - t * 60}, 470 ${120 + t * 150}`}
                    fill="none"
                    stroke={i % 2 === 0 ? '#ece7dc' : '#382e20'}
                    strokeWidth={i === 12 ? '1.4' : '0.8'}
                    strokeOpacity={0.25 + t * 0.55}
                  />
                );
              })}
            </>
          )}

          {type === 'monolith' && (
            <>
              {/* Terracotta organic contours for 003 */}
              <path
                d="M 0 220 C 130 170, 260 260, 460 180 L 460 300 L 0 300 Z"
                fill="url(#terra-wave)"
                fillOpacity="0.88"
              />
              {Array.from({ length: 28 }).map((_, i) => {
                const t = i / 27;
                return (
                  <path
                    key={i}
                    d={`M -15 ${110 + t * 110} C ${160 + t * 60} ${80 + t * 140}, ${290 - t * 40} ${220 - t * 70}, 470 ${140 + t * 130}`}
                    fill="none"
                    stroke={i % 3 === 0 ? '#ece7dc' : '#e5cc9c'}
                    strokeWidth="0.75"
                    strokeOpacity={0.2 + t * 0.55}
                  />
                );
              })}
            </>
          )}

          {(type === 'neural' || type === 'topography') && (
            <>
              {/* Sage Green topography for 004 & topography */}
              <path
                d="M 0 180 C 140 230, 240 160, 360 210 C 410 230, 440 270, 460 300 L 0 300 Z"
                fill="url(#sage-base)"
                fillOpacity="0.85"
              />
              {Array.from({ length: 28 }).map((_, i) => {
                const t = i / 27;
                return (
                  <path
                    key={i}
                    d={`M -20 ${130 + t * 90} C ${120 + t * 50} ${160 - t * 40}, ${300 - t * 40} ${140 + t * 90}, 470 ${160 + t * 110}`}
                    fill="none"
                    stroke={i % 2 === 0 ? '#ece7dc' : '#1e281b'}
                    strokeWidth={i === 14 ? '1.2' : '0.75'}
                    strokeOpacity={0.22 + t * 0.55}
                  />
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Caption text in bottom-left */}
      <div className="absolute bottom-3 left-4 text-[10px] sm:text-[11px] font-sans text-[#2e362c] font-medium tracking-tight pointer-events-none drop-shadow-sm">
        {displayCaption}
      </div>
    </div>
  );
};

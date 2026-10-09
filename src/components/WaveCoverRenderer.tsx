import React, { useEffect, useState, useRef } from 'react';
import { WaveCoverConfig, BentoColorId, BENTO_PALETTE } from '../types/blog';

interface WaveCoverRendererProps {
  config: WaveCoverConfig;
  caption?: string;
  panOffset?: { x: number; y: number };
  className?: string;
  forceStatic?: boolean;
}

export const PALETTE_THEMES: Record<
  BentoColorId,
  {
    name: string;
    baseStart: string;
    baseEnd: string;
    ribbonStart: string;
    ribbonEnd: string;
    darkContour: string;
    accent: string;
  }
> = {
  sand: {
    name: 'Sand / Hvede',
    baseStart: '#e5cc9c',
    baseEnd: '#cbb389',
    ribbonStart: '#f0dfbe',
    ribbonEnd: '#8c7757',
    darkContour: '#382e20',
    accent: '#ece7dc',
  },
  terracotta: {
    name: 'Terracotta / Rosa',
    baseStart: '#c98a75',
    baseEnd: '#b57662',
    ribbonStart: '#dfa693',
    ribbonEnd: '#7a4636',
    darkContour: '#2e1a14',
    accent: '#ece7dc',
  },
  sage: {
    name: 'Salviegrøn',
    baseStart: '#98a892',
    baseEnd: '#a3b49d',
    ribbonStart: '#b2c2ad',
    ribbonEnd: '#556950',
    darkContour: '#1e281b',
    accent: '#ece7dc',
  },
  taupe: {
    name: 'Muted Taupe',
    baseStart: '#b5aaa0',
    baseEnd: '#9f9387',
    ribbonStart: '#cfc4ba',
    ribbonEnd: '#595149',
    darkContour: '#25211e',
    accent: '#ece7dc',
  },
};

export const WaveCoverRenderer: React.FC<WaveCoverRendererProps> = ({
  config,
  caption,
  panOffset = { x: 0, y: 0 },
  className = '',
  forceStatic = false,
}) => {
  const [time, setTime] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const shouldAnimate = Boolean(config.animated && !forceStatic);

  useEffect(() => {
    if (!shouldAnimate) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let start = performance.now();
    const loop = (now: number) => {
      setTime(now - start);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [shouldAnimate]);

  const palette = config.palette || 'sand';
  const theme = PALETTE_THEMES[palette] || PALETTE_THEMES.sand;
  const density = Math.min(48, Math.max(12, Math.round(config.density || 28)));
  const curvature = config.curvature || 1.1;
  const frequency = config.frequency || 1.8;
  const seed = config.seed || 42;

  // Derive unique organic harmonic offsets from seed
  const s1 = Math.sin(seed * 0.43);
  const s2 = Math.cos(seed * 0.89);
  const s3 = Math.sin(seed * 1.67);
  const s4 = Math.cos(seed * 2.31);

  // Generate lines
  const lines = Array.from({ length: density }).map((_, i) => {
    const t = i / Math.max(1, density - 1);

    const harmonic1 = Math.sin(seed * 0.5 + t * Math.PI * 1.4 * frequency);
    const harmonic2 = Math.cos(seed * 0.9 + t * Math.PI * 2.1 * frequency);
    const harmonic3 = Math.sin(seed * 1.7 + t * 3.2);
    const harmonic4 = Math.cos(seed * 2.3 + t * 2.7);

    const drift1 = shouldAnimate ? Math.sin(time * 0.0014 + t * 2.1) * (6.5 * curvature) : 0;
    const drift2 = shouldAnimate ? Math.cos(time * 0.0011 + t * 2.6) * (6.5 * curvature) : 0;

    const yStart = 100 + t * 135 + harmonic1 * 22 * curvature;
    const cp1x = 110 + (harmonic2 * 36 + t * 50) * curvature;
    const cp1y = 65 + t * 150 + harmonic3 * 28 * curvature + drift1;
    const cp2x = 270 - (harmonic1 * 32 + t * 40) * curvature;
    const cp2y = 175 + t * 110 - harmonic2 * 26 * curvature + drift2;
    const endX = 480;
    const endY = 125 + t * 165 + harmonic4 * 20 * curvature;

    const strokeColor =
      i % 3 === 0
        ? theme.accent
        : i % 2 === 0
        ? theme.darkContour
        : theme.baseStart;

    const strokeWidth =
      i === Math.floor(density * 0.48)
        ? 1.4
        : i % 4 === 0
        ? 1.0
        : 0.75;

    const strokeOpacity = Math.min(0.88, Math.max(0.18, 0.22 + t * 0.55));

    return {
      d: `M -20 ${yStart.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX} ${endY.toFixed(1)}`,
      stroke: strokeColor,
      strokeWidth,
      strokeOpacity,
    };
  });

  const needleDrift = shouldAnimate ? Math.sin(time * 0.0013) * 4 : 0;
  const needleX1 = 245 + s1 * 20;
  const needleY1 = 180 + s2 * 18 + needleDrift;
  const needleX2 = 300 + s1 * 20;
  const needleY2 = 212 + s2 * 18 + needleDrift;

  // Base terrain ribbon path
  const ribbonCp1y = 210 + s2 * 18 + (shouldAnimate ? Math.sin(time * 0.0009) * 4 : 0);
  const ribbonCp2y = 250 - s1 * 15 + (shouldAnimate ? Math.cos(time * 0.001) * 4 : 0);
  const ribbonD = `M 0 200 C 130 ${ribbonCp1y.toFixed(1)}, 270 ${ribbonCp2y.toFixed(1)}, 480 230 L 480 300 L 0 300 Z`;

  const gradIdBase = `wave-grad-base-${seed}-${palette}`;
  const gradIdRibbon = `wave-grad-ribbon-${seed}-${palette}`;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#201c18] ${className}`}
    >
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
            <linearGradient id={gradIdBase} x1="0%" y1="100%" x2="65%" y2="0%">
              <stop offset="0%" stopColor={theme.baseStart} />
              <stop offset="100%" stopColor={theme.baseEnd} />
            </linearGradient>

            <linearGradient id={gradIdRibbon} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.ribbonStart} />
              <stop offset="55%" stopColor={theme.baseStart} />
              <stop offset="100%" stopColor={theme.ribbonEnd} />
            </linearGradient>
          </defs>

          {/* Deep espresso canvas base */}
          <rect width="460" height="300" fill="#25201c" />

          {/* Flowing tactile organic terrain landform */}
          <path d={ribbonD} fill={`url(#${gradIdRibbon})`} fillOpacity="0.88" />

          {/* Secondary soft base container block */}
          <path
            d="M 0 235 C 90 220, 160 250, 230 262 C 265 268, 285 285, 300 300 L 0 300 Z"
            fill={`url(#${gradIdBase})`}
            fillOpacity="0.75"
          />

          {/* Intricate parametric topographic wave lines */}
          {lines.map((line, idx) => (
            <path
              key={idx}
              d={line.d}
              fill="none"
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.strokeOpacity}
            />
          ))}

          {/* Stylus needle line indicator */}
          <line
            x1={needleX1}
            y1={needleY1}
            x2={needleX2}
            y2={needleY2}
            stroke="#ece7dc"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.68"
          />
        </svg>
      </div>

      {caption && (
        <div className="absolute bottom-3 left-4 text-[10px] sm:text-[11px] font-sans text-[#2e362c] font-medium tracking-tight pointer-events-none drop-shadow-sm">
          {caption}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  Check,
  Layers,
  Sliders,
  Palette,
  Compass,
  ArrowRight,
  Download,
} from 'lucide-react';
import { WaveCoverConfig, BentoColorId, BENTO_PALETTE } from '../../types/blog';
import { WaveCoverRenderer, PALETTE_THEMES } from '../WaveCoverRenderer';

interface CoverWaveEngineProps {
  currentConfig?: WaveCoverConfig;
  onApplyCover: (config: WaveCoverConfig) => void;
  onClose?: () => void;
  postTitle?: string;
  hardwareNote?: string;
}

export const CoverWaveEngine: React.FC<CoverWaveEngineProps> = ({
  currentConfig,
  onApplyCover,
  onClose,
  postTitle = 'Aktuelt essay',
  hardwareNote = 'Feltnote · Taktil Balance',
}) => {
  // Local state initialized with currentConfig or harmonious defaults
  const [palette, setPalette] = useState<BentoColorId>(currentConfig?.palette || 'sage');
  const [density, setDensity] = useState<number>(currentConfig?.density || 28);
  const [curvature, setCurvature] = useState<number>(currentConfig?.curvature || 1.15);
  const [frequency, setFrequency] = useState<number>(currentConfig?.frequency || 1.85);
  const [seed, setSeed] = useState<number>(currentConfig?.seed || Math.floor(Math.random() * 9000 + 1000));
  const [animated, setAnimated] = useState<boolean>(currentConfig?.animated ?? true);
  const [justApplied, setJustApplied] = useState(false);

  // Generate new random seed for unique natural curves
  const handleGenerateNewWave = () => {
    const nextSeed = Math.floor(Math.random() * 90000 + 10000);
    setSeed(nextSeed);
  };

  const currentWaveConfig: WaveCoverConfig = {
    palette,
    density,
    curvature,
    frequency,
    seed,
    animated,
  };

  const handleApply = () => {
    onApplyCover(currentWaveConfig);
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 2400);
  };

  // Export raw SVG as file
  const handleExportSvg = () => {
    const theme = PALETTE_THEMES[palette];
    const s1 = Math.sin(seed * 0.43);
    const s2 = Math.cos(seed * 0.89);
    const ribbonCp1y = 210 + s2 * 18;
    const ribbonCp2y = 250 - s1 * 15;
    const needleX1 = 245 + s1 * 20;
    const needleY1 = 180 + s2 * 18;
    const needleX2 = 300 + s1 * 20;
    const needleY2 = 212 + s2 * 18;

    const linesSvg = Array.from({ length: density })
      .map((_, i) => {
        const t = i / Math.max(1, density - 1);
        const harmonic1 = Math.sin(seed * 0.5 + t * Math.PI * 1.4 * frequency);
        const harmonic2 = Math.cos(seed * 0.9 + t * Math.PI * 2.1 * frequency);
        const harmonic3 = Math.sin(seed * 1.7 + t * 3.2);
        const harmonic4 = Math.cos(seed * 2.3 + t * 2.7);

        const yStart = 100 + t * 135 + harmonic1 * 22 * curvature;
        const cp1x = 110 + (harmonic2 * 36 + t * 50) * curvature;
        const cp1y = 65 + t * 150 + harmonic3 * 28 * curvature;
        const cp2x = 270 - (harmonic1 * 32 + t * 40) * curvature;
        const cp2y = 175 + t * 110 - harmonic2 * 26 * curvature;
        const endX = 480;
        const endY = 125 + t * 165 + harmonic4 * 20 * curvature;

        const strokeColor =
          i % 3 === 0 ? theme.accent : i % 2 === 0 ? theme.darkContour : theme.baseStart;
        const strokeWidth = i === Math.floor(density * 0.48) ? '1.4' : i % 4 === 0 ? '1.0' : '0.75';
        const opacity = Math.min(0.88, Math.max(0.18, 0.22 + t * 0.55)).toFixed(2);

        return `<path d="M -20 ${yStart.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX} ${endY.toFixed(1)}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" />`;
      })
      .join('\n');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 460 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="base" x1="0%" y1="100%" x2="65%" y2="0%">
      <stop offset="0%" stop-color="${theme.baseStart}" />
      <stop offset="100%" stop-color="${theme.baseEnd}" />
    </linearGradient>
    <linearGradient id="ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.ribbonStart}" />
      <stop offset="55%" stop-color="${theme.baseStart}" />
      <stop offset="100%" stop-color="${theme.ribbonEnd}" />
    </linearGradient>
  </defs>
  <rect width="460" height="300" fill="#25201c" />
  <path d="M 0 200 C 130 ${ribbonCp1y.toFixed(1)}, 270 ${ribbonCp2y.toFixed(1)}, 480 230 L 480 300 L 0 300 Z" fill="url(#ribbon)" fill-opacity="0.88" />
  <path d="M 0 235 C 90 220, 160 250, 230 262 C 265 268, 285 285, 300 300 L 0 300 Z" fill="url(#base)" fill-opacity="0.75" />
  ${linesSvg}
  <line x1="${needleX1.toFixed(1)}" y1="${needleY1.toFixed(1)}" x2="${needleX2.toFixed(1)}" y2="${needleY2.toFixed(1)}" stroke="#ece7dc" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.68" />
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jever-cover-seed-${seed}-${palette}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#1e1a17] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 text-[#ece7dc]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e5cc9c]/20 border border-[#e5cc9c]/30 flex items-center justify-center text-[#e5cc9c]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#e5cc9c] uppercase tracking-wider">
              <span>Cover-maskine · Parametrisk Wave Engine</span>
              <span className="text-white/20">·</span>
              <span className="text-[#b8b1a9]/70">Seed #{seed}</span>
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-normal text-[#f5f2eb]">
              Organisk Topografisk Bølge-Generator
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Random Seed Button */}
          <button
            type="button"
            onClick={handleGenerateNewWave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25201c] hover:bg-[#2f2824] border border-white/10 text-xs text-[#ece7dc] hover:text-white transition-colors cursor-pointer"
            title="Generer nye naturlige bølgekurver med en vilkårlig seed"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#e5cc9c]" />
            <span>Ny bølge</span>
          </button>

          {/* Export SVG */}
          <button
            type="button"
            onClick={handleExportSvg}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25201c] hover:bg-[#2f2824] border border-white/10 text-xs text-[#b8b1a9] hover:text-[#ece7dc] transition-colors cursor-pointer"
            title="Download som ren vektor SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SVG</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Artwork Viewport & Right Parametric Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Artwork Canvas Viewport */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-white/10 bg-[#201c18] shadow-2xl group">
            <WaveCoverRenderer
              config={currentWaveConfig}
              caption={hardwareNote || postTitle}
              className="w-full h-full"
            />

            {/* Ambient Drift Status Indicator Pill */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#1e1a17]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono flex items-center gap-1.5 pointer-events-none">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  animated ? 'bg-[#98a892] animate-pulse' : 'bg-white/30'
                }`}
              />
              <span className="text-[#ece7dc]/90">
                {animated ? 'Ambient Drift Aktiv' : 'Statisk View'}
              </span>
            </div>

            {/* Dimension details */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#1e1a17]/70 backdrop-blur-md border border-white/5 text-[9px] font-mono text-[#b8b1a9]/70 pointer-events-none">
              460 × 300 · Parametric SVG
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#b8b1a9] px-1 font-mono">
            <span>Palette: {PALETTE_THEMES[palette].name}</span>
            <span>{density} bølgelinjer · {frequency.toFixed(2)}x frekvens</span>
          </div>
        </div>

        {/* Right: Parametric Wave Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. Preset palette picker (Sand, Terracotta, Sage, Taupe) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#e5cc9c]" />
              <span>1. Forvalgt Jordfarve-Palette</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(BENTO_PALETTE) as [BentoColorId, (typeof BENTO_PALETTE)[BentoColorId]][]).map(
                ([key, opt]) => {
                  const isSelected = palette === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPalette(key)}
                      style={{ backgroundColor: opt.bgHex, color: opt.textHex }}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer relative font-sans ${
                        isSelected
                          ? 'ring-2 ring-white shadow-lg scale-[1.03]'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="text-[11px] font-semibold leading-tight">{opt.name}</div>
                      <div className="text-[9px] font-mono opacity-70 mt-0.5">{opt.bgHex}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* 2. Wave Density Slider */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#25201c] border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[#a8a29e] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#98a892]" />
                <span>Bølgetæthed (Linjer)</span>
              </span>
              <span className="font-mono text-xs text-[#ece7dc] font-medium bg-[#1e1a17] px-2 py-0.5 rounded-md border border-white/5">
                {density} linjer
              </span>
            </div>
            <input
              type="range"
              min={14}
              max={44}
              step={1}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full accent-[#98a892] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#b8b1a9]/50 font-mono">
              <span>Minimal (14)</span>
              <span>Klassisk jever (28)</span>
              <span>Intrikat (44)</span>
            </div>
          </div>

          {/* 3. Curvature & Frequency Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Curvature */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-[#25201c] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#a8a29e] uppercase tracking-wider">
                  Kurvatur / Højde
                </span>
                <span className="font-mono text-xs text-[#ece7dc]">
                  {curvature.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.2}
                step={0.05}
                value={curvature}
                onChange={(e) => setCurvature(Number(e.target.value))}
                className="w-full accent-[#c98a75] cursor-pointer"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-[#25201c] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#a8a29e] uppercase tracking-wider">
                  Bølgefrekvens
                </span>
                <span className="font-mono text-xs text-[#ece7dc]">
                  {frequency.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min={1.0}
                max={3.4}
                step={0.1}
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-[#e5cc9c] cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Dynamic Animation Toggle (Ambient Drift Loop) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#25201c] border border-white/5">
            <div>
              <div className="text-xs font-medium text-[#f5f2eb] flex items-center gap-1.5">
                {animated ? (
                  <Play className="w-3.5 h-3.5 text-[#98a892]" />
                ) : (
                  <Pause className="w-3.5 h-3.5 text-[#b8b1a9]" />
                )}
                <span>Dynamisk Bølgedrift (Ambient Loop)</span>
              </div>
              <p className="text-[11px] text-[#b8b1a9]/70 leading-relaxed font-light">
                Kontinuerlig, dæmpet requestAnimationFrame havbølge-effekt på Bento-kortet.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAnimated(!animated)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer border ${
                animated
                  ? 'bg-[#98a892]/20 border-[#98a892]/40 text-[#98a892]'
                  : 'bg-[#1e1a17] border-white/10 text-[#b8b1a9] hover:text-[#ece7dc]'
              }`}
            >
              {animated ? 'Aktiv' : 'Pauset'}
            </button>
          </div>

          {/* 5. One-click "Anvend som coverbillede" */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleGenerateNewWave}
              className="text-xs text-[#a8a29e] hover:text-[#e5cc9c] underline underline-offset-4 cursor-pointer font-sans"
            >
              Generer en anden variation
            </button>

            <button
              type="button"
              onClick={handleApply}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-medium transition-all shadow-lg cursor-pointer ${
                justApplied
                  ? 'bg-[#98a892] text-[#1e281b]'
                  : 'bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17]'
              }`}
            >
              {justApplied ? (
                <>
                  <Check className="w-4 h-4 text-[#1e281b]" />
                  <span>Cover tilknyttet post!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1e1a17]" />
                  <span>Anvend som coverbillede</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

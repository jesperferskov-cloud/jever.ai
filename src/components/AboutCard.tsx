import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Cpu, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { TranslationStrings } from '../types/translations';

interface AboutCardProps {
  onClose?: () => void;
  onSubscribe?: (email: string) => void;
  translations?: TranslationStrings;
}

export const AboutCard: React.FC<AboutCardProps> = ({ onClose, onSubscribe, translations }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      if (onSubscribe) onSubscribe(email);
    }, 350);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-4xl bg-[#1e1a17] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden my-auto"
    >
      {/* Ambient Lighting in warm sand & terracotta (5-8% opacity) - NO neon green */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #e5cc9c 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full pointer-events-none opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #c98a75 0%, transparent 70%)' }}
      />

      {/* Floating Circular Pill Close Button (Top-Right) */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Luk"
          className="absolute top-5 sm:top-7 right-5 sm:right-7 z-30 w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#f5f2eb] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header & Status Section */}
      <div className="relative z-10 mb-8 sm:mb-10 max-w-2xl pr-12">
        {/* Status Badge: Soft pill with muted sage (#98a892) dot */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#98a892] mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#98a892] opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#98a892]" />
          </span>
          <span className="text-[#f5f2eb] font-medium font-sans">Aktiv på M4 Pro</span>
          <span className="text-white/20">·</span>
          <span className="text-[#98a892] font-sans">Lokal inferens</span>
        </div>

        {/* Main Heading: Editorial Serif font with soft curves */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] text-[#f5f2eb] font-normal tracking-tight leading-[1.15]">
          Bag om Tidsskriftet
        </h2>

        {/* Sub-meta line: Uppercase tracked sans-serif in muted terracotta accent */}
        <p className="font-sans text-xs uppercase tracking-widest text-[#c98a75] font-semibold mt-2.5">
          JESPER FERSKOV · AUTODIDAKT UDVIKLER
        </p>
      </div>

      {/* Two-Column Bento Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Left Metadata Bento Card */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-[#1c1815] border border-white/10 rounded-2xl p-5 space-y-4">
            {/* Arkitektur */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-[#b8b1a9]">
                <Cpu className="w-3.5 h-3.5 text-[#c98a75]" />
                <span>Arkitektur</span>
              </span>
              <span className="text-[#f5f2eb] font-medium font-sans">
                Apple Silicon UMA
              </span>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            {/* Privacy Princip */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-[#b8b1a9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#98a892]" />
                <span>Privacy Princip</span>
              </span>
              <span className="text-[#f5f2eb] font-medium font-sans">
                Zero-Cloud / No Trackers
              </span>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            {/* Format */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-[#b8b1a9]">
                <Sparkles className="w-3.5 h-3.5 text-[#e5cc9c]" />
                <span>Format</span>
              </span>
              <span className="text-[#f5f2eb] font-medium font-sans">
                Ren Markdown &amp; Static
              </span>
            </div>
          </div>

          {/* Tactile Mini Badge / Manifesto Note */}
          <div className="p-4 rounded-2xl bg-[#25201c] border border-white/5 flex items-start gap-3 text-xs text-[#b8b1a9] leading-relaxed">
            <span className="font-serif italic text-base text-[#e5cc9c] shrink-0 leading-none mt-0.5">
              ∿
            </span>
            <span>
              Skrevet og eksekveret on-device. Et sobert modstykke til skyens abonnementer og algoritmiske støj.
            </span>
          </div>
        </div>

        {/* Right Column: Editorial Narrative & Newsletter Container */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Editorial Body Text: Humanist sans-serif in #b8b1a9 with line-height 1.7 */}
          <div className="space-y-4 font-sans text-sm sm:text-[15px] text-[#b8b1a9] leading-[1.7] font-normal">
            <p>
              Jeg byggede <span className="font-serif italic text-[#e5cc9c] font-medium">jever</span> som en modvægt til nutidens overstimulerede internet. Dette er et personligt digitalt værksted, hvor nysgerrigheden over for lokal kunstig intelligens og æstetisk softwarearkitektur kan folde sig ud i ro.
            </p>

            <p>
              Efter mange år med cloud-baserede services, abonnementer og uigennemskuelige dataindsamlinger har jeg valgt at trække stikket til skyen. Hvert eneste ord, hver modelkørsel og hver linje kode på denne side er skabt til at kunne eksistere 100% uafhængigt på min egen maskine.
            </p>

            <p>
              Her finder du ingen pop-ups, ingen cookie-advarsler og ingen overvågning. Kun håndskrevne essays om hardwarens grænser, modelkvantisering og kunsten at tænke i takt med maskinens rytme.
            </p>
          </div>

          {/* Newsletter Box: Zero-Cloud Notifikationer */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#25201c] border border-white/10 mt-1">
            <div className="mb-4">
              <span className="text-xs uppercase font-sans tracking-widest text-[#f5f2eb] font-semibold block">
                ZERO-CLOUD NOTIFIKATIONER
              </span>
              <span className="text-xs text-[#b8b1a9] leading-relaxed mt-1 block">
                Modtag et diskret brev, når et nyt essay publiceres. Gemmes lokalt i{' '}
                <code className="font-mono text-[#c98a75] px-1 py-0.5 rounded bg-white/5 text-[11px]">
                  subscribers.json
                </code>{' '}
                uden tredjepart.
              </span>
            </div>

            {subscribed ? (
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#98a892]/15 border border-[#98a892]/30 text-xs text-[#98a892]">
                <Check className="w-4 h-4 shrink-0" />
                <span>Du er tilmeldt den lokale notifikationsliste. Tak for din tillid.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din.adresse@proton.me"
                    required
                    className="w-full rounded-full bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-[#f5f2eb] placeholder:text-white/30 focus:border-[#e5cc9c] focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#ece7dc] hover:bg-[#f5f2eb] text-[#1e1a17] font-medium text-sm px-6 py-2.5 transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-70"
                >
                  {loading ? 'Gemmer...' : 'Tilmeld lokalt'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


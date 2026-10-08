import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { Mail, Check, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

interface AboutCardProps {
  onSubscribe?: (email: string) => void;
}

export const AboutCard: React.FC<AboutCardProps> = ({ onSubscribe }) => {
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
    }, 400);
  };

  // Framer Motion Variants for the "Zen Reveal" entrance animation
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 32,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // Apple-style smooth decelerating curve
        when: 'beforeChildren',
        staggerChildren: 0.14,
      },
    },
  };

  const bioItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 14,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="om-bloggen" className="w-full py-16 scroll-mt-24">
      {/* Zen Reveal Animated Card Frame */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative w-full rounded-3xl bg-[#1a1816] border border-[#2d2925] p-8 md:p-12 overflow-hidden shadow-2xl"
      >
        {/* Ambient Halo Glow */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8fa38d 0%, #10b981 40%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #c26d48 0%, transparent 70%)' }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Author Badge & Hardware Status */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Pulsing Emerald Dot */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#141211] border border-white/10 text-xs font-mono text-[#a8a29e] mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
                </span>
                <span className="text-[#f5f2eb]">Aktiv på M4 Pro</span>
                <span className="text-[#a8a29e]/50">·</span>
                <span className="text-[#8fa38d]">Lokal inferens</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-[#f5f2eb] font-normal tracking-tight leading-tight">
                Bag om Tidsskriftet
              </h2>
              <p className="font-mono text-xs uppercase tracking-widest text-[#c26d48] mt-2">
                Jesper Ferskov · Autodidakt Udvikler
              </p>
            </div>

            {/* Spec Box */}
            <div className="p-4 rounded-2xl bg-[#141211]/90 border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#a8a29e]">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#c26d48]" />
                  Arkitektur
                </span>
                <span className="font-mono text-[#f5f2eb]">Apple Silicon UMA</span>
              </div>
              <div className="flex items-center justify-between text-[#a8a29e]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8fa38d]" />
                  Privacy Princip
                </span>
                <span className="font-mono text-[#f5f2eb]">Zero-Cloud / No Trackers</span>
              </div>
              <div className="flex items-center justify-between text-[#a8a29e]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e6dfd5]" />
                  Format
                </span>
                <span className="font-mono text-[#f5f2eb]">Ren Markdown & Static</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mask-revealed Staggered Bio Prose */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 lg:border-l lg:border-[#2d2925] lg:pl-10">
            <div className="space-y-4">
              <motion.p
                variants={bioItemVariants}
                className="text-base sm:text-lg text-[#f5f2eb] leading-relaxed font-light"
              >
                Jeg byggede <span className="font-serif italic text-[#c26d48]">jever</span> som en modvægt til nutidens overstimulerede internet. Dette er et personligt digitalt værksted, hvor nysgerrigheden over for lokal kunstig intelligens og æstetisk softwarearkitektur kan folde sig ud i ro.
              </motion.p>

              <motion.p
                variants={bioItemVariants}
                className="text-sm sm:text-base text-[#a8a29e] leading-relaxed"
              >
                Efter mange år med cloud-baserede services, abonnementer og uigennemskuelige dataindsamlinger har jeg valgt at trække stikket til skyen. Hvert eneste ord, hver modelkørsel og hver linje kode på denne side er skabt til at kunne eksistere 100% uafhængigt på min egen maskine.
              </motion.p>

              <motion.p
                variants={bioItemVariants}
                className="text-sm sm:text-base text-[#a8a29e] leading-relaxed"
              >
                Her finder du ingen pop-ups, ingen cookie-advarsler og ingen overvågning. Kun håndskrevne essays om hardwarens grænser, modelkvantisering og kunsten at tænke i takt med maskinens rytme.
              </motion.p>
            </div>

            {/* Zero-Cloud Newsletter Subscription Module */}
            <motion.div
              variants={bioItemVariants}
              className="pt-4 border-t border-[#2d2925]"
            >
              <div className="mb-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#f5f2eb] block">
                  Zero-Cloud Notifikationer
                </span>
                <span className="text-xs text-[#a8a29e]">
                  Modtag et diskret brev, når et nyt essay publiceres. Gemmes lokalt i <code className="font-mono text-[#c26d48]">subscribers.json</code> uden tredjepart.
                </span>
              </div>

              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-xs text-[#10b981]">
                  <Check className="w-4 h-4" />
                  <span>Du er tilmeldt den lokale notifikationsliste. Tak for din tillid.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din.adresse@proton.me"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/50 focus:outline-none focus:border-[#c26d48] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-[#24211e] hover:bg-[#2d2925] border border-white/10 hover:border-[#c26d48]/40 text-xs font-medium text-[#f5f2eb] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {loading ? 'Gemmer...' : 'Tilmeld lokalt'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

import React from 'react';

interface HeroIdentityProps {
  onExplore: () => void;
}

export const HeroIdentity: React.FC<HeroIdentityProps> = ({ onExplore }) => {
  return (
    <div className="flex flex-col justify-center h-full max-w-xl pr-0 lg:pr-8 select-none py-4 sm:py-8">
      {/* Label above headline: Clean line with small monogram/icon: "BLOG & TANKER" with a subtle horizontal rule */}
      <div className="flex items-center gap-4 mb-8 sm:mb-12">
        <span className="text-[11px] font-mono tracking-widest text-[#a69e96] uppercase font-semibold">
          BLOG &amp; TANKER
        </span>
        <div className="h-[1px] flex-1 bg-white/10" />
        <span className="font-serif italic text-lg text-[#a69e96]/80 leading-none">
          ∿
        </span>
      </div>

      {/* Main headline:
          "Tanker,
          perspektiver og
          historier der
          ræsonnerer."
      */}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] text-[#ece7dc] font-normal leading-[1.08] tracking-tight mb-6 sm:mb-8">
        Tanker,<br />
        perspektiver og<br />
        historier der<br />
        ræsonnerer.
      </h1>

      {/* Intro paragraph:
          "Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær."
      */}
      <p className="text-base sm:text-lg text-[#b8b1a9] leading-relaxed mb-8 sm:mb-12 font-light max-w-md">
        Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær.
      </p>

      {/* Action button group:
          - Primary button: "Udforsk indlæg" (rounded-full, warm eggshell background #ece7dc, dark text #1e1a17)
          - Secondary icon button: Small circular button next to it with subtle outline and delicate organic glyph
      */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExplore}
          className="px-8 py-3.5 rounded-full bg-[#ece7dc] hover:bg-[#e0dad0] text-[#1e1a17] font-sans text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Udforsk indlæg
        </button>

        <button
          onClick={onExplore}
          aria-label="Udforsk"
          className="w-12 h-12 rounded-full border border-white/15 bg-[#25201c]/80 hover:bg-[#2e2722] text-[#ece7dc] flex items-center justify-center transition-all cursor-pointer shadow-sm"
        >
          <span className="font-serif italic text-lg leading-none">∿</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { SiteSettings } from '../types/blog';
import { TranslationStrings } from '../types/translations';

interface HeroIdentityProps {
  onExplore: () => void;
  siteSettings?: SiteSettings;
  translations?: TranslationStrings;
}

export const HeroIdentity: React.FC<HeroIdentityProps> = ({
  onExplore,
  siteSettings,
  translations,
}) => {
  // If translations provided and siteSettings has default values, respect language selection
  const isDefaultLabel = !siteSettings?.heroLabel || siteSettings.heroLabel === 'BLOG & TANKER';
  const label = isDefaultLabel && translations ? translations.hero.label : (siteSettings?.heroLabel || 'BLOG & TANKER');

  const isDefaultTitle = !siteSettings?.heroTitle || siteSettings.heroTitle.startsWith('Tanker,\nperspektiver');
  const rawTitle = isDefaultTitle && translations ? translations.hero.title : (siteSettings?.heroTitle || 'Tanker,\nperspektiver og\nhistorier der\nræsonnerer.');

  const isDefaultExcerpt = !siteSettings?.heroExcerpt || siteSettings.heroExcerpt.startsWith('Velkommen til jever');
  const excerpt = isDefaultExcerpt && translations ? translations.hero.excerpt : (siteSettings?.heroExcerpt || 'Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær.');

  const isDefaultCta = !siteSettings?.heroCtaText || siteSettings.heroCtaText === 'Udforsk indlæg';
  const ctaText = isDefaultCta && translations ? translations.hero.cta : (siteSettings?.heroCtaText || 'Udforsk indlæg');

  const titleLines = rawTitle.split('\n');

  return (
    <div className="flex flex-col justify-center h-full max-w-xl pr-0 lg:pr-8 select-none pt-2 sm:pt-4 pb-4 sm:pb-8">
      {/* Label above headline: Clean line with small monogram/icon: "BLOG & TANKER" with a subtle horizontal rule */}
      <div className="flex items-center gap-4 mb-8 sm:mb-12">
        <span className="text-[11px] font-mono tracking-widest text-[#a69e96] uppercase font-semibold">
          {label}
        </span>
        <div className="h-[1px] flex-1 bg-white/10" />
        <span className="font-serif italic text-lg text-[#a69e96]/80 leading-none">
          ∿
        </span>
      </div>

      {/* Main headline */}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] text-[#ece7dc] font-normal leading-[1.08] tracking-tight mb-6 sm:mb-8 text-balance">
        {titleLines.map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < titleLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>

      {/* Intro paragraph */}
      <p className="text-base sm:text-lg text-[#b8b1a9] leading-relaxed mb-8 sm:mb-12 font-light max-w-md">
        {excerpt}
      </p>

      {/* Action button group */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExplore}
          className="px-8 py-3.5 rounded-full bg-[#ece7dc] hover:bg-[#e0dad0] text-[#1e1a17] font-sans text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cc9c]"
        >
          {ctaText}
        </button>

        <button
          onClick={onExplore}
          aria-label={ctaText}
          className="w-12 h-12 rounded-full border border-white/15 bg-[#25201c]/80 hover:bg-[#2e2722] text-[#ece7dc] flex items-center justify-center transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5cc9c]"
        >
          <span className="font-serif italic text-lg leading-none">∿</span>
        </button>
      </div>
    </div>
  );
};

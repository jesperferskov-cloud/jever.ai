import React from 'react';
import { Search } from 'lucide-react';
import { ArchitecturalBrandMark } from './ArchitecturalBrandMark';
import { AmbientNotificationPill } from './AmbientNotificationPill';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BlogPost } from '../types/blog';
import { Language, TranslationStrings } from '../types/translations';

interface HeaderProps {
  onSelectNav: (navItem: 'historier' | 'om') => void;
  activeNav: string;
  onOpenSearch: () => void;
  latestPost: BlogPost | null;
  onOpenPost: (post: BlogPost) => void;
  language: Language;
  onToggleLanguage: () => void;
  translations: TranslationStrings;
  activeAccentColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectNav,
  activeNav,
  onOpenSearch,
  latestPost,
  onOpenPost,
  language,
  onToggleLanguage,
  translations,
  activeAccentColor,
}) => {
  const navItems = [
    { id: 'historier' as const, label: translations.nav.stories },
    { id: 'om' as const, label: translations.nav.about },
  ];

  return (
    <header className="w-full flex items-center justify-between pt-2 sm:pt-4 pb-2 mb-8 sm:mb-10 lg:mb-12 select-none gap-4">
      {/* 
        1. Top-Left Pure Wordmark:
        Rests directly on the main canvas (#1e1a17) with zero container borders or fills.
        Flush with standard grid / hero column alignment.
      */}
      <div className="flex items-center shrink-0">
        <ArchitecturalBrandMark
          onSelectNav={() => onSelectNav('historier')}
          activeAccentColor={activeAccentColor}
        />
      </div>

      {/* 
        2. Center Navigation Capsule:
        Translucent dark espresso capsule housing "Historier", "Om", and the Globe toggle.
        Horizontally aligned with the vertical center of the "jever" wordmark.
      */}
      <nav
        aria-label="Hovednavigation"
        className="hidden md:flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full bg-[#25201c]/80 border border-white/10 backdrop-blur-md shadow-xs"
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              className={`px-4 sm:px-5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5cc9c]/50 ${
                isActive
                  ? 'bg-[#3b332d] text-[#ece7dc] font-medium shadow-xs'
                  : 'text-[#a69e96] hover:text-[#ece7dc]'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {/* Subtle hairline divider */}
        <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" aria-hidden="true" />

        {/* Globe icon language toggle embedded directly into center pill */}
        <LanguageSwitcher
          language={language}
          onToggle={onToggleLanguage}
          variant="inline"
        />
      </nav>

      {/* 
        3. Right-Hand Controls:
        Horizontally aligned with the vertical center of the "jever" wordmark.
      */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-end">
        {/* Ambient Notification Pill (Expanded story teaser on hover, pulse sage dot) */}
        {latestPost && (
          <div className="hidden sm:block">
            <AmbientNotificationPill
              latestPost={latestPost}
              onOpenPost={onOpenPost}
              language={language}
            />
          </div>
        )}

        {/* Standalone Globe switcher visible only on mobile when center pill is hidden */}
        <div className="md:hidden">
          <LanguageSwitcher
            language={language}
            onToggle={onToggleLanguage}
            variant="pill"
          />
        </div>

        {/* Reader Search Trigger with Cmd+K pill */}
        <button
          onClick={onOpenSearch}
          aria-label={`${translations.nav.search} i jever (Cmd+K)`}
          title={`${translations.nav.search} (Cmd+K / Ctrl+K)`}
          className="flex items-center gap-2 h-8.5 sm:h-9 px-3 sm:px-3.5 rounded-full bg-[#25201c]/80 hover:bg-[#2c241f] border border-white/10 hover:border-white/20 text-[#a69e96] hover:text-[#ece7dc] backdrop-blur-md transition-all duration-200 shadow-xs cursor-pointer group shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5cc9c]/50"
        >
          <Search className="w-3.5 h-3.5 text-[#a69e96] group-hover:text-[#ece7dc] transition-colors" />
          <span className="text-xs font-sans hidden sm:inline">
            {translations.nav.search}
          </span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#a69e96]/80 group-hover:text-[#ece7dc]">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
};

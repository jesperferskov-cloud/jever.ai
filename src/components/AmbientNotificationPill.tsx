import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { Language } from '../types/translations';

interface AmbientNotificationPillProps {
  latestPost: BlogPost | null;
  onOpenPost: (post: BlogPost) => void;
  language: Language;
}

/**
 * AmbientNotificationPill:
 * Relocates notification to the top header axis, aligned horizontally with center nav and search.
 * Compact Ambient State:
 *  - Small, discrete frosted espresso capsule with soft sage (#98a892) pulsing dot + "001 Nyt" badge.
 * Hover & Expand Behavior:
 *  - On hover, expands fluidly to reveal post title and subtle arrow →.
 *  - Minimal dismiss button (×) that dismisses notification and stores in localStorage.
 */
export const AmbientNotificationPill: React.FC<AmbientNotificationPillProps> = ({
  latestPost,
  onOpenPost,
  language,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!latestPost) {
      setIsDismissed(true);
      return;
    }
    const storageKey = `jever_dismissed_notification_${latestPost.id}`;
    const dismissed = localStorage.getItem(storageKey);
    setIsDismissed(dismissed === 'true');
  }, [latestPost]);

  if (!latestPost || isDismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (latestPost) {
      localStorage.setItem(`jever_dismissed_notification_${latestPost.id}`, 'true');
    }
    setIsDismissed(true);
  };

  const handleOpen = () => {
    if (latestPost) {
      onOpenPost(latestPost);
    }
  };

  const badgeText = `${latestPost.number} ${language === 'da' ? 'Nyt' : 'New'}`;
  const dismissTooltip = language === 'da' ? 'Luk notifikation' : 'Dismiss notification';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={`${badgeText}: ${latestPost.title}`}
      title={latestPost.title}
      className={`group relative flex items-center h-8.5 rounded-full bg-[#25201c]/85 hover:bg-[#2c241f] border border-white/10 hover:border-[#98a892]/40 backdrop-blur-md transition-all duration-300 ease-out shadow-xs cursor-pointer select-none overflow-hidden shrink-0 ${
        isHovered
          ? 'pl-3 pr-2 max-w-[90vw] sm:max-w-md'
          : 'px-3 max-w-[125px]'
      }`}
    >
      {/* 1. Soft Sage Dot with subtle pulse animation */}
      <span className="relative flex h-2 w-2 shrink-0 mr-2" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#98a892] opacity-50" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#98a892]" />
      </span>

      {/* 2. Badge Number & Label (001 Nyt / 001 New) */}
      <span className="font-mono text-[11px] font-semibold tracking-wider text-[#ece7dc] whitespace-nowrap shrink-0">
        {badgeText}
      </span>

      {/* 3. Fluid Reveal: Title, Arrow & Close Button on Hover */}
      <div
        className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${
          isHovered
            ? 'opacity-100 max-w-[280px] sm:max-w-xs ml-2 gap-2'
            : 'opacity-0 max-w-0 ml-0 gap-0 pointer-events-none'
        }`}
      >
        <span className="text-white/20 select-none shrink-0" aria-hidden="true">
          ·
        </span>

        {/* Post Title */}
        <span className="text-xs font-sans text-[#ece7dc] hover:text-[#f5f2eb] truncate max-w-[160px] sm:max-w-[220px]">
          {latestPost.title}
        </span>

        {/* Subtle Arrow Indicator */}
        <ArrowRight
          className="w-3.5 h-3.5 text-[#98a892] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />

        {/* Minimal Close Button (Dismiss & save to localStorage) */}
        <button
          onClick={handleDismiss}
          aria-label={dismissTooltip}
          title={dismissTooltip}
          className="p-1 rounded-full text-[#a69e96] hover:text-[#f5f2eb] hover:bg-white/10 transition-colors shrink-0 ml-0.5 cursor-pointer focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

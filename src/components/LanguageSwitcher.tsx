import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types/translations';

interface LanguageSwitcherProps {
  language: Language;
  onToggle: () => void;
  variant?: 'pill' | 'inline';
}

/**
 * Global Language Switcher with discrete Globe icon.
 * Can be rendered standalone as a pill or embedded directly into the central navigation capsule.
 * Toggles between "DA" and "EN".
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onToggle,
  variant = 'pill',
}) => {
  const isDanish = language === 'da';
  const label = isDanish ? 'Skift sprog til engelsk' : 'Switch language to Danish';

  if (variant === 'inline') {
    return (
      <button
        onClick={onToggle}
        aria-label={label}
        title={label}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans text-[#a69e96] hover:text-[#ece7dc] hover:bg-white/5 transition-all duration-200 cursor-pointer group shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5cc9c]/50"
      >
        <Globe className="w-3.5 h-3.5 text-[#a69e96] group-hover:text-[#ece7dc] transition-colors" />
        <span className="font-mono text-[11px] font-semibold tracking-wider text-[#ece7dc]/90">
          {language.toUpperCase()}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="flex items-center gap-1.5 h-8.5 px-3 rounded-full bg-[#25201c]/80 hover:bg-[#2c241f] border border-white/10 hover:border-white/20 text-[#a69e96] hover:text-[#ece7dc] backdrop-blur-md transition-all duration-200 shadow-xs cursor-pointer group shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5cc9c]/50"
    >
      <Globe className="w-3.5 h-3.5 text-[#a69e96] group-hover:text-[#ece7dc] transition-colors" />
      <span className="font-mono text-[11px] font-semibold tracking-wider text-[#ece7dc]/90">
        {language.toUpperCase()}
      </span>
    </button>
  );
};

import React from 'react';
import { SiteSettings } from '../types/blog';
import { TranslationStrings } from '../types/translations';

interface FooterProps {
  onOpenGhostAdmin: () => void;
  siteSettings?: SiteSettings;
  translations?: TranslationStrings;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGhostAdmin,
  siteSettings,
  translations,
}) => {
  const copyright = siteSettings?.footerCopyright || '© 2026 jever';
  const cleanCopyright = copyright.endsWith('.') ? copyright.slice(0, -1) : copyright;
  const isDefaultRights = !siteSettings?.footerRights || siteSettings.footerRights === 'Alle rettigheder forbeholdes';
  const rights = isDefaultRights && translations ? translations.footer.rights : (siteSettings?.footerRights || 'Alle rettigheder forbeholdes');
  const tagline = siteSettings?.footerTagline || 'ON-DEVICE · PRIVACY FIRST';

  return (
    <footer className="w-full pt-8 pb-2 flex items-center justify-between text-xs text-[#a69e96]/70 select-none">
      <div className="flex items-center">
        <span>{cleanCopyright}</span>
        {/* Stealth Ghost Admin Trigger on the period */}
        <button
          onClick={onOpenGhostAdmin}
          tabIndex={-1}
          aria-label="Admin gateway"
          title="."
          className="cursor-default select-none focus:outline-none p-0 m-0 border-none bg-transparent text-inherit hover:text-inherit"
        >
          .
        </button>
        <span className="ml-2 hidden sm:inline text-[#a69e96]/40">
          {rights}
        </span>
      </div>

      <div className="font-mono text-[11px] text-[#a69e96]/40 tracking-wider">
        {tagline}
      </div>
    </footer>
  );
};

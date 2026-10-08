import React from 'react';

interface HeaderProps {
  onSelectNav: (navItem: 'historier' | 'indsigt' | 'kategorier' | 'om') => void;
  activeNav: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectNav,
  activeNav,
}) => {
  const navItems = [
    { id: 'historier', label: 'Historier' },
    { id: 'indsigt', label: 'Indsigt' },
    { id: 'kategorier', label: 'Kategorier' },
    { id: 'om', label: 'Om os' },
  ] as const;

  return (
    <header className="w-full flex items-center justify-between pt-2 pb-6 sm:pb-8 select-none">
      {/* Top Left: Pill badge "jever" with off-white/cream background (#f0ece1) and dark text (#1e1a17) */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="px-7 py-2.5 rounded-full bg-[#f0ece1] hover:bg-[#e6e1d5] text-[#1e1a17] font-serif text-[22px] tracking-tight font-medium transition-colors shadow-sm flex items-center justify-center cursor-pointer"
      >
        jever
      </a>

      {/* Center navigation pill: Translucent dark taupe capsule containing ["Historier", "Indsigt", "Kategorier", "Om os"] */}
      <nav className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-[#2a2420]/80 border border-white/5 backdrop-blur-md shadow-md">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#3b332d] text-[#ece7dc] font-medium shadow-sm'
                  : 'text-[#a69e96] hover:text-[#ece7dc]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Top right: Clean empty spacer or ghost space matching reference */}
      <div className="w-[88px] hidden sm:block" />
    </header>
  );
};

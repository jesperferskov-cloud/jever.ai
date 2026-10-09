import React from 'react';

interface ArchitecturalBrandMarkProps {
  onSelectNav?: () => void;
  activeAccentColor?: string;
}

/**
 * Editorial Wordmark: "jever"
 * 
 * - Stripped of tab/notch geometry; rests directly on canvas (#1e1a17).
 * - Big, bold editorial serif ("Fraunces" / "Playfair Display", 700 bold, text-3xl / 32px–36px).
 * - Soft bone white / ivory (#f5f2eb) for literary sophistication.
 * - Interactive detail: on hover, the dot over the "j" and a delicate 1px underline
 *   subtly glow in the currently active Bento accent color (Sand #e5cc9c / Terracotta #c98a75 / Sage #98a892).
 * - Tactile active press feedback (active:scale-98).
 */
export const ArchitecturalBrandMark: React.FC<ArchitecturalBrandMarkProps> = ({
  onSelectNav,
  activeAccentColor = '#c98a75',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onSelectNav?.();
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      aria-label="jever — gå til forsiden"
      title="jever — forside & essays"
      className="group relative inline-flex items-center select-none py-0.5 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5cc9c]/50 rounded-sm"
    >
      <span className="relative font-serif font-bold text-[32px] sm:text-[35px] lg:text-[36px] tracking-tight text-[#f5f2eb] leading-none transition-transform duration-150 active:scale-98 inline-block">
        {/* Letter 'j' with glowing accent dot on hover */}
        <span className="relative inline-block">
          j
          {/* Subtle glowing tittle dot in active Bento accent color on hover */}
          <span
            className="absolute top-[2px] sm:top-[2.5px] left-[5px] sm:left-[5.5px] w-[5.5px] h-[5.5px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
            style={{
              backgroundColor: activeAccentColor,
              boxShadow: `0 0 8px 1px ${activeAccentColor}`,
            }}
            aria-hidden="true"
          />
        </span>
        ever

        {/* Delicate 1px underline that smoothly expands in active Bento accent color on hover */}
        <span
          className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"
          style={{
            backgroundColor: activeAccentColor,
            boxShadow: `0 0 6px ${activeAccentColor}80`,
          }}
          aria-hidden="true"
        />
      </span>
    </a>
  );
};

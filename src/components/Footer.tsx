import React from 'react';

interface FooterProps {
  onOpenGhostAdmin: () => void;
  onOpenManifest?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGhostAdmin,
  onOpenManifest,
}) => {
  return (
    <footer className="w-full pt-8 pb-4 mt-6 border-t border-white/5 text-xs text-[#8e8880] select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subtle Copyright with Stealth Dot / Copyright Trigger */}
        <div className="flex items-center text-[#8e8880]">
          {/* Clicking © or the dot triggers Ghost Admin quietly */}
          <button
            onClick={onOpenGhostAdmin}
            tabIndex={-1}
            aria-hidden="true"
            className="cursor-default select-none focus:outline-none p-0 m-0 border-none bg-transparent text-inherit hover:text-inherit"
          >
            ©
          </button>
          <span className="mx-1">2026 jever</span>
          <button
            onClick={onOpenGhostAdmin}
            tabIndex={-1}
            aria-hidden="true"
            className="cursor-default select-none focus:outline-none p-0 m-0 border-none bg-transparent text-inherit hover:text-inherit"
          >
            .
          </button>
          <span className="text-[#8e8880]/50 ml-2 hidden sm:inline">
            Alle rettigheder forbeholdes
          </span>
        </div>

        {/* Minimal Colophon & Manifest Link */}
        <div className="flex items-center gap-5 text-[11px] text-[#8e8880]">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8e8880]/70">
            ON-DEVICE · ZERO-CLOUD
          </span>
          <span className="text-white/10">·</span>
          <button
            onClick={onOpenManifest}
            className="hover:text-[#edeae2] transition-colors cursor-pointer"
          >
            Manifest
          </button>
          <span className="text-white/10">·</span>
          <span className="hover:text-[#edeae2] cursor-pointer">
            RSS
          </span>
        </div>
      </div>
    </footer>
  );
};

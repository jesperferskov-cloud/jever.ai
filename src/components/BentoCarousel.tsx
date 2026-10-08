import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { VectorArtwork } from './VectorArtwork';

interface BentoCarouselProps {
  posts: BlogPost[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenPost: (post: BlogPost) => void;
}

export const BentoCarousel: React.FC<BentoCarouselProps> = ({
  posts,
  activeIndex,
  onActiveIndexChange,
  onOpenPost,
}) => {
  return (
    <div className="w-full flex flex-col select-none">
      {/* Desktop & Tablet Bento Cards Accordion (1:1 with mockup) */}
      <div className="hidden md:flex items-stretch gap-3 h-[520px] w-full">
        {posts.map((post, idx) => {
          const isActive = idx === activeIndex;

          return (
            <motion.div
              key={post.id}
              layout
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 30,
              }}
              onClick={() => {
                if (!isActive) {
                  onActiveIndexChange(idx);
                }
              }}
              className={`relative rounded-[26px] transition-all duration-300 overflow-hidden flex flex-col ${
                isActive
                  ? 'flex-[5] min-w-[340px] max-w-[420px] bg-[#25201c] border border-white/5 shadow-2xl cursor-pointer'
                  : 'flex-initial w-[66px] hover:w-[72px] cursor-pointer shadow-md'
              }`}
              style={{
                backgroundColor: isActive ? '#25201c' : post.panelColor,
              }}
            >
              {isActive ? (
                /* ACTIVE EXPANDED BENTO CARD (1:1 with mockup Card 001) */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => onOpenPost(post)}
                  className="flex flex-col h-full justify-between p-6 sm:p-7 relative z-10"
                >
                  {/* Top content */}
                  <div>
                    {/* Badge "001" in subtle pill at top right */}
                    <div className="flex justify-end mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#342e2a] text-[#d6d0c7] text-xs font-mono font-medium">
                        {post.number}
                      </span>
                    </div>

                    {/* Title: "Kunsten at finde ro i en digital tidsalder" (Serif font) */}
                    <h2 className="font-serif text-2xl sm:text-[30px] text-[#ece7dc] font-normal leading-[1.2] tracking-tight mb-3 text-balance">
                      {post.title}
                    </h2>

                    {/* Description: "Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær." */}
                    <p className="text-[13px] sm:text-sm text-[#b8b1a9] leading-relaxed font-light mb-5">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Artwork area: Organic topographic/wave vector illustration with soft sage-green base */}
                  <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-white/5 bg-[#201c18] shadow-inner mb-4">
                    <VectorArtwork caption={post.hardware} />
                  </div>

                  {/* Bottom Horizontal Pagination: 4 small circular dots (first active/white, rest dim) */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {posts.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActiveIndexChange(dotIdx);
                        }}
                        aria-label={`Gå til kort ${dotIdx + 1}`}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                          dotIdx === activeIndex
                            ? 'bg-[#ece7dc] scale-125'
                            : 'bg-white/25 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* INACTIVE BENTO STRIP (Matching exact mockup colors, pills, rotated titles, chevrons) */
                <div
                  className="h-full w-full py-5 px-1 flex flex-col justify-between items-center relative z-10"
                  style={{ color: post.panelTextColor }}
                >
                  {/* Top number pill (e.g. 002, 003, 004) */}
                  <div className="px-2.5 py-0.5 rounded-full bg-black/10 border border-black/10 text-[11px] font-mono font-semibold tracking-wide">
                    {post.number}
                  </div>

                  {/* Vertical Card Titles: Uppercase rotated text (writing-mode: vertical-rl) */}
                  <div className="h-[340px] flex items-center justify-center overflow-hidden my-auto">
                    <span
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      className="text-xs font-sans font-semibold tracking-wider uppercase whitespace-nowrap opacity-90 hover:opacity-100 transition-opacity"
                    >
                      {post.verticalLabel}
                    </span>
                  </div>

                  {/* Subtle down-chevron icon centered at the bottom of each vertical collapsed strip */}
                  <div className="w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Horizontal Snap-Scroll Accordion */}
      <div className="flex md:hidden flex-col gap-4 pt-2">
        <div className="flex overflow-x-auto gap-3.5 pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenPost(post)}
              className="min-w-[85vw] snap-center bg-[#25201c] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-[#a69e96]">
                  <span className="font-mono text-[#ece7dc] font-semibold">{post.number}</span>
                  <span>{post.readingTime}</span>
                </div>
                <div className="pt-3.5">
                  <h3 className="font-serif text-2xl text-[#ece7dc] font-normal mt-1 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#b8b1a9] line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-40 rounded-xl overflow-hidden bg-[#201c18] border border-white/5 relative">
                <VectorArtwork caption={post.hardware} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

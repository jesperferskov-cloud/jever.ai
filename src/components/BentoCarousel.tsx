import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { VectorArtwork } from './VectorArtwork';

interface BentoCarouselProps {
  posts: BlogPost[];
  activePostId: string;
  onActivePostIdChange: (id: string) => void;
  onOpenPost: (post: BlogPost) => void;
  isModalOpen?: boolean;
}

export const BentoCarousel: React.FC<BentoCarouselProps> = ({
  posts,
  activePostId,
  onActivePostIdChange,
  onOpenPost,
  isModalOpen = false,
}) => {
  const [hoveredStripId, setHoveredStripId] = useState<string | null>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const lastWheelTime = useRef(0);

  // Determine current active post index
  const activeIndex = posts.findIndex((p) => p.id === activePostId);
  const currentActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const activePost = posts[currentActiveIndex] || posts[0];

  const isFirstPost = currentActiveIndex === 0;
  const isLastPost = currentActiveIndex === posts.length - 1;

  // Discrete arrow navigation handlers
  const handlePrev = useCallback(() => {
    if (currentActiveIndex > 0) {
      onActivePostIdChange(posts[currentActiveIndex - 1].id);
    }
  }, [currentActiveIndex, posts, onActivePostIdChange]);

  const handleNext = useCallback(() => {
    if (currentActiveIndex < posts.length - 1) {
      onActivePostIdChange(posts[currentActiveIndex + 1].id);
    }
  }, [currentActiveIndex, posts, onActivePostIdChange]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    if (isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isModalOpen]);

  // Horizontal trackpad swipe handling with throttle
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 28 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const now = Date.now();
      if (now - lastWheelTime.current > 380) {
        lastWheelTime.current = now;
        if (e.deltaX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  // 3D Tilt calculation & Parallax Wave Pan (max 4 degrees tilt, 2-4px opposite pan)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeCardRef.current) return;
    const rect = activeCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5; // -0.5 to 0.5
    const yPct = y / rect.height - 0.5; // -0.5 to 0.5

    // Restrained 3D tilt: max 4 degrees
    const maxTilt = 4;
    const rotateX = -yPct * (maxTilt * 2);
    const rotateY = xPct * (maxTilt * 2);
    setTilt({ rotateX, rotateY });

    // Parallax wave pan: 2-4px in OPPOSITE direction of cursor
    const maxPan = 3.5;
    const panX = -xPct * (maxPan * 2);
    const panY = -yPct * (maxPan * 2);
    setPan({ x: panX, y: panY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      onWheel={handleWheel}
      className="w-full flex flex-col select-none relative focus:outline-none"
      tabIndex={0}
      aria-label="Bento artikeloversigt karrusel"
    >
      {/* DESKTOP & TABLET: Tactile Spring Accordion */}
      <div className="hidden md:flex items-stretch gap-3.5 h-[530px] w-full justify-start">
        {posts.map((post) => {
          const isActive = post.id === activePost.id;
          const isHovered = hoveredStripId === post.id;

          // Palette accent fallback
          const accentColor = post.panelColor || post.themeAccent || '#e5cc9c';

          return (
            <motion.div
              key={post.id}
              layout
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 26,
              }}
              animate={{
                width: isActive ? 410 : isHovered ? 78 : 68,
              }}
              onMouseEnter={() => {
                if (!isActive) setHoveredStripId(post.id);
              }}
              onMouseLeave={() => {
                if (!isActive) setHoveredStripId(null);
              }}
              onClick={() => {
                if (!isActive) {
                  onActivePostIdChange(post.id);
                  setHoveredStripId(null);
                }
              }}
              style={{
                backgroundColor: isActive ? '#25201c' : post.panelColor,
                boxShadow: isActive
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)'
                  : isHovered
                  ? `0 10px 30px -10px ${accentColor}40`
                  : '0 4px 14px -4px rgba(0, 0, 0, 0.25)',
              }}
              className={`relative rounded-[28px] overflow-hidden flex flex-col transition-shadow duration-300 ${
                isActive
                  ? 'cursor-pointer border border-white/5 shrink-0'
                  : 'cursor-pointer shrink-0'
              }`}
            >
              {isActive ? (
                /* ACTIVE EXPANDED BENTO CARD */
                <motion.div
                  ref={activeCardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.16}
                  onDragStart={() => {
                    hasDragged.current = true;
                  }}
                  onDragEnd={(_e, info) => {
                    setTimeout(() => {
                      hasDragged.current = false;
                    }, 50);
                    if (info.offset.x < -40 || info.velocity.x < -300) {
                      handleNext();
                    } else if (info.offset.x > 40 || info.velocity.x > 300) {
                      handlePrev();
                    }
                  }}
                  onClick={() => {
                    if (!hasDragged.current) {
                      onOpenPost(post);
                    }
                  }}
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full justify-between p-6 sm:p-7 relative z-10 w-[410px] select-none"
                >
                  {/* Top Header & Number Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[11px] font-mono tracking-wider text-[#b8b1a9]/70 uppercase">
                        {post.category}
                      </span>
                      {/* Badge '001' in discrete pill at top right */}
                      <span className="px-3 py-0.5 rounded-full bg-[#342e2a] border border-white/5 text-[#d6d0c7] text-xs font-mono font-medium tracking-wider shadow-sm">
                        {post.number}
                      </span>
                    </div>

                    {/* Editorial Serif Title */}
                    <h2 className="font-serif text-2xl sm:text-[28px] lg:text-[30px] text-[#ece7dc] font-normal leading-[1.18] tracking-tight mb-2.5 text-balance">
                      {post.title}
                    </h2>

                    {/* Excerpt / Summary */}
                    <p className="text-[13px] sm:text-sm text-[#b8b1a9] leading-relaxed font-light mb-4 line-clamp-3">
                      {post.summary || post.excerpt}
                    </p>
                  </div>

                  {/* Artwork Area: Organic abstract wave illustration panning 2-4px in opposite direction */}
                  <div className="relative w-full h-[225px] rounded-2xl overflow-hidden border border-white/5 bg-[#201c18] shadow-inner">
                    <VectorArtwork post={post} panOffset={pan} />
                  </div>
                </motion.div>
              ) : (
                /* INACTIVE COLLAPSED VERTICAL STRIP */
                <div
                  className="h-full w-full py-5 px-1 flex flex-col justify-between items-center relative z-10 transition-colors"
                  style={{ color: post.panelTextColor }}
                >
                  {/* Top number pill */}
                  <div className="px-2 py-0.5 rounded-full bg-black/10 border border-black/10 text-[11px] font-mono font-semibold tracking-wide">
                    {post.number}
                  </div>

                  {/* Rotated vertical text in the center */}
                  <div className="h-[340px] flex items-center justify-center overflow-hidden my-auto pointer-events-none">
                    <span
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                      className="text-xs font-sans font-semibold tracking-wider uppercase whitespace-nowrap opacity-90 transition-opacity"
                    >
                      {post.verticalLabel}
                    </span>
                  </div>

                  {/* Subtle bouncing ChevronDown icon at bottom */}
                  <motion.div
                    animate={{
                      y: isHovered ? [0, 3, 0] : 0,
                    }}
                    transition={
                      isHovered
                        ? {
                            repeat: Infinity,
                            duration: 1.1,
                            ease: 'easeInOut',
                          }
                        : { duration: 0.2 }
                    }
                    className="w-6 h-6 flex items-center justify-center opacity-75 group-hover:opacity-100"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* DISCRETE BOTTOM CONTROL BAR (Directly underneath Bento post container, tracking active box) */}
      <div className="hidden md:flex items-center pt-4 w-full">
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 26,
          }}
          animate={{
            x: currentActiveIndex * (68 + 14),
          }}
          className="w-[410px] flex justify-center items-center"
        >
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#25201c]/90 border border-white/10 backdrop-blur-md shadow-lg">
            {/* Left Chevron Ghost Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstPost}
              aria-label="Forrige indlæg"
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-white/10 transition-all duration-200 ${
                isFirstPost
                  ? 'opacity-25 pointer-events-none cursor-default text-[#f5f2eb]/40 border-white/5'
                  : 'text-[#f5f2eb]/70 hover:text-[#f5f2eb] hover:border-white/30 hover:bg-white/5 active:scale-95 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2 px-1">
              {posts.map((p, dotIdx) => {
                const isCurrent = p.id === activePost.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onActivePostIdChange(p.id)}
                    aria-label={`Gå til artikel ${p.number}: ${p.title}`}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? 'w-2 h-2 bg-[#f5f2eb] scale-125 shadow-sm'
                        : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/60'
                    }`}
                  />
                );
              })}
            </div>

            {/* Right Chevron Ghost Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastPost}
              aria-label="Næste indlæg"
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-white/10 transition-all duration-200 ${
                isLastPost
                  ? 'opacity-25 pointer-events-none cursor-default text-[#f5f2eb]/40 border-white/5'
                  : 'text-[#f5f2eb]/70 hover:text-[#f5f2eb] hover:border-white/30 hover:bg-white/5 active:scale-95 cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* MOBILE: Touch Carousel with Discrete Bottom Controls */}
      <div className="flex md:hidden flex-col gap-4 pt-2">
        <div className="relative bg-[#25201c] border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-[#a69e96]">
            <span className="font-mono text-[#ece7dc] font-semibold">
              {activePost.number}
            </span>
            <span>{activePost.readingTime}</span>
          </div>

          <div
            onClick={() => onOpenPost(activePost)}
            className="pt-4 cursor-pointer"
          >
            <h3 className="font-serif text-2xl text-[#ece7dc] font-normal mb-2 leading-snug">
              {activePost.title}
            </h3>
            <p className="text-xs text-[#b8b1a9] line-clamp-3 mb-4">
              {activePost.summary || activePost.excerpt}
            </p>
          </div>

          <div
            onClick={() => onOpenPost(activePost)}
            className="h-44 rounded-xl overflow-hidden bg-[#201c18] border border-white/5 relative mb-4 cursor-pointer"
          >
            <VectorArtwork post={activePost} />
          </div>

          {/* Unified Mobile Bottom Navigation Controls */}
          <div className="flex items-center justify-center pt-2 border-t border-white/5">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#1e1a17]/80 border border-white/10">
              <button
                onClick={handlePrev}
                disabled={isFirstPost}
                aria-label="Forrige indlæg"
                className={`w-7 h-7 rounded-full flex items-center justify-center border border-white/10 transition-all duration-200 ${
                  isFirstPost
                    ? 'opacity-25 pointer-events-none cursor-default text-[#f5f2eb]/40'
                    : 'text-[#f5f2eb]/70 hover:text-[#f5f2eb] hover:border-white/30 hover:bg-white/5 active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2 px-1">
                {posts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onActivePostIdChange(p.id)}
                    aria-label={`Vælg kort ${p.number}`}
                    className={`rounded-full transition-all cursor-pointer ${
                      p.id === activePost.id
                        ? 'w-2 h-2 bg-[#f5f2eb] scale-125'
                        : 'w-1.5 h-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={isLastPost}
                aria-label="Næste indlæg"
                className={`w-7 h-7 rounded-full flex items-center justify-center border border-white/10 transition-all duration-200 ${
                  isLastPost
                    ? 'opacity-25 pointer-events-none cursor-default text-[#f5f2eb]/40'
                    : 'text-[#f5f2eb]/70 hover:text-[#f5f2eb] hover:border-white/30 hover:bg-white/5 active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

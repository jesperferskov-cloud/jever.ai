import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Bookmark, Share2, Check, ArrowLeft, Type } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { VectorArtwork } from './VectorArtwork';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  post,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState<'standard' | 'comfortable' | 'large'>('standard');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Track reading progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!post) return null;

  const fontClasses = {
    standard: 'text-base sm:text-lg leading-relaxed',
    comfortable: 'text-lg sm:text-xl leading-loose',
    large: 'text-xl sm:text-2xl leading-loose',
  };

  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0 sm:p-4 md:p-6 bg-[#161310]/85 backdrop-blur-md">
        {/* Top Reading Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-[#25201c] z-50">
          <div
            className="h-full bg-[#c98a75] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Container in warm espresso tone */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-full sm:h-[92vh] bg-[#25201c] border border-white/10 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#ece7dc]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#25201c]/95 backdrop-blur-md z-20">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs text-[#b8b1a9] hover:text-[#ece7dc] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tilbage til oversigten</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-[#1e1a17] rounded-lg p-1 border border-white/5 text-xs text-[#b8b1a9]">
                <Type className="w-3.5 h-3.5 ml-1 mr-0.5 text-[#b8b1a9]/60" />
                <button
                  onClick={() => setFontSize('standard')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    fontSize === 'standard' ? 'bg-[#3b332d] text-[#ece7dc]' : 'hover:text-[#ece7dc]'
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('comfortable')}
                  className={`px-2 py-0.5 rounded transition-colors font-medium ${
                    fontSize === 'comfortable' ? 'bg-[#3b332d] text-[#ece7dc]' : 'hover:text-[#ece7dc]'
                  }`}
                >
                  A+
                </button>
              </div>

              {/* Bookmark Toggle */}
              <button
                onClick={() => setBookmarked(!bookmarked)}
                title="Bogmærke"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  bookmarked
                    ? 'bg-[#c98a75]/20 border-[#c98a75]/40 text-[#c98a75]'
                    : 'border-white/10 text-[#b8b1a9] hover:text-[#ece7dc]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                title="Kopiér link"
                className="p-2 rounded-xl border border-white/10 text-[#b8b1a9] hover:text-[#ece7dc] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#98a892]" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-white/10 text-[#b8b1a9] hover:text-[#ece7dc] transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reading Scroll Body */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 py-10"
          >
            <div className="max-w-[70ch] mx-auto">
              {/* Metadata Kicker */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#b8b1a9] mb-4">
                <span className="text-[#c98a75] font-semibold">{post.number}</span>
                <span>·</span>
                <span>{post.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime}
                </span>
                <span>·</span>
                <span>{post.date}</span>
              </div>

              {/* Editorial Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#ece7dc] font-normal leading-[1.15] tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Teaser Excerpt */}
              <p className="font-serif italic text-lg sm:text-xl text-[#ece7dc]/90 leading-relaxed mb-8 border-l-2 border-[#c98a75] pl-4">
                {post.excerpt}
              </p>

              {/* Vector Artwork Header Frame */}
              <div className="w-full h-48 sm:h-64 rounded-2xl bg-[#1e1a17] border border-white/5 overflow-hidden mb-12 relative">
                <VectorArtwork post={post} caption={post.hardware} />
              </div>

              {/* Long-form Article Body Prose */}
              <div className={`space-y-6 text-[#ece7dc]/90 font-light ${fontClasses[fontSize]}`}>
                {paragraphs.map((para, index) => {
                  if (index === 0) {
                    const firstChar = para.charAt(0);
                    const restOfPara = para.slice(1);
                    return (
                      <p key={index} className="leading-relaxed">
                        <span className="float-left text-5xl sm:text-6xl font-serif text-[#c98a75] leading-none pr-3 pt-1 font-normal">
                          {firstChar}
                        </span>
                        {restOfPara}
                      </p>
                    );
                  }

                  if (index === 2) {
                    return (
                      <div key={index} className="my-10 py-6 border-y border-white/10">
                        <blockquote className="font-serif italic text-xl sm:text-2xl text-[#ece7dc] text-center max-w-xl mx-auto leading-relaxed">
                          "{para.slice(0, 140)}..."
                        </blockquote>
                        <cite className="block text-center text-xs font-mono text-[#b8b1a9] mt-3 uppercase tracking-wider not-italic">
                          — Fra feltnoterne på jever
                        </cite>
                      </div>
                    );
                  }

                  return (
                    <p key={index} className="leading-relaxed text-[#ece7dc]/90">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Curated Sign-off & Colophon */}
              <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#b8b1a9]">
                <div>
                  <div className="font-serif italic text-base text-[#ece7dc]">jever</div>
                  <div className="font-sans text-[11px] text-[#b8b1a9]/70">
                    Skrevet med nærvær for tænkende mennesker
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded bg-[#1e1a17] border border-white/5 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

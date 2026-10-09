import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, ArrowRight, CornerDownLeft, Tag } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { TranslationStrings } from '../types/translations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  translations?: TranslationStrings;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
  translations,
}) => {
  const allCategoryLabel = translations?.search.allCategories || 'Alle';
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(allCategoryLabel);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened and reset query
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory(allCategoryLabel);
    }
  }, [isOpen, allCategoryLabel]);

  // Keyboard navigation within search
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && filteredResults.length > 0) {
        e.preventDefault();
        const selected = filteredResults[selectedIndex] || filteredResults[0];
        if (selected) {
          onSelectPost(selected);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, onClose, onSelectPost]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return [allCategoryLabel, ...Array.from(set)];
  }, [posts, allCategoryLabel]);

  // Filter posts in real time
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === allCategoryLabel || post.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const titleMatch = post.title.toLowerCase().includes(q);
      const excerptMatch = post.excerpt?.toLowerCase().includes(q) || false;
      const summaryMatch = post.summary?.toLowerCase().includes(q) || false;
      const contentMatch = post.content?.toLowerCase().includes(q) || false;
      const tagMatch = post.tags?.some((t) => t.toLowerCase().includes(q)) || false;
      const numberMatch = post.number?.toLowerCase().includes(q) || false;

      return titleMatch || excerptMatch || summaryMatch || contentMatch || tagMatch || numberMatch;
    });
  }, [posts, query, selectedCategory, allCategoryLabel]);

  // Color mapping based on index / category to match earth palette
  const getBadgeStyle = (post: BlogPost) => {
    if (post.panelColor && post.panelTextColor && post.panelColor !== '#2d2621') {
      return {
        bg: post.panelColor,
        text: post.panelTextColor,
      };
    }
    // Default earth palette cycles
    const styles = [
      { bg: '#98a892', text: '#1e281b' }, // Sage
      { bg: '#e5cc9c', text: '#382e20' }, // Wheat
      { bg: '#c98a75', text: '#2e1a14' }, // Terracotta
      { bg: '#b5aaa0', text: '#25211e' }, // Muted Taupe
    ];
    const num = parseInt(post.number || '1', 10);
    return styles[(num - 1) % styles.length];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 sm:p-6 md:p-10 bg-[#161310]/85 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#25201c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden mt-6 sm:mt-12 text-[#ece7dc]"
        >
          {/* Subtle warm glow at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-[#e5cc9c]/8 blur-3xl pointer-events-none" />

          {/* Search Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#b8b1a9] absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={translations?.search.placeholder || "Søg i historier, tanker, tags eller kategorier..."}
                className="w-full pl-11 pr-12 py-3 bg-[#1e1a17]/90 rounded-2xl border border-white/10 text-sm sm:text-base text-[#f5f2eb] placeholder-[#b8b1a9]/50 focus:outline-none focus:border-[#98a892] transition-colors font-sans"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 p-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
                  title={translations?.search.close || "Ryd"}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="absolute right-3.5 p-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
                  title={translations?.search.close || "Luk"}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 mt-3 pt-1 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedIndex(0);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ece7dc] text-[#1e1a17] font-medium shadow-xs'
                        : 'bg-[#1e1a17]/70 text-[#b8b1a9] hover:text-[#f5f2eb] border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-3">
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-serif italic text-lg text-[#f5f2eb]/70 mb-1">
                  {translations?.search.noResults || "Ingen resultater matcher din søgning"}
                </p>
                <p className="text-xs text-[#b8b1a9]/60 max-w-sm mx-auto font-sans">
                  {translations?.search.noResultsHint || 'Prøv at søge efter et andet ord, tag som f.eks. "ro", "on-device", "nærvær", eller vælg en anden kategori.'}
                </p>
              </div>
            ) : (
              filteredResults.map((post, idx) => {
                const isFocused = idx === selectedIndex;
                const badge = getBadgeStyle(post);

                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      onSelectPost(post);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                      isFocused
                        ? 'bg-[#1e1a17] border-white/20 shadow-md translate-x-0.5'
                        : 'bg-[#1e1a17]/50 border-white/5 hover:border-white/10 hover:bg-[#1e1a17]/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Meta row with Earth Palette badge */}
                        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                          <span
                            className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold"
                            style={{ backgroundColor: badge.bg, color: badge.text }}
                          >
                            {post.number}
                          </span>
                          <span className="text-[#b8b1a9] font-medium text-[11px]">
                            {post.category}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="flex items-center gap-1 text-[11px] text-[#b8b1a9]/70">
                            <Clock className="w-3 h-3" />
                            {post.readingTime}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="text-[11px] text-[#b8b1a9]/70">
                            {post.date}
                          </span>
                        </div>

                        {/* Title in Editorial Serif */}
                        <h4 className="font-serif text-lg sm:text-xl font-normal text-[#f5f2eb] leading-snug group-hover:text-white transition-colors">
                          {post.title}
                        </h4>

                        {/* Excerpt */}
                        <p className="text-xs text-[#b8b1a9] line-clamp-2 mt-1.5 font-light leading-relaxed">
                          {post.excerpt || post.summary}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-[#b8b1a9]/80 font-sans"
                              >
                                <Tag className="w-2.5 h-2.5 text-[#b8b1a9]/50" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Action Indicator */}
                      <div className="shrink-0 pt-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isFocused
                              ? 'bg-[#ece7dc] text-[#1e1a17]'
                              : 'bg-white/5 text-[#b8b1a9] group-hover:bg-white/10 group-hover:text-[#f5f2eb]'
                          }`}
                        >
                          {isFocused ? (
                            <CornerDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Search Footer Hints */}
          <div className="px-5 py-3 border-t border-white/5 bg-[#1e1a17]/60 flex items-center justify-between text-[11px] text-[#b8b1a9]/60 font-mono">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">↑↓</kbd> {translations?.search.navigate || 'Naviger'}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">↵</kbd> {translations?.search.select || 'Vælg'}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80">ESC</kbd> {translations?.search.close || 'Luk'}
              </span>
            </div>
            <span>
              {filteredResults.length}{' '}
              {filteredResults.length === 1
                ? (translations?.search.resultSingle || 'resultat')
                : (translations?.search.resultPlural || 'resultater')}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

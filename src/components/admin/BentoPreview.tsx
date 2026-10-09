import React, { useState } from 'react';
import { ChevronDown, Clock, Tag } from 'lucide-react';
import { BlogPost, BentoColorId, BENTO_PALETTE } from '../../types/blog';
import { VectorArtwork } from '../VectorArtwork';

interface BentoPreviewProps {
  post: Partial<BlogPost> & {
    title: string;
    excerpt: string;
    category: BlogPost['category'];
    panelColor: string;
    panelTextColor: string;
    artworkType: BlogPost['artworkType'];
    number: string;
    readingTime: string;
    tags: string[];
    hardware?: string;
  };
}

export const BentoPreview: React.FC<BentoPreviewProps> = ({ post }) => {
  const [activePreviewMode, setActivePreviewMode] = useState<'both' | 'expanded' | 'folded'>('both');

  const mockPost: BlogPost = {
    id: post.id || 'preview',
    number: post.number || '005',
    title: post.title.trim() || 'Uden titel',
    summary: post.excerpt.trim() || 'Ingen manchettekst endnu...',
    excerpt: post.excerpt.trim() || 'Ingen manchettekst endnu...',
    verticalLabel: `${post.number || '005'} — ${(post.title.trim() || 'UDEN TITEL').toUpperCase()}`,
    kicker: post.category?.toUpperCase() || 'ESSAYS',
    slug: 'preview',
    content: post.content || '',
    category: post.category || 'Essays',
    readingTime: post.readingTime || '3 min',
    hardware: post.hardware || 'Feltnote · Taktil Balance',
    date: post.date || 'I dag',
    tags: post.tags?.length ? post.tags : ['Nærvær', 'Ro'],
    themeAccent: post.panelColor || '#e5cc9c',
    panelColor: post.panelColor || '#e5cc9c',
    panelTextColor: post.panelTextColor || '#382e20',
    artworkType: post.artworkType || 'dunes',
    coverWave: post.coverWave,
    status: post.status || 'published',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#98a892] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#b8b1a9]">
            Live Bento Preview
          </span>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1 bg-[#1e1a17] p-1 rounded-xl border border-white/5 text-[11px]">
          <button
            type="button"
            onClick={() => setActivePreviewMode('both')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activePreviewMode === 'both'
                ? 'bg-[#2a2420] text-[#f5f2eb] font-medium'
                : 'text-[#a8a29e] hover:text-[#f5f2eb]'
            }`}
          >
            Begge kort
          </button>
          <button
            type="button"
            onClick={() => setActivePreviewMode('expanded')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activePreviewMode === 'expanded'
                ? 'bg-[#2a2420] text-[#f5f2eb] font-medium'
                : 'text-[#a8a29e] hover:text-[#f5f2eb]'
            }`}
          >
            Udfoldet kort
          </button>
          <button
            type="button"
            onClick={() => setActivePreviewMode('folded')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activePreviewMode === 'folded'
                ? 'bg-[#2a2420] text-[#f5f2eb] font-medium'
                : 'text-[#a8a29e] hover:text-[#f5f2eb]'
            }`}
          >
            Foldet stribe
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 bg-[#1a1613] p-4 sm:p-6 rounded-3xl border border-white/5 overflow-hidden">
        {/* 1. Folded Vertical Strip Preview */}
        {(activePreviewMode === 'both' || activePreviewMode === 'folded') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-[#a8a29e] mb-2 uppercase tracking-wider">
              Foldet stribe
            </span>
            <div
              style={{
                backgroundColor: mockPost.panelColor,
                color: mockPost.panelTextColor,
              }}
              className="w-20 sm:w-20 h-[380px] rounded-3xl flex flex-col justify-between items-center py-6 px-2.5 shadow-xl transition-all border border-black/10 select-none shrink-0"
            >
              {/* Number pill */}
              <span className="font-mono text-[11px] font-bold tracking-wider opacity-90">
                {mockPost.number}
              </span>

              {/* Vertical Title (1:1 with Project Bible) */}
              <div className="flex-1 flex items-center justify-center overflow-hidden my-4">
                <span className="vertical-rl font-sans font-semibold text-xs tracking-wider uppercase whitespace-nowrap opacity-90 max-h-[240px] overflow-hidden text-ellipsis">
                  {mockPost.verticalLabel}
                </span>
              </div>

              {/* Bottom Chevron */}
              <div className="opacity-80">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* 2. Expanded Bento Card Preview */}
        {(activePreviewMode === 'both' || activePreviewMode === 'expanded') && (
          <div className="flex-1 flex flex-col max-w-md">
            <span className="text-[10px] font-mono text-[#a8a29e] mb-2 uppercase tracking-wider">
              Udfoldet aktivt kort
            </span>
            <div className="w-full h-[380px] rounded-3xl bg-[#25201c] border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-hidden relative group">
              <div>
                {/* Header row: Number + Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-[#ece7dc]">
                    {mockPost.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#98a892]">
                      {mockPost.category}
                    </span>
                    <span className="text-[10px] text-[#b8b1a9]/60 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mockPost.readingTime}
                    </span>
                  </div>
                </div>

                {/* Editorial Title */}
                <h4 className="font-serif text-lg sm:text-xl font-normal text-[#f5f2eb] line-clamp-2 leading-snug mb-2">
                  {mockPost.title}
                </h4>

                {/* Excerpt */}
                <p className="text-xs text-[#b8b1a9] line-clamp-2 font-light leading-relaxed mb-3">
                  {mockPost.excerpt}
                </p>
              </div>

              {/* Artwork Container */}
              <div className="w-full h-32 rounded-2xl overflow-hidden border border-white/5 relative bg-[#201c18] my-1">
                <VectorArtwork post={mockPost} caption={mockPost.hardware} />
              </div>

              {/* Footer info: tags */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                <div className="flex items-center gap-1 text-[#b8b1a9]/70 truncate max-w-[200px]">
                  <Tag className="w-3 h-3 shrink-0" />
                  <span className="truncate">{mockPost.tags.join(', ')}</span>
                </div>
                <span
                  style={{ backgroundColor: mockPost.panelColor, color: mockPost.panelTextColor }}
                  className="px-2 py-0.5 rounded-full text-[9px] font-mono font-medium"
                >
                  {mockPost.panelColor}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

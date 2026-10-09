import React, { useState } from 'react';
import {
  FileText,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface PostLibraryProps {
  posts: BlogPost[];
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onToggleStatus: (postId: string) => void;
  onReorderPosts: (reordered: BlogPost[]) => void;
  onCreateNew: () => void;
}

export const PostLibrary: React.FC<PostLibraryProps> = ({
  posts,
  onEditPost,
  onDeletePost,
  onToggleStatus,
  onReorderPosts,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.number.includes(searchQuery);

    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const isDraft = post.status === 'draft';
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'draft' && isDraft) ||
      (filterStatus === 'published' && !isDraft);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reorder helpers
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newPosts = [...posts];
    const temp = newPosts[index - 1];
    newPosts[index - 1] = newPosts[index];
    newPosts[index] = temp;
    onReorderPosts(newPosts);
  };

  const handleMoveDown = (index: number) => {
    if (index >= posts.length - 1) return;
    const newPosts = [...posts];
    const temp = newPosts[index + 1];
    newPosts[index + 1] = newPosts[index];
    newPosts[index] = temp;
    onReorderPosts(newPosts);
  };

  const publishedCount = posts.filter((p) => p.status !== 'draft').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-5">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#98a892]">
              POST BIBLIOTEK // CRUD
            </span>
            <span className="text-[10px] text-[#b8b1a9]/60 font-mono">
              ({posts.length} total · {publishedCount} publiceret · {draftCount} kladder)
            </span>
          </div>
          <h3 className="font-serif text-2xl font-normal text-[#f5f2eb]">
            Redaktionelt Indholdsarkiv
          </h3>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17] text-xs font-medium transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Opret Nyt Essay</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#1e1a17] border border-white/5 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#a8a29e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søg i titler, numre eller resumé..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#98a892]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#98a892]"
          >
            <option value="all">Alle statusser ({posts.length})</option>
            <option value="published">Publiceret ({publishedCount})</option>
            <option value="draft">Kladder ({draftCount})</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#98a892]"
          >
            <option value="all">Alle kategorier</option>
            <option value="Essays">Essays</option>
            <option value="Arkitektur">Arkitektur</option>
            <option value="On-Device AI">On-Device AI</option>
            <option value="Hardware">Hardware</option>
            <option value="Filosofi">Filosofi</option>
          </select>
        </div>
      </div>

      {/* Post List / Table */}
      <div className="rounded-2xl border border-white/10 bg-[#1e1a17] overflow-hidden shadow-xl">
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-[#b8b1a9] space-y-2">
            <FileText className="w-8 h-8 mx-auto text-[#a8a29e]/40" />
            <p className="text-xs font-sans">Ingen essays matcher den valgte filtrering.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#25201c] text-[#a8a29e] font-mono border-b border-white/10 text-[11px]">
                <tr>
                  <th className="p-3.5 w-16 text-center">Rækkefølge</th>
                  <th className="p-3.5 w-16">Nr.</th>
                  <th className="p-3.5">Titel &amp; Manchet</th>
                  <th className="p-3.5 hidden md:table-cell">Kategori &amp; Tid</th>
                  <th className="p-3.5 hidden sm:table-cell">Bento Tone</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Handlinger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map((post, index) => {
                  const originalIndex = posts.findIndex((p) => p.id === post.id);
                  const isDraft = post.status === 'draft';

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-white/[0.02] transition-colors text-[#f5f2eb]"
                    >
                      {/* Reorder Buttons */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(originalIndex)}
                            disabled={originalIndex === 0}
                            title="Flyt op i karrusellen"
                            className="p-1 rounded hover:bg-white/10 text-[#a8a29e] hover:text-[#f5f2eb] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(originalIndex)}
                            disabled={originalIndex === posts.length - 1}
                            title="Flyt ned i karrusellen"
                            className="p-1 rounded hover:bg-white/10 text-[#a8a29e] hover:text-[#f5f2eb] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Post Number */}
                      <td className="p-3 font-mono">
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-semibold text-[#ece7dc]">
                          {post.number}
                        </span>
                      </td>

                      {/* Title & Excerpt */}
                      <td className="p-3 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <div className="font-serif text-sm text-[#f5f2eb] font-normal leading-snug line-clamp-1">
                            {post.title}
                          </div>
                          {post.coverWave && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#98a892]/20 text-[#98a892] border border-[#98a892]/30 shrink-0"
                              title={`Parametrisk bølge-cover (seed #${post.coverWave.seed})`}
                            >
                              Bølge #{post.coverWave.seed}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#b8b1a9] font-light line-clamp-1 mt-0.5">
                          {post.excerpt}
                        </div>
                      </td>

                      {/* Category & Read Time */}
                      <td className="p-3 hidden md:table-cell">
                        <div className="font-mono text-[11px] text-[#ece7dc]">{post.category}</div>
                        <div className="text-[10px] text-[#b8b1a9]/60 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </div>
                      </td>

                      {/* Bento Earth Tone Indicator */}
                      <td className="p-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span
                            style={{ backgroundColor: post.panelColor }}
                            className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                          />
                          <span className="text-[10px] font-mono text-[#b8b1a9]/80 truncate">
                            {post.panelColor}
                          </span>
                        </div>
                      </td>

                      {/* Status Indicator (Publiceret vs Kladde) */}
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(post.id)}
                          title="Klik for at skifte status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
                            isDraft
                              ? 'bg-[#e5cc9c]/15 text-[#e5cc9c] border border-[#e5cc9c]/30 hover:bg-[#e5cc9c]/25'
                              : 'bg-[#98a892]/15 text-[#98a892] border border-[#98a892]/30 hover:bg-[#98a892]/25'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDraft ? 'bg-[#e5cc9c]' : 'bg-[#98a892] animate-pulse'
                            }`}
                          />
                          <span>{isDraft ? 'Kladde' : 'Publiceret'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditPost(post)}
                            title="Rediger essay"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-white/10 text-[#ece7dc] border border-white/5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#e5cc9c]" />
                            <span className="hidden sm:inline">Rediger</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPostToDelete(post)}
                            title="Slet essay"
                            className="p-1.5 rounded-lg bg-[#25201c] hover:bg-rose-500/20 text-[#a8a29e] hover:text-rose-300 border border-white/5 hover:border-rose-500/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tactile Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(postToDelete)}
        post={postToDelete}
        onConfirm={() => {
          if (postToDelete) {
            onDeletePost(postToDelete.id);
            setPostToDelete(null);
          }
        }}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { BlogPost } from '../../types/blog';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  post: BlogPost | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  post,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#161310]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#25201c] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-[#ece7dc] overflow-hidden"
        >
          {/* Subtle Warm Amber Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#c98a75]/15 blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#a8a29e] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#c98a75]/20 border border-[#c98a75]/40 flex items-center justify-center text-[#c98a75] shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c98a75]">
                Bekræft Sletning
              </span>
              <h3 className="font-serif text-xl font-normal text-[#f5f2eb] leading-tight">
                Fjern essay fra jever?
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#b8b1a9] leading-relaxed mb-4 font-light">
            Er du sikker på, at du vil slette essayet <strong className="text-[#ece7dc] font-medium font-serif italic">"{post.title}"</strong> ({post.number})? Handlingen kan ikke fortrydes.
          </p>

          <div className="p-3.5 rounded-2xl bg-[#1e1a17] border border-white/5 mb-6 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#a8a29e]">
              <span>Kortnummer:</span>
              <span className="text-[#e5cc9c]">{post.number}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#a8a29e]">
              <span>Kategori:</span>
              <span className="text-[#ece7dc]">{post.category}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#a8a29e]">
              <span>Status:</span>
              <span className={post.status === 'draft' ? 'text-[#e5cc9c]' : 'text-[#98a892]'}>
                {post.status === 'draft' ? 'Kladde' : 'Publiceret'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs text-[#a8a29e] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
            >
              Annuller
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer shadow-md flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Slet essay permanent</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

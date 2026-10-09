import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  Quote,
  Code,
  Link,
  Clock,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Tag,
  Palette,
  FilePlus,
  Save,
  Send,
  Layers,
  Compass,
  Feather,
  ChevronUp,
  X,
} from 'lucide-react';
import { BlogPost, BentoColorId, BENTO_PALETTE, WaveCoverConfig } from '../../types/blog';
import { BentoPreview } from './BentoPreview';
import { CoverWaveEngine } from './CoverWaveEngine';
import { AICoAuthor, GeneratedDraft } from './AICoAuthor';

interface PostEditorProps {
  initialPost?: BlogPost | null;
  postsCount: number;
  onSavePost: (post: BlogPost, isPublish: boolean) => void;
  onCancelEdit?: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  initialPost,
  postsCount,
  onSavePost,
  onCancelEdit,
}) => {
  // Form fields
  const [title, setTitle] = useState(initialPost?.title || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [category, setCategory] = useState<BlogPost['category']>(initialPost?.category || 'Essays');
  const [hardware, setHardware] = useState(initialPost?.hardware || 'Autonomt Fokus · On-Device');
  const [tagsInput, setTagsInput] = useState(initialPost?.tags?.join(', ') || 'Nærvær, Ro');
  const [artworkType, setArtworkType] = useState<BlogPost['artworkType']>(initialPost?.artworkType || 'dunes');
  const [coverWave, setCoverWave] = useState<WaveCoverConfig | undefined>(initialPost?.coverWave);

  // Companion studio tool drawer state: 'none' | 'cover' | 'coauthor'
  const [activeStudioTool, setActiveStudioTool] = useState<'none' | 'cover' | 'coauthor'>('none');

  // Determine current color ID from panelColor
  const detectColorId = (colorHex?: string): BentoColorId => {
    if (!colorHex) return 'sand';
    const entry = Object.entries(BENTO_PALETTE).find(([_, opt]) => opt.bgHex.toLowerCase() === colorHex.toLowerCase());
    return (entry ? entry[0] : 'sand') as BentoColorId;
  };

  const [selectedColorId, setSelectedColorId] = useState<BentoColorId>(
    initialPost ? detectColorId(initialPost.panelColor) : 'sand'
  );

  // Live preview toggle
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when initialPost changes (e.g. from Library Edit action)
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setExcerpt(initialPost.excerpt);
      setContent(initialPost.content);
      setCategory(initialPost.category);
      setHardware(initialPost.hardware);
      setTagsInput(initialPost.tags.join(', '));
      setSelectedColorId(detectColorId(initialPost.panelColor));
      setArtworkType(initialPost.artworkType);
      setCoverWave(initialPost.coverWave);
    }
  }, [initialPost]);

  // Read time calculation based on word count
  const rawWords = (title.trim() + ' ' + excerpt.trim() + ' ' + content.trim()).split(/\s+/).filter(Boolean).length;
  const wordCount = Math.max(1, rawWords);
  const calculatedReadTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const readTimeString = `${calculatedReadTimeMinutes} min`;

  // Insert markdown helper at cursor
  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  // Preset quick tags
  const addQuickTag = (tagToAdd: string) => {
    const existing = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (!existing.includes(tagToAdd)) {
      setTagsInput([...existing, tagToAdd].join(', '));
    }
  };

  // Apply custom cover from CoverWaveEngine
  const handleApplyCoverWave = (config: WaveCoverConfig) => {
    setCoverWave(config);
    setArtworkType('custom');
    setSelectedColorId(config.palette);
    setToastMessage(`Parametrisk bølge (seed #${config.seed}) tilknyttet posten som coverbillede.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Apply draft from AICoAuthor
  const handleInsertAIDraft = (draft: GeneratedDraft) => {
    setTitle(draft.title);
    setExcerpt(draft.excerpt);
    setContent(draft.content);
    if (draft.suggestedCategory) {
      setCategory(draft.suggestedCategory);
    }
    if (draft.suggestedTags?.length) {
      setTagsInput(draft.suggestedTags.join(', '));
    }
    setToastMessage(`Kladde "${draft.title}" overført fra medforfatter til editoren.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form submission / save handler
  const handleSave = (isPublish: boolean) => {
    if (!title.trim()) {
      setToastMessage('Udfyld venligst mindst en overskrift til essayet.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const activeColor = BENTO_PALETTE[selectedColorId];
    const postNumber = initialPost?.number || String(postsCount + 1).padStart(3, '0');

    const updatedPost: BlogPost = {
      id: initialPost?.id || `post-${Date.now()}`,
      number: postNumber,
      title: title.trim(),
      summary: excerpt.trim() || 'Et nyt sobert essay forfattet på jever.',
      excerpt: excerpt.trim() || 'Et nyt sobert essay forfattet på jever.',
      verticalLabel: `${postNumber} — ${title.trim().toUpperCase()}`,
      kicker: category.toUpperCase(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: content.trim() || 'Dette essay afventer yderligere indhold.',
      category,
      readingTime: readTimeString,
      hardware: hardware.trim() || 'On-Device Silicium',
      date: initialPost?.date || new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' }),
      tags: tagsArray.length > 0 ? tagsArray : ['Nærvær', 'Ro'],
      themeAccent: activeColor.bgHex,
      panelColor: activeColor.bgHex,
      panelTextColor: activeColor.textHex,
      artworkType: coverWave ? 'custom' : artworkType,
      coverWave,
      status: isPublish ? 'published' : 'draft',
    };

    onSavePost(updatedPost, isPublish);
    setToastMessage(
      isPublish
        ? `"${title}" er publiceret til sitets aktive Bento-karrusel!`
        : `"${title}" er gemt som kladde i dit bibliotek.`
    );
    setTimeout(() => setToastMessage(null), 3500);

    // If it was a new post, reset form
    if (!initialPost) {
      setTitle('');
      setExcerpt('');
      setContent('');
      setTagsInput('Nærvær, Ro');
      setCoverWave(undefined);
      setActiveStudioTool('none');
    }
  };

  const handleResetToNew = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setTagsInput('Nærvær, Ro');
    setHardware('Autonomt Fokus · On-Device');
    setSelectedColorId('sand');
    setArtworkType('dunes');
    setCoverWave(undefined);
    setActiveStudioTool('none');
    if (onCancelEdit) onCancelEdit();
  };

  const activeColor = BENTO_PALETTE[selectedColorId];
  const postNumberPreview = initialPost?.number || String(postsCount + 1).padStart(3, '0');

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-[#98a892]/20 border border-[#98a892]/40 text-xs text-[#98a892] flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-[#98a892] hover:text-[#ece7dc]"
          >
            Luk
          </button>
        </div>
      )}

      {/* Header bar of the Editor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#e5cc9c]">
              {initialPost ? `REDIGERER ${initialPost.number}` : 'NYT ESSAY // KLADDE'}
            </span>
            {initialPost && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                initialPost.status === 'draft' ? 'bg-[#e5cc9c]/20 text-[#e5cc9c]' : 'bg-[#98a892]/20 text-[#98a892]'
              }`}>
                {initialPost.status === 'draft' ? 'Kladde' : 'Publiceret'}
              </span>
            )}
            {coverWave && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#98a892]/15 text-[#98a892] border border-[#98a892]/30 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                <span>Bølge #{coverWave.seed}</span>
              </span>
            )}
          </div>
          <h3 className="font-serif text-2xl font-normal text-[#f5f2eb]">
            {initialPost ? initialPost.title : 'Forfatterens Skriveværksted'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {initialPost && (
            <button
              type="button"
              onClick={handleResetToNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#1e1a17] hover:bg-white/5 border border-white/10 text-[#b8b1a9] hover:text-[#f5f2eb] transition-colors cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Nyt tomt essay</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border ${
              showLivePreview
                ? 'bg-[#2a2420] text-[#e5cc9c] border-white/10'
                : 'bg-[#1e1a17] text-[#a8a29e] border-white/5 hover:text-[#f5f2eb]'
            }`}
          >
            {showLivePreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showLivePreview ? 'Viser Preview' : 'Skjul Preview'}</span>
          </button>
        </div>
      </div>

      {/* STUDIO COMPANION TOOLBAR (Cover-maskine & Medforfatter) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#1e1a17] border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#b8b1a9]/60 uppercase tracking-widest px-2">
            Værksteds-moduler:
          </span>

          {/* 1. Cover-maskine toggle button */}
          <button
            type="button"
            onClick={() =>
              setActiveStudioTool((prev) => (prev === 'cover' ? 'none' : 'cover'))
            }
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer border ${
              activeStudioTool === 'cover'
                ? 'bg-[#e5cc9c] text-[#1e1a17] font-medium border-[#e5cc9c] shadow-md'
                : 'bg-[#25201c] hover:bg-[#2e2621] text-[#ece7dc] border-white/10'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${activeStudioTool === 'cover' ? 'text-[#1e1a17]' : 'text-[#e5cc9c]'}`} />
            <span>Cover-maskine</span>
            {coverWave && (
              <span className={`w-1.5 h-1.5 rounded-full ${activeStudioTool === 'cover' ? 'bg-[#1e1a17]' : 'bg-[#98a892]'}`} />
            )}
          </button>

          {/* 2. Medforfatter (AI) toggle button */}
          <button
            type="button"
            onClick={() =>
              setActiveStudioTool((prev) => (prev === 'coauthor' ? 'none' : 'coauthor'))
            }
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer border ${
              activeStudioTool === 'coauthor'
                ? 'bg-[#98a892] text-[#1e281b] font-medium border-[#98a892] shadow-md'
                : 'bg-[#25201c] hover:bg-[#2e2621] text-[#ece7dc] border-white/10'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeStudioTool === 'coauthor' ? 'text-[#1e281b]' : 'text-[#98a892]'}`} />
            <span>Medforfatter (AI)</span>
          </button>
        </div>

        {activeStudioTool !== 'none' && (
          <button
            type="button"
            onClick={() => setActiveStudioTool('none')}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#b8b1a9] hover:text-[#ece7dc] px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Luk modul</span>
          </button>
        )}
      </div>

      {/* COMPANION TOOL DRAWERS */}
      <AnimatePresence mode="wait">
        {activeStudioTool === 'cover' && (
          <motion.div
            key="cover-engine-drawer"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <CoverWaveEngine
              currentConfig={coverWave}
              onApplyCover={handleApplyCoverWave}
              onClose={() => setActiveStudioTool('none')}
              postTitle={title || 'Uden titel'}
              hardwareNote={hardware}
            />
          </motion.div>
        )}

        {activeStudioTool === 'coauthor' && (
          <motion.div
            key="coauthor-drawer"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <AICoAuthor
              onInsertDraft={handleInsertAIDraft}
              onClose={() => setActiveStudioTool('none')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Left Editor & Right Live Bento Preview */}
      <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-12 gap-6' : 'gap-4'}`}>
        {/* Editor Form Column */}
        <div className={`${showLivePreview ? 'lg:col-span-7' : 'w-full'} space-y-5`}>
          {/* Title (Editorial Serif input) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                Titel på essay (Editorial Serif)
              </label>
              <span className="text-[10px] font-mono text-[#b8b1a9]/60">
                Kortnummer: {postNumberPreview}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks. Stilhedens Arkitektur i en Flygtig Verden..."
              required
              className="w-full px-4 py-3 rounded-2xl bg-[#1e1a17] border border-white/10 font-serif text-xl sm:text-2xl text-[#f5f2eb] placeholder-[#a8a29e]/35 focus:outline-none focus:border-[#e5cc9c] transition-colors shadow-inner"
            />
          </div>

          {/* Excerpt / Subtitle (Humanist sans) */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
              Manchet / Resumé (Humanist Sans)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="En sober indledning, der fanger essayets kærnebudskab i 1-2 sætninger..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1a17] border border-white/10 text-xs sm:text-sm text-[#ece7dc] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#e5cc9c] leading-relaxed transition-colors"
            />
          </div>

          {/* Body with Formatting Toolbar */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                Brødtekst (Markdown)
              </label>

              {/* Automatic Read Time & Word Count live badge */}
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-[#b8b1a9]/70">{wordCount} ord</span>
                <span className="text-white/20">·</span>
                <span className="text-[#98a892] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTimeString} læsetid
                </span>
              </div>
            </div>

            {/* Markdown Trigger Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#1e1a17] rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => insertFormatting('# ', '', 'Overskrift 1')}
                title="H1 Overskrift"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 font-mono text-xs"
              >
                <Heading1 className="w-3.5 h-3.5" />
                <span>H1</span>
              </button>

              <button
                type="button"
                onClick={() => insertFormatting('## ', '', 'Overskrift 2')}
                title="H2 Underoverskrift"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 font-mono text-xs"
              >
                <Heading2 className="w-3.5 h-3.5" />
                <span>H2</span>
              </button>

              <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

              <button
                type="button"
                onClick={() => insertFormatting('**', '**', 'fremhævet tekst')}
                title="Fed tekst"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting('*', '*', 'kursiv tekst')}
                title="Kursiv tekst"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting('> ', '', 'Et tankevækkende citat her...')}
                title="Citatblok"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting('`', '`', 'kode eller udtryk')}
                title="Kode / Monospace"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting('[', '](https://)', 'linktekst')}
                title="Link"
                className="px-2 py-1 rounded-lg text-[#b8b1a9] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Link className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Her skrives artiklen. Brug Markdown eller de ovenstående genveje..."
              className="w-full px-4 py-3 rounded-2xl bg-[#1e1a17] border border-white/10 font-mono text-xs text-[#f5f2eb] placeholder-[#a8a29e]/35 focus:outline-none focus:border-[#e5cc9c] leading-relaxed transition-colors shadow-inner"
            />
          </div>

          {/* Category & Design Color Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#1e1a17] border border-white/5">
            {/* Category dropdown */}
            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              >
                <option value="Essays">Essays</option>
                <option value="Arkitektur">Arkitektur</option>
                <option value="On-Device AI">On-Device AI</option>
                <option value="Hardware">Hardware</option>
                <option value="Filosofi">Filosofi</option>
              </select>
            </div>

            {/* Artwork Theme Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                  Illustrationstype
                </label>
                <button
                  type="button"
                  onClick={() => setActiveStudioTool('cover')}
                  className="text-[10px] font-mono text-[#e5cc9c] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" />
                  <span>Åbn Cover-maskine</span>
                </button>
              </div>
              <select
                value={coverWave ? 'custom' : artworkType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  if (val === 'custom') {
                    setActiveStudioTool('cover');
                  } else {
                    setArtworkType(val);
                    setCoverWave(undefined);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              >
                <option value="custom">Parametrisk Bølge-Cover (Bespoke Wave)</option>
                <option value="dunes">Bølger &amp; Klitter (Dunes)</option>
                <option value="contours">Organiske Konturer (Contours)</option>
                <option value="monolith">Taktil Monolit (Monolith)</option>
                <option value="neural">Lokal Topografi (Neural/Topography)</option>
              </select>
            </div>

            {/* 4 Design Colors Palette (1:1 with Project Bible) */}
            <div className="sm:col-span-2 pt-2 border-t border-white/5">
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Bento Jordfarve (Inaktiv Fane)</span>
                <span className="text-[#ece7dc] font-sans font-medium">
                  {activeColor.name} ({activeColor.bgHex})
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.entries(BENTO_PALETTE) as [BentoColorId, typeof activeColor][]).map(
                  ([key, col]) => {
                    const isSelected = selectedColorId === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedColorId(key)}
                        style={{ backgroundColor: col.bgHex, color: col.textHex }}
                        className={`p-2.5 rounded-xl text-left transition-all cursor-pointer relative font-sans ${
                          isSelected
                            ? 'ring-2 ring-white shadow-lg scale-[1.02]'
                            : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="text-[11px] font-semibold leading-tight">{col.name}</div>
                        <div className="text-[9px] font-mono opacity-70 mt-0.5">{col.bgHex}</div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Tags & Hardware Note */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                  Emne-Tags
                </label>
                <div className="flex items-center gap-1 text-[10px] text-[#b8b1a9]/70">
                  <span>Hurtig tilføj:</span>
                  {['Nærvær', 'Ro', 'Zero-Cloud', 'Arkitektur', 'Digital Ro'].map((qTag) => (
                    <button
                      key={qTag}
                      type="button"
                      onClick={() => addQuickTag(qTag)}
                      className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#ece7dc] cursor-pointer"
                    >
                      +{qTag}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Kommaseparerede tags: Nærvær, Ro, Filosofi..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1a17] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Feltnote / Hardware Identifikator
              </label>
              <input
                type="text"
                value={hardware}
                onChange={(e) => setHardware(e.target.value)}
                placeholder="F.eks. M4 Pro · 48GB / Taktil Balance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1a17] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>
          </div>

          {/* Action Buttons: "Gem kladde" & "Publicer post" */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-[#b8b1a9]/60 font-sans">
              * Ændringer lagres omgående i den lokale browserbase.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2a2420] hover:bg-[#342c27] text-[#ece7dc] border border-white/10 text-xs font-medium transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-[#e5cc9c]" />
                <span>Gem kladde</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17] text-xs font-medium transition-all shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#1e1a17]" />
                <span>Publicer post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Bento Preview Column */}
        {showLivePreview && (
          <div className="lg:col-span-5 space-y-4">
            <BentoPreview
              post={{
                number: postNumberPreview,
                title,
                excerpt,
                content,
                category,
                readingTime: readTimeString,
                tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
                panelColor: activeColor.bgHex,
                panelTextColor: activeColor.textHex,
                artworkType: coverWave ? 'custom' : artworkType,
                coverWave,
                hardware,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};


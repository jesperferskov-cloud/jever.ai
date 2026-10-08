import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Key, Mail, Send, Check, Users, FileText, Server, LogOut, Plus, Sparkles } from 'lucide-react';
import { Subscriber, BlogPost } from '../types/blog';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: Subscriber[];
  onAddSubscriber: (email: string) => void;
  posts: BlogPost[];
  onAddPost?: (post: BlogPost) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  subscribers,
  onAddSubscriber,
  posts,
  onAddPost,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password');
  const [password, setPassword] = useState('');
  const [magicEmail, setMagicEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Studio tabs once authenticated
  const [studioTab, setStudioTab] = useState<'subscribers' | 'compose' | 'system'>('subscribers');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // New post draft state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<BlogPost['category']>('On-Device AI');
  const [draftHardware, setDraftHardware] = useState('M4 Pro • 48GB');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [postCreatedAlert, setPostCreatedAlert] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    setTimeout(() => {
      setIsSubmitting(false);
      // For preview purposes, accept any password or empty to simulate logged in
      setIsAuthenticated(true);
    }, 450);
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubEmail && newSubEmail.includes('@')) {
      onAddSubscriber(newSubEmail);
      setNewSubEmail('');
    }
  };

  const handleSimulateDispatch = () => {
    setDispatchStatus('Orkestrerer lokal Resend SMTP via mailService.js...');
    setTimeout(() => {
      setDispatchStatus(`Sendt til ${subscribers.length} modtagere fra lokal disk!`);
      setTimeout(() => setDispatchStatus(null), 4000);
    }, 1200);
  };

  const handlePublishDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !onAddPost) return;

    const newPost: BlogPost = {
      id: `draft-${Date.now()}`,
      number: String(posts.length + 1).padStart(3, '0'),
      title: draftTitle,
      verticalLabel: `${String(posts.length + 1).padStart(3, '0')} — ${draftTitle.toUpperCase()}`,
      kicker: 'Nyt Udgivet Essay',
      slug: draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: draftExcerpt || 'Et nyt sobert essay forfattet direkte i det lokale skriveværksted.',
      content: draftContent || 'Her starter artiklen skrevet i rå Markdown...',
      category: draftCategory,
      readingTime: '4 min',
      hardware: draftHardware,
      date: 'Netop nu',
      tags: ['Lokal inferens', 'Zero-Cloud'],
      themeAccent: '#c26d48',
      panelColor: '#dfc99d',
      panelTextColor: '#201d1a',
      artworkType: 'contours',
    };

    onAddPost(newPost);
    setPostCreatedAlert(true);
    setDraftTitle('');
    setDraftExcerpt('');
    setDraftContent('');
    setTimeout(() => setPostCreatedAlert(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#161310]/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#25201c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#ece7dc] overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-[#c98a75]/10 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#a8a29e] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isAuthenticated ? (
          /* GHOST AUTH LOGIN FORM */
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#c26d48]">
              <Lock className="w-3.5 h-3.5" />
              <span>GHOST AUTH · PRIVAT ADGANG</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f2eb] mb-2">
              jever // terminal adgang
            </h3>
            <p className="text-xs sm:text-sm text-[#a8a29e] mb-6">
              Dette rum er skjult for almindelige besøgende. Indtast adgangskode for at tilgå lokal disk-synkronisering og subscribers.json.
            </p>

            {/* Tab selection */}
            <div className="flex items-center gap-1 p-1 bg-[#141211] rounded-xl border border-white/5 mb-6 max-w-xs">
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-[#24211e] text-[#f5f2eb] font-medium'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                Adgangskode / PIN
              </button>
              <button
                onClick={() => setActiveTab('magic')}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'magic'
                    ? 'bg-[#24211e] text-[#f5f2eb] font-medium'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                Magisk Link
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {activeTab === 'password' ? (
                <div>
                  <label className="block text-xs font-mono text-[#a8a29e] mb-1.5">
                    Pinkode / Master Token
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Indtast adgangskode eller PIN..."
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141211] border border-white/10 text-sm text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c26d48] transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono text-[#a8a29e] mb-1.5">
                    Forfatterens E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)}
                      placeholder="jesper.ferskov@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141211] border border-white/10 text-sm text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c26d48] transition-colors"
                    />
                  </div>
                </div>
              )}

              {authError && (
                <div className="text-xs text-rose-400 font-mono">
                  {authError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs text-[#a8a29e] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#f3efe6] hover:bg-[#eae4d7] text-[#141211] font-medium text-xs transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? 'Verificerer...' : 'Log ind'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED PUBLISHING STUDIO */
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#2d2925] mb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#10b981]">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>FORFATTER GODKENDT · LOKAL KONSOL</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#f5f2eb]">
                  Redaktionelt Værksted
                </h3>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#a8a29e] hover:text-rose-400 bg-[#141211] border border-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log ud</span>
              </button>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setStudioTab('subscribers')}
                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                  studioTab === 'subscribers'
                    ? 'bg-[#24211e] text-[#f5f2eb] border border-white/10'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Abonnenter ({subscribers.length})</span>
              </button>

              <button
                onClick={() => setStudioTab('compose')}
                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                  studioTab === 'compose'
                    ? 'bg-[#24211e] text-[#f5f2eb] border border-white/10'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Skriv Essay</span>
              </button>

              <button
                onClick={() => setStudioTab('system')}
                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                  studioTab === 'system'
                    ? 'bg-[#24211e] text-[#f5f2eb] border border-white/10'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Zero-Cloud Status</span>
              </button>
            </div>

            {/* TAB CONTENT: SUBSCRIBERS */}
            {studioTab === 'subscribers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#a8a29e]">
                    Flad database: <code className="text-[#c26d48]">/content/subscribers.json</code>
                  </span>
                  <button
                    onClick={handleSimulateDispatch}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24211e] hover:bg-[#2d2925] border border-[#c26d48]/40 text-xs text-[#f5f2eb] cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-[#c26d48]" />
                    <span>Udsend via Resend SMTP</span>
                  </button>
                </div>

                {dispatchStatus && (
                  <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-xs text-[#10b981] flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{dispatchStatus}</span>
                  </div>
                )}

                {/* Subscribers table list */}
                <div className="rounded-xl border border-white/5 bg-[#141211] overflow-hidden max-h-52 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1a1816] text-[#a8a29e] font-mono border-b border-white/5">
                      <tr>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Dato</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="text-[#f5f2eb]">
                          <td className="p-3 font-mono">{sub.email}</td>
                          <td className="p-3 text-[#a8a29e]">{sub.date}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add subscriber manually */}
                <form onSubmit={handleAddSub} className="flex gap-2 pt-2">
                  <input
                    type="email"
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    placeholder="Tilføj modtager manuelt..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/50 focus:outline-none focus:border-[#c26d48]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#24211e] hover:bg-[#2d2925] border border-white/10 text-xs text-[#f5f2eb] cursor-pointer"
                  >
                    Tilføj
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: COMPOSE POST */}
            {studioTab === 'compose' && (
              <form onSubmit={handlePublishDraft} className="space-y-3">
                {postCreatedAlert && (
                  <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-xs text-[#10b981] flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Essay tilføjet til oversigten!</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-[#a8a29e] mb-1">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="F.eks. Llama 3 på M4 Max..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c26d48]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#a8a29e] mb-1">
                      Kategori
                    </label>
                    <select
                      value={draftCategory}
                      onChange={(e) => setDraftCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#c26d48]"
                    >
                      <option value="On-Device AI">On-Device AI</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Arkitektur">Arkitektur</option>
                      <option value="Essays">Essays</option>
                      <option value="Filosofi">Filosofi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#a8a29e] mb-1">
                      Hardware Profil
                    </label>
                    <input
                      type="text"
                      value={draftHardware}
                      onChange={(e) => setDraftHardware(e.target.value)}
                      placeholder="M4 Pro • 48GB"
                      className="w-full px-3 py-2 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#c26d48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a8a29e] mb-1">
                    Teaser / Uddrag
                  </label>
                  <textarea
                    rows={2}
                    value={draftExcerpt}
                    onChange={(e) => setDraftExcerpt(e.target.value)}
                    placeholder="Kort introducerende resumé..."
                    className="w-full px-3 py-2 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c26d48]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#a8a29e] mb-1">
                    Brødtekst (Markdown)
                  </label>
                  <textarea
                    rows={4}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Her starter selve artiklen skrevet i rå Markdown..."
                    className="w-full px-3 py-2 rounded-xl bg-[#141211] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c26d48] font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#c26d48] hover:bg-[#a85936] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Gem & Publicer Lokalt
                </button>
              </form>
            )}

            {/* TAB CONTENT: ZERO-CLOUD STATUS */}
            {studioTab === 'system' && (
              <div className="space-y-3 text-xs text-[#a8a29e]">
                <div className="p-4 rounded-xl bg-[#141211] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[#f5f2eb]">
                    <span className="font-mono text-[11px]">Hjælpeservice</span>
                    <span className="text-[#10b981] font-mono text-[11px]">KØRER LOKALT (PORT 3000)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>E-mail udbyder</span>
                    <span className="font-mono text-[#f5f2eb]">Resend SMTP (Zero-Cloud)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Datamappe</span>
                    <span className="font-mono text-[#c26d48]">/content/posts/</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kvantisering i hukommelse</span>
                    <span className="font-mono text-[#f5f2eb]">MLX Q4_K_M (38 tok/s)</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#a8a29e]/70 leading-relaxed">
                  Alle ændringer gemmes direkte til disk. Ingen tredjeparts sky-databaser eller eksterne analysekoder er aktive på sitet.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

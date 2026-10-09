import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Key,
  Mail,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Terminal,
  LogOut,
  Layers,
  Edit3,
  Download,
  Send,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { Subscriber, BlogPost, SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/blog';
import { PostEditor } from './admin/PostEditor';
import { PostLibrary } from './admin/PostLibrary';
import { SiteSettingsPanel } from './admin/SiteSettingsPanel';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: Subscriber[];
  onAddSubscriber: (email: string) => void;
  posts: BlogPost[];
  onSavePost: (post: BlogPost, isPublish: boolean) => void;
  onDeletePost: (postId: string) => void;
  onToggleStatus: (postId: string) => void;
  onReorderPosts: (reordered: BlogPost[]) => void;
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

interface AdminCredentials {
  password: string;
  authorEmail: string;
  updatedAt: string;
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  password: 'jever2026',
  authorEmail: 'jesper.ferskov@gmail.com',
  updatedAt: '2026-02-24',
};

const STORAGE_KEY = 'jever_admin_credentials_v1';
const SESSION_KEY = 'jever_admin_authenticated';

type AdminTab = 'editor' | 'library' | 'settings' | 'subscribers';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  subscribers,
  onAddSubscriber,
  posts,
  onSavePost,
  onDeletePost,
  onToggleStatus,
  onReorderPosts,
  siteSettings,
  onSaveSiteSettings,
}) => {
  // Credentials state persisted in localStorage
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_CREDENTIALS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  // Login form state
  const [activeLoginTab, setActiveLoginTab] = useState<'password' | 'magic'>('password');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Command Tower Active Sub-Tab:
  // "Skriv & Rediger" (Post Editor) | "Bibliotek" (Post Library / CRUD) | "Indstillinger" (Site Text & Admin Settings)
  const [activeTab, setActiveTab] = useState<AdminTab>('library');

  // Currently editing post (if selected from Library)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Subscribers state (bonus tab)
  const [newSubEmail, setNewSubEmail] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Close on Escape if inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    setTimeout(() => {
      setIsSubmitting(false);

      if (activeLoginTab === 'password') {
        if (loginPassword === credentials.password || loginPassword === 'jever2026') {
          setIsAuthenticated(true);
          sessionStorage.setItem(SESSION_KEY, 'true');
          setLoginPassword('');
          setAuthError('');
        } else {
          setAuthError('Ugyldig adgangskode. Prøv "jever2026" eller din opdaterede kode.');
        }
      } else {
        if (loginEmail.trim().toLowerCase() === credentials.authorEmail.toLowerCase()) {
          setIsAuthenticated(true);
          sessionStorage.setItem(SESSION_KEY, 'true');
          setLoginEmail('');
          setAuthError('');
        } else {
          setAuthError(`E-mail matcher ikke godkendt forfatter (${credentials.authorEmail}).`);
        }
      }
    }, 300);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    setActiveTab('library');
    setEditingPost(null);
  };

  // Update password & author email
  const handleUpdatePassword = (newPass: string, newEmail: string): boolean => {
    try {
      const updated: AdminCredentials = {
        password: newPass,
        authorEmail: newEmail,
        updatedAt: new Date().toLocaleDateString('da-DK'),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setCredentials(updated);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleResetFactoryPassword = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      setCredentials(DEFAULT_CREDENTIALS);
    } catch (e) {
      // ignore
    }
  };

  // Switch to Editor with post data loaded
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setActiveTab('editor');
  };

  // Add Subscriber
  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubEmail && newSubEmail.includes('@')) {
      onAddSubscriber(newSubEmail);
      setNewSubEmail('');
    }
  };

  // Export Subscribers
  const handleExportSubscribers = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(subscribers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jever-subscribers-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Simulate Dispatch
  const handleSimulateDispatch = () => {
    setDispatchStatus('Orkestrerer lokal Resend SMTP via mailService.js...');
    setTimeout(() => {
      setDispatchStatus(`Udsendt til ${subscribers.length} modtagere fra disk (/content/subscribers.json)`);
      setTimeout(() => setDispatchStatus(null), 4500);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#161310]/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 15 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-[#25201c] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl text-[#ece7dc] my-auto overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#c98a75]/10 blur-3xl pointer-events-none" />

        {/* 1. Discrete "Luk Kontroltårn" (Exit / Back to Site) floating circular button */}
        <button
          onClick={onClose}
          aria-label="Luk Kontroltårn"
          title="Luk Kontroltårn (Tilbage til sitet)"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1e1a17] hover:bg-[#2c2622] border border-white/10 hover:border-white/25 text-[#b8b1a9] hover:text-[#ece7dc] shadow-xl flex items-center justify-center transition-all cursor-pointer z-30 group"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 duration-300" />
          <span className="sr-only">Luk Kontroltårn</span>
        </button>

        {!isAuthenticated ? (
          /* ========================================================
             1. GHOST ADMIN AUTHENTICATION GATE
             ======================================================== */
          <div className="max-w-xl mx-auto py-8 w-full">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#c98a75]">
              <Lock className="w-3.5 h-3.5" />
              <span>GHOST AUTH · KONTROLTÅRN ADGANG</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#f5f2eb] mb-2 tracking-tight">
              jever // Kontroltårnet
            </h3>
            <p className="text-xs sm:text-sm text-[#b8b1a9] mb-6 font-light leading-relaxed">
              Autentificer for at åbne det lokale redaktionelle kontroltårn, forfatte essays med live Bento-preview, administrere biblioteket og redigere sitets tekster.
            </p>

            {/* Tab selection */}
            <div className="flex items-center gap-1 p-1 bg-[#1e1a17] rounded-xl border border-white/5 mb-6 max-w-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveLoginTab('password');
                  setAuthError('');
                }}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  activeLoginTab === 'password'
                    ? 'bg-[#2a2420] text-[#f5f2eb] font-medium shadow-xs'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                Adgangskode / PIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveLoginTab('magic');
                  setAuthError('');
                }}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  activeLoginTab === 'magic'
                    ? 'bg-[#2a2420] text-[#f5f2eb] font-medium shadow-xs'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                Forfatter E-mail
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {activeLoginTab === 'password' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-[#a8a29e]">
                      Pinkode / Master Password
                    </label>
                    <span className="text-[11px] font-mono text-[#a8a29e]/60">
                      Standard: <code className="text-[#e5cc9c]">jever2026</code>
                    </span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Indtast adgangskode..."
                      autoFocus
                      required
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#1e1a17] border border-white/10 text-sm text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c98a75] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#f5f2eb]"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-[#a8a29e]">
                      Forfatterens Godkendte E-mail
                    </label>
                    <span className="text-[11px] font-mono text-[#a8a29e]/60">
                      Standard: <code className="text-[#e5cc9c]">{credentials.authorEmail}</code>
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={credentials.authorEmail}
                      autoFocus
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1e1a17] border border-white/10 text-sm text-[#f5f2eb] placeholder-[#a8a29e]/40 focus:outline-none focus:border-[#c98a75] transition-colors"
                    />
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setLoginPassword('jever2026');
                    setLoginEmail(credentials.authorEmail);
                  }}
                  className="text-xs text-[#a8a29e] hover:text-[#e5cc9c] underline underline-offset-4 cursor-pointer font-sans"
                >
                  Indsæt standardadgang
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs text-[#a8a29e] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Annuller
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17] font-medium text-xs transition-all shadow-md cursor-pointer whitespace-nowrap"
                  >
                    {isSubmitting ? 'Verificerer...' : 'Åbn Kontroltårn'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================
             2. AUTHENTICATED COMMAND TOWER (KONTROLTÅRNET)
             ======================================================== */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 pr-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#98a892]/20 border border-[#98a892]/40 flex items-center justify-center text-[#98a892]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#98a892]">
                    <span className="w-2 h-2 rounded-full bg-[#98a892] animate-pulse" />
                    <span>KONTROLTÅRN · SESSION AKTIV</span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#f5f2eb] leading-tight">
                    jever // Kontroltårnet
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#b8b1a9] hover:text-rose-400 bg-[#1e1a17] border border-white/5 hover:border-rose-400/30 transition-colors cursor-pointer"
                  title="Afslut session og log ud"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log ud</span>
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs:
                1. "Skriv & Rediger" (Post Editor)
                2. "Bibliotek" (Post Library / CRUD)
                3. "Indstillinger" (Site Text & Admin Settings)
                + Bonus: "Abonnenter"
            */}
            <div className="flex items-center gap-1.5 p-1 bg-[#1e1a17] rounded-2xl border border-white/5 my-4 overflow-x-auto no-scrollbar shrink-0">
              {/* Tab 1: Skriv & Rediger */}
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'editor'
                    ? 'bg-[#2a2420] text-[#f5f2eb] font-medium border border-white/10 shadow-xs'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#e5cc9c]" />
                <span>Skriv &amp; Rediger</span>
                {editingPost && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5cc9c]" />
                )}
              </button>

              {/* Tab 2: Bibliotek */}
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'library'
                    ? 'bg-[#2a2420] text-[#f5f2eb] font-medium border border-white/10 shadow-xs'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#98a892]" />
                <span>Bibliotek ({posts.length})</span>
              </button>

              {/* Tab 3: Indstillinger */}
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-[#2a2420] text-[#f5f2eb] font-medium border border-white/10 shadow-xs'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-[#c98a75]" />
                <span>Indstillinger</span>
              </button>

              {/* Tab 4: Abonnenter */}
              <button
                type="button"
                onClick={() => setActiveTab('subscribers')}
                className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'subscribers'
                    ? 'bg-[#2a2420] text-[#f5f2eb] font-medium border border-white/10 shadow-xs'
                    : 'text-[#a8a29e] hover:text-[#f5f2eb]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#b5aaa0]" />
                <span>Abonnenter ({subscribers.length})</span>
              </button>
            </div>

            {/* TAB CONTENTS (Scrollable area) */}
            <div className="flex-1 overflow-y-auto pr-1 pb-4">
              {/* 1. SKRIV & REDIGER */}
              {activeTab === 'editor' && (
                <PostEditor
                  initialPost={editingPost}
                  postsCount={posts.length}
                  onSavePost={(post, isPublish) => {
                    onSavePost(post, isPublish);
                    if (editingPost) {
                      setEditingPost(null);
                    }
                  }}
                  onCancelEdit={() => setEditingPost(null)}
                />
              )}

              {/* 2. BIBLIOTEK (CRUD) */}
              {activeTab === 'library' && (
                <PostLibrary
                  posts={posts}
                  onEditPost={handleEditPost}
                  onDeletePost={onDeletePost}
                  onToggleStatus={onToggleStatus}
                  onReorderPosts={onReorderPosts}
                  onCreateNew={() => {
                    setEditingPost(null);
                    setActiveTab('editor');
                  }}
                />
              )}

              {/* 3. INDSTILLINGER */}
              {activeTab === 'settings' && (
                <SiteSettingsPanel
                  settings={siteSettings}
                  onSaveSettings={onSaveSiteSettings}
                  currentPasswordHash={credentials.password}
                  onUpdatePassword={handleUpdatePassword}
                  onResetFactoryPassword={handleResetFactoryPassword}
                />
              )}

              {/* 4. ABONNENTER */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-sans font-medium text-[#f5f2eb]">
                        Abonnenter på jever
                      </h4>
                      <p className="text-xs text-[#b8b1a9] font-mono">
                        Lagret lokalt: <code className="text-[#e5cc9c]">/content/subscribers.json</code>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportSubscribers}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1a17] hover:bg-white/5 border border-white/10 text-xs text-[#ece7dc] cursor-pointer transition-colors"
                        title="Eksportér JSON fil"
                      >
                        <Download className="w-3.5 h-3.5 text-[#b8b1a9]" />
                        <span>Eksportér JSON</span>
                      </button>

                      <button
                        onClick={handleSimulateDispatch}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2420] hover:bg-[#342c27] border border-[#98a892]/40 text-xs text-[#f5f2eb] cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-[#98a892]" />
                        <span>Udsend via SMTP</span>
                      </button>
                    </div>
                  </div>

                  {dispatchStatus && (
                    <div className="p-3 rounded-xl bg-[#98a892]/20 border border-[#98a892]/40 text-xs text-[#98a892] flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{dispatchStatus}</span>
                    </div>
                  )}

                  {/* Subscribers table list */}
                  <div className="rounded-2xl border border-white/5 bg-[#1e1a17] overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#25201c] text-[#a8a29e] font-mono border-b border-white/5">
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
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#98a892]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#98a892]" />
                                {sub.status === 'active' ? 'Aktiv' : sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add subscriber manually */}
                  <form onSubmit={handleAddSub} className="flex gap-2 pt-1">
                    <input
                      type="email"
                      value={newSubEmail}
                      onChange={(e) => setNewSubEmail(e.target.value)}
                      placeholder="Tilføj ny e-mailadresse..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1e1a17] border border-white/10 text-xs text-[#f5f2eb] placeholder-[#a8a29e]/50 focus:outline-none focus:border-[#98a892]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17] font-medium text-xs transition-colors cursor-pointer"
                    >
                      Tilføj Abonnent
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

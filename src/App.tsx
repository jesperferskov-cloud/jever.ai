import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, INITIAL_SUBSCRIBERS } from './data/posts';
import { BlogPost, Subscriber, SiteSettings, DEFAULT_SITE_SETTINGS } from './types/blog';
import { Header } from './components/Header';
import { HeroIdentity } from './components/HeroIdentity';
import { BentoCarousel } from './components/BentoCarousel';
import { ArticleModal } from './components/ArticleModal';
import { AdminModal } from './components/AdminModal';
import { AboutCard } from './components/AboutCard';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AnimatePresence } from 'motion/react';
import { Language } from './types/translations';
import { TRANSLATIONS } from './data/translations';

export default function App() {
  // Global Language state (Default: Danish 'da')
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jever_language_v1');
      if (saved === 'da' || saved === 'en') return saved;
    } catch (e) {
      // ignore
    }
    return 'da';
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'da' ? 'en' : 'da';
      try {
        localStorage.setItem('jever_language_v1', next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const translations = TRANSLATIONS[language];

  // Posts state with localStorage persistence
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('jever_posts_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return BLOG_POSTS.map((p) => ({ ...p, status: 'published' as const }));
  });

  // Site Settings state with localStorage persistence
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('jever_site_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Subscribers state with localStorage persistence
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem('jever_subscribers_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_SUBSCRIBERS;
  });

  // Published posts for live reader view
  const publishedPosts = posts.filter((p) => p.status !== 'draft');
  const displayPosts = publishedPosts.length > 0 ? publishedPosts : posts;

  const [activePostId, setActivePostId] = useState<string>(() => displayPosts[0]?.id || '001');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [isGhostAdminOpen, setIsGhostAdminOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<'historier' | 'om'>('historier');

  // Sync posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jever_posts_v2', JSON.stringify(posts));
    } catch (e) {
      // ignore
    }
  }, [posts]);

  // Sync siteSettings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jever_site_settings_v1', JSON.stringify(siteSettings));
    } catch (e) {
      // ignore
    }
  }, [siteSettings]);

  // Sync subscribers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jever_subscribers_v1', JSON.stringify(subscribers));
    } catch (e) {
      // ignore
    }
  }, [subscribers]);

  // Ensure activePostId is valid among displayPosts
  useEffect(() => {
    if (!displayPosts.some((p) => p.id === activePostId)) {
      if (displayPosts[0]) {
        setActivePostId(displayPosts[0].id);
      }
    }
  }, [displayPosts, activePostId]);

  // Currently active post object
  const currentActivePost = displayPosts.find((p) => p.id === activePostId) || displayPosts[0];
  // Latest post is the first item in the list
  const latestPost = displayPosts[0] || null;

  // Keyboard shortcut listeners:
  // - Cmd + Shift + A or Ctrl + Shift + A -> Admin
  // - Cmd + K or Ctrl + K -> Search
  // - Escape -> Close any modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin Trigger: Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsGhostAdminOpen((prev) => !prev);
        return;
      }

      // Search Trigger: Cmd + K or Ctrl + K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Escape key handles modals
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isAboutOpen) {
          setIsAboutOpen(false);
          setActiveNav('historier');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAboutOpen, isSearchOpen]);

  const handleNavClick = (navItem: 'historier' | 'om') => {
    setActiveNav(navItem);
    if (navItem === 'historier') {
      if (displayPosts[0]) setActivePostId(displayPosts[0].id);
      setIsAboutOpen(false);
    } else if (navItem === 'om') {
      setIsAboutOpen(true);
    }
  };

  const handleAddSubscriber = (email: string) => {
    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setSubscribers((prev) => [newSub, ...prev]);
  };

  // CRUD Handler: Create or Update post
  const handleSavePost = (savedPost: BlogPost, isPublish: boolean) => {
    setPosts((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === savedPost.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedPost;
        return next;
      } else {
        return [savedPost, ...prev];
      }
    });

    if (isPublish) {
      setActivePostId(savedPost.id);
    }
  };

  // CRUD Handler: Delete post
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // CRUD Handler: Toggle post status (published <-> draft)
  const handleToggleStatus = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextStatus = p.status === 'draft' ? 'published' : 'draft';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // CRUD Handler: Reorder posts and update sequence numbers (001, 002, 003...)
  const handleReorderPosts = (reordered: BlogPost[]) => {
    const renumbered = reordered.map((p, index) => {
      const numStr = String(index + 1).padStart(3, '0');
      return {
        ...p,
        number: numStr,
        verticalLabel: `${numStr} — ${p.title.toUpperCase()}`,
      };
    });
    setPosts(renumbered);
  };

  // Site Settings Handler
  const handleSaveSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
  };

  const handleSelectPostFromSearch = (post: BlogPost) => {
    setActivePostId(post.id);
    setReadingPost(post);
  };

  return (
    <div className="min-h-screen w-full bg-[#1e1a17] text-[#ece7dc] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans antialiased selection:bg-[#c98a75]/30 selection:text-[#ece7dc] relative">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-between flex-1 min-h-[calc(100vh-4rem)]">
        {/* Top Header: Pure Editorial Wordmark on Canvas, Center Capsule, Right Controls */}
        <Header
          onSelectNav={handleNavClick}
          activeNav={activeNav}
          onOpenSearch={() => setIsSearchOpen(true)}
          latestPost={latestPost}
          onOpenPost={(post) => {
            setActivePostId(post.id);
            setReadingPost(post);
          }}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          translations={translations}
          activeAccentColor={currentActivePost?.themeAccent || '#c98a75'}
        />

        {/* Main 2-Column Hero Section with generous breathing space */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-4 sm:py-6">
          {/* Left Hero Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <HeroIdentity
              onExplore={() => {
                if (currentActivePost) setReadingPost(currentActivePost);
              }}
              siteSettings={siteSettings}
              translations={translations}
            />
          </div>

          {/* Right Column: Color-Coded Accordion Bento Cards (Star of the Show) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <BentoCarousel
              posts={displayPosts}
              activePostId={activePostId}
              onActivePostIdChange={(id) => setActivePostId(id)}
              onOpenPost={(post) => setReadingPost(post)}
              isModalOpen={Boolean(readingPost || isGhostAdminOpen || isAboutOpen || isSearchOpen)}
            />
          </div>
        </main>

        {/* Minimal Footer with ghost admin trigger on final period */}
        <Footer
          onOpenGhostAdmin={() => setIsGhostAdminOpen(true)}
          siteSettings={siteSettings}
          translations={translations}
        />
      </div>

      {/* 3. Reader Search Modal / Bar (Cmd + K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={displayPosts}
        onSelectPost={handleSelectPostFromSearch}
        translations={translations}
      />

      {/* Long-form Article Reader Modal */}
      {readingPost && (
        <ArticleModal
          post={readingPost}
          onClose={() => setReadingPost(null)}
        />
      )}

      {/* "Om" Tidsskriftet Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#161310]/85 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAboutOpen(false);
                setActiveNav('historier');
              }
            }}
          >
            <AboutCard
              onClose={() => {
                setIsAboutOpen(false);
                setActiveNav('historier');
              }}
              onSubscribe={handleAddSubscriber}
              translations={translations}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 1. Stealth Ghost Admin Authentication & Command Tower Modal */}
      <AdminModal
        isOpen={isGhostAdminOpen}
        onClose={() => setIsGhostAdminOpen(false)}
        subscribers={subscribers}
        onAddSubscriber={handleAddSubscriber}
        posts={posts}
        onSavePost={handleSavePost}
        onDeletePost={handleDeletePost}
        onToggleStatus={handleToggleStatus}
        onReorderPosts={handleReorderPosts}
        siteSettings={siteSettings}
        onSaveSiteSettings={handleSaveSiteSettings}
      />
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, INITIAL_SUBSCRIBERS } from './data/posts';
import { BlogPost, Subscriber } from './types/blog';
import { Header } from './components/Header';
import { HeroIdentity } from './components/HeroIdentity';
import { BentoCarousel } from './components/BentoCarousel';
import { ArticleModal } from './components/ArticleModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [isGhostAdminOpen, setIsGhostAdminOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('historier');

  // Keyboard shortcut listener: Cmd + Shift + A or Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsGhostAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (navItem: 'historier' | 'indsigt' | 'kategorier' | 'om') => {
    setActiveNav(navItem);
    if (navItem === 'historier') {
      setActiveCardIndex(0);
    } else if (navItem === 'indsigt') {
      setReadingPost(posts[activeCardIndex] || posts[0]);
    } else if (navItem === 'om') {
      setReadingPost(posts[0]);
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

  const handleAddPost = (newPost: BlogPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveCardIndex(0);
  };

  return (
    <div className="min-h-screen w-full bg-[#1e1a17] text-[#ece7dc] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans antialiased selection:bg-[#c98a75]/30 selection:text-[#ece7dc]">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-between flex-1 min-h-[calc(100vh-4rem)]">
        {/* Top Bar (Header with "jever" pill on left, centered capsule nav, clean right) */}
        <Header
          onSelectNav={handleNavClick}
          activeNav={activeNav}
        />

        {/* Main 2-Column Hero Section matching reference image 2 1:1 */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-4 sm:py-6">
          {/* Left Hero Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <HeroIdentity
              onExplore={() => setReadingPost(posts[activeCardIndex] || posts[0])}
            />
          </div>

          {/* Right Column: Color-Coded Accordion Bento Cards */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <BentoCarousel
              posts={posts}
              activeIndex={activeCardIndex}
              onActiveIndexChange={(idx) => setActiveCardIndex(idx)}
              onOpenPost={(post) => setReadingPost(post)}
            />
          </div>
        </main>

        {/* Minimal Footer with ghost admin trigger on final period */}
        <footer className="w-full pt-8 pb-2 flex items-center justify-between text-xs text-[#a69e96]/70 select-none">
          <div className="flex items-center">
            <span>© 2026 jever</span>
            {/* Subtle ghost anchor on final period */}
            <button
              onClick={() => setIsGhostAdminOpen(true)}
              tabIndex={-1}
              aria-hidden="true"
              className="cursor-default select-none focus:outline-none p-0 m-0 border-none bg-transparent text-inherit hover:text-inherit"
            >
              .
            </button>
            <span className="ml-2 hidden sm:inline text-[#a69e96]/40">
              Alle rettigheder forbeholdes
            </span>
          </div>

          <div className="font-mono text-[11px] text-[#a69e96]/40 tracking-wider">
            ON-DEVICE · PRIVACY FIRST
          </div>
        </footer>
      </div>

      {/* Long-form Article Reader Modal */}
      {readingPost && (
        <ArticleModal
          post={readingPost}
          onClose={() => setReadingPost(null)}
        />
      )}

      {/* Stealth Ghost Admin Authentication Modal */}
      <AdminModal
        isOpen={isGhostAdminOpen}
        onClose={() => setIsGhostAdminOpen(false)}
        subscribers={subscribers}
        onAddSubscriber={handleAddSubscriber}
        posts={posts}
        onAddPost={handleAddPost}
      />
    </div>
  );
}

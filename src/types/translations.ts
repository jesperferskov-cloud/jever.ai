export type Language = 'da' | 'en';

export interface TranslationStrings {
  nav: {
    stories: string;
    about: string;
    search: string;
  };
  notification: {
    newBadge: string;
    newEssay: string;
    dismiss: string;
    viewStory: string;
  };
  hero: {
    label: string;
    title: string;
    excerpt: string;
    cta: string;
  };
  search: {
    placeholder: string;
    noResults: string;
    noResultsHint: string;
    allCategories: string;
    navigate: string;
    select: string;
    close: string;
    resultSingle: string;
    resultPlural: string;
  };
  about: {
    badge: string;
    badgeSubtitle: string;
    title: string;
    author: string;
    close: string;
    architectureLabel: string;
    privacyLabel: string;
    formatLabel: string;
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterSuccess: string;
    newsletterButton: string;
    newsletterLoading: string;
  };
  article: {
    readTime: string;
    published: string;
    back: string;
    share: string;
    copied: string;
  };
  footer: {
    rights: string;
    tagline: string;
  };
}

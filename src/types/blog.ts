export interface WaveCoverConfig {
  palette: BentoColorId;
  density: number; // 15 - 45 lines
  curvature: number; // 0.5 - 2.5
  frequency: number; // 1.0 - 4.0
  seed: number;
  animated: boolean;
}

export interface BlogPost {
  id: string; // '001', '002', '003', '004'
  number: string; // '001', '002', '003', '004'
  title: string;
  summary: string;
  excerpt: string;
  verticalLabel: string; // e.g. "002 — FREMTIDENS ARBEJDSLIV"
  kicker: string;
  slug: string;
  content: string;
  category: 'Essays' | 'Arkitektur' | 'On-Device AI' | 'Hardware' | 'Filosofi';
  readingTime: string;
  hardware: string;
  date: string;
  tags: string[];
  themeAccent: string; // Hex for bespoke subtle artwork tone
  panelColor: string; // Dedicated pastel/earth color for inactive vertical tab
  panelTextColor: string; // Text color on inactive tab
  artworkType: 'dunes' | 'contours' | 'monolith' | 'neural' | 'topography' | 'custom';
  coverWave?: WaveCoverConfig;
  featured?: boolean;
  status?: 'published' | 'draft';
}

export type BentoColorId = 'sand' | 'terracotta' | 'sage' | 'taupe';

export interface BentoColorOption {
  id: BentoColorId;
  name: string;
  bgHex: string;
  textHex: string;
}

export const BENTO_PALETTE: Record<BentoColorId, BentoColorOption> = {
  sand: {
    id: 'sand',
    name: 'Sand / Hvede',
    bgHex: '#e5cc9c',
    textHex: '#382e20',
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta / Rosa',
    bgHex: '#c98a75',
    textHex: '#2e1a14',
  },
  sage: {
    id: 'sage',
    name: 'Salviegrøn',
    bgHex: '#98a892',
    textHex: '#1e281b',
  },
  taupe: {
    id: 'taupe',
    name: 'Muted Taupe',
    bgHex: '#b5aaa0',
    textHex: '#25211e',
  },
};

export interface SiteSettings {
  heroLabel: string;
  heroTitle: string;
  heroExcerpt: string;
  heroCtaText: string;
  footerCopyright: string;
  footerRights: string;
  footerTagline: string;
  adminUsername: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroLabel: 'BLOG & TANKER',
  heroTitle: 'Tanker,\nperspektiver og\nhistorier der\nræsonnerer.',
  heroExcerpt: 'Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær.',
  heroCtaText: 'Udforsk indlæg',
  footerCopyright: '© 2026 jever',
  footerRights: 'Alle rettigheder forbeholdes',
  footerTagline: 'ON-DEVICE · PRIVACY FIRST',
  adminUsername: 'jesper.ferskov@gmail.com',
};

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  status: 'active' | 'pending';
}


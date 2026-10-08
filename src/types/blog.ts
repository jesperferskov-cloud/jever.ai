export interface BlogPost {
  id: string;
  number: string; // e.g. "001"
  title: string;
  verticalLabel: string; // e.g. "002 — FREMTIDENS ARBEJDSLIV"
  kicker: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Essays' | 'Arkitektur' | 'On-Device AI' | 'Hardware' | 'Filosofi';
  readingTime: string;
  hardware: string;
  date: string;
  tags: string[];
  themeAccent: string; // Hex for bespoke subtle artwork tone
  panelColor: string; // Dedicated pastel/earth color for inactive vertical tab
  panelTextColor: string; // Text color on inactive tab
  artworkType: 'dunes' | 'monolith' | 'neural' | 'contours' | 'rings' | 'topography';
  featured?: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  status: 'active' | 'pending';
}

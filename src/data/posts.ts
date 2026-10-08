import { BlogPost } from '../types/blog';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'kunsten-at-finde-ro',
    number: '001',
    title: 'Kunsten at finde ro i en digital tidsalder',
    verticalLabel: '001 - KUNSTEN AT FINDE RO',
    kicker: 'BLOG & TANKER',
    slug: 'kunsten-at-finde-ro',
    excerpt: 'Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær.',
    category: 'Filosofi',
    readingTime: '6 min',
    hardware: 'Sideotsikst af jsrer er naturgation',
    date: '24. feb 2026',
    tags: ['Nærvær', 'Ro', 'Digital Arkitektur'],
    themeAccent: '#98a892',
    panelColor: '#25201c',
    panelTextColor: '#ece7dc',
    artworkType: 'dunes',
    featured: true,
    content: `Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær.

I en verden fyldt med støj, notifikationer og endeløse feeds, er evnen til at finde stilhed blevet en sjælden luksus. jever er skabt som et roligt fristed. Her findes ingen unødvendige pop-ups, ingen cookie-advarsler og ingen overvågning.

Vi undersøger skæringspunktet mellem menneske, formsprog og uafhængig teknologi. Når vi fjerner webstøjen, åbner der sig et rum for fordybelse og eftertanke. Det er vores overbevisning, at de mest holdbare ideer opstår i stilhed.`
  },
  {
    id: 'fremtidens-arbejdsliv',
    number: '002',
    title: 'Fremtidens Arbejdsliv: Mennesket før Maskinen',
    verticalLabel: '002 - FREMTIDENS ARBEJDSLIV',
    kicker: 'ARBEJDSLIV & SAMFUND',
    slug: 'fremtidens-arbejdsliv',
    excerpt: 'Hvordan skaber vi meningsfulde rammer for arbejdet, når kunstig intelligens overtager rutinerne? En undersøgelse af autonomi og dyb fokus.',
    category: 'Essays',
    readingTime: '5 min',
    hardware: 'Autonomt Fokus',
    date: '18. feb 2026',
    tags: ['Fremtid', 'Arbejde', 'Fokus'],
    themeAccent: '#e5cc9c',
    panelColor: '#e5cc9c', // Warm sand / wheat tint
    panelTextColor: '#382e20',
    artworkType: 'contours',
    content: `Arbejdslivet er under forandring. Hvor det industrielle paradigme målte værdi i timer foran en skærm, måler fremtidens arbejde værdi i dybde, empati og dømmekraft.

Når algoritmer og computere overtager de mekaniske processer, genopdager vi det, der gør os menneskelige: evnen til at stille de rigtige spørgsmål og lytte til stilheden mellem svarene.`
  },
  {
    id: 'design-og-mennesker',
    number: '003',
    title: 'Design & Mennesker: Taktil Æstetik',
    verticalLabel: '003 - DESIGN & MENNESKER',
    kicker: 'FORM & FORMÅL',
    slug: 'design-og-mennesker',
    excerpt: 'Hvorfor fysiske teksturer, varme jordfarver og rolige kontraster genopretter vores forhold til den digitale grænseflade.',
    category: 'Arkitektur',
    readingTime: '7 min',
    hardware: 'Taktil Balance',
    date: '12. feb 2026',
    tags: ['Design', 'Æstetik', 'Taktil'],
    themeAccent: '#c98a75',
    panelColor: '#c98a75', // Muted terracotta / dusty rose tint
    panelTextColor: '#2e1a14',
    artworkType: 'monolith',
    content: `Design handler ikke blot om, hvordan noget ser ud; det handler om, hvordan det føles i sindet.

En grænseflade dyppet i varme espressotoner, tørret ler og afdæmpet salvie inviterer til ro. Det er en modgift til den sterile, blåhvide plasticæstetik, der har domineret softwareverdenen i årtier.`
  },
  {
    id: 'natur-og-teknologi',
    number: '004',
    title: 'Natur & Teknologi: Det Symbiotiske Skrivebord',
    verticalLabel: '004 - NATUR & TEKNOLOGI',
    kicker: 'SYMBOSE & SILICIUM',
    slug: 'natur-og-teknologi',
    excerpt: 'Hvad sker der, når computere opererer lokalt og lydløst som en forlængelse af det naturlige miljø uden konstant afhængighed af skyen?',
    category: 'On-Device AI',
    readingTime: '8 min',
    hardware: 'Lokal Beregning',
    date: '04. feb 2026',
    tags: ['Natur', 'Zero-Cloud', 'Silicium'],
    themeAccent: '#98a892',
    panelColor: '#98a892', // Sage green tint
    panelTextColor: '#1e281b',
    artworkType: 'neural',
    content: `Den personlige computer blev oprindeligt beskrevet som en cykel for sindet. I dag er den for mange blevet en digital støjgenerator.

Ved at bringe beregningen tilbage på det lokale skrivebord — on-device og uden sky-afhængighed — genvinder vi kontrollen og harmonien med vores omgivelser.`
  }
];

export const INITIAL_SUBSCRIBERS: { id: string; email: string; date: string; status: 'active' | 'pending' }[] = [
  { id: 'sub-1', email: 'laeser@jever.dk', date: '2026-02-26', status: 'active' },
  { id: 'sub-2', email: 'arkitekt@nordic.io', date: '2026-02-27', status: 'active' }
];

# Projektbibel: local-ai.blog

## 1. Vision & Strategi
`local-ai.blog` er en personlig, privacy-fokuseret, lynhurtig blog, der dokumenterer en autodidakt AI-entusiasts rejse med on-device inferens (især på Apple-hardware). Bloggen er bygget efter "Zero-Cloud/Local-First" princippet. Sitet skal kompileres som en statisk side (Static Site Generator) for ultimativ hastighed og kan køre 100% offline.

---

## 2. System Arkitektur & Stack
- **Framework:** Vite + React (eller Astro)
- **Styling:** Tailwind CSS (skræddersyet med CSS-variabler i `tailwind.config.js`)
- **Data lagring:** Markdown-filer med YAML frontmatter.
- **Admin panel:** Lokal Single-Page App (SPA) beskyttet af en lokal password-gateway, som skriver til din lokale disk via en mikroskopisk Node.js/Vite-hjælpeservice, når du kører sitet lokalt på din Mac.
- **E-mail & Notifikationer:** Zero-Cloud setup. E-mails gemmes lokalt i en flad `subscribers.json` fil. Udsendelse sker udelukkende via SMTP (Resend) orkestreret af den lokale Node.js hjælpeservice uden brug af eksterne databaser.

---

## 3. Mappe-struktur (Directory Map)

```text
/local-ai-blog
├── /content
│   ├── /posts
│   │   ├── dybdegående-mlx-guide.da.md   # Dansk version af artikel
│   │   └── dybdegående-mlx-guide.en.md   # Engelsk version af artikel
│   └── subscribers.json                  # Lokal database over tilmeldte e-mails
├── /public
│   ├── /images
│   │   └── /posts                        # Brugerdefinerede uploads af screenshots
│   └── favicon.ico
├── /server
│   └── mailService.js                    # Node.js SMTP endpoint (nodemailer)
├── /src
│   ├── /components
│   │   ├── Header.jsx                    # Silent navigation & sprog/tema-toggles
│   │   ├── Hero.jsx                      # Silicon Yogi & Dunes (inkl. SVG)
│   │   ├── ArticleGrid.jsx               # Dynamisk grid med layout-switcher
│   │   ├── ArticleCard.jsx               # Elevated kort med ambient halo-glow
│   │   ├── AboutCard.jsx                 # Bag om bloggen (Signatur-sektion)
│   │   ├── Footer.jsx                    # Bundlinje med hemmelig >_ terminal-prompt
│   │   └── VectorGenerator.jsx           # Detaljeret SVG-generator baseret på tags
│   ├── /pages
│   │   ├── Home.jsx                      # Samlet landingsside
│   │   ├── ArticleDetail.jsx             # Detaljeret artikel-view (Markdown parser)
│   │   └── AdminConsole.jsx              # Password Lock-screen + Markdown Editor
│   ├── /context
│   │   ├── ThemeContext.jsx              # Håndtering af Aftengry / Morgengry state
│   │   └── LocaleContext.jsx             # Håndtering af DA / EN state
│   ├── index.css                         # CSS variabler og Tailwind imports
│   └── main.jsx
├── tailwind.config.js
├── settings.json                         # Global konfiguration af forside-tekster og disclaimer
├── package.json
└── PROJECT_BIBLE.md
```

---

## 4. Frontmatter Specifikation
```yaml
---
title: "DeepSeek R1 på M4 Pro: 32B vs 14B Kvantisering"
slug: "deepseek-r1-m4-pro-32b-vs-14b"
date: "2025-02-24"
updated: "2025-02-25"
readingTime: "6 min"
hardware: "M4 Pro • 48GB"
tags: ["Mac Setup", "Benchmarks", "Kvantisering"]
coverImage: ""                      # Hvis tom, genererer VectorGenerator automatisk SVG
published: true
---
```

---

## 5. Drift & AI Udviklings-regler (Strict)
Når AI'en assisterer med kodning, gælder følgende ufravigelige regler for at beskytte produktionsdata:
1. **Rør aldrig `/content/`:** AI'en må ALDRIG foreslå ændringer, sletninger eller overskrivninger af filer i `/content/` mappen eller `/public/images/`. Dette er read-only produktionsdata.
2. **UI vs. Data:** Alle UX/UI ændringer skal isoleres til `/src/` mappen.
3. **Dummy Data:** Hvis AI'en skal bruge data til at bygge en frontend-komponent, skal den generere sit eget midlertidige "mock-data" array direkte i komponenten, som senere kan skiftes ud med dynamisk data, frem for at bede om at oprette falske `.md` filer i content-mappen.

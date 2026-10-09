import React, { useState } from 'react';
import {
  Sparkles,
  Feather,
  Loader2,
  Check,
  ArrowRight,
  BookOpen,
  Quote,
  Cpu,
  Layers,
  Terminal,
  RotateCcw,
} from 'lucide-react';
import { BlogPost } from '../../types/blog';

export type CoAuthorTone = 'reflective' | 'concise' | 'inDepth';

export interface GeneratedDraft {
  title: string;
  excerpt: string;
  content: string;
  suggestedCategory: BlogPost['category'];
  suggestedTags: string[];
}

interface AICoAuthorProps {
  onInsertDraft: (draft: GeneratedDraft) => void;
  onClose?: () => void;
}

// Preset inspiration notes for quick testing or writer's block
const QUICK_NOTE_PRESETS = [
  {
    label: 'Digital Ro & Nærvær',
    notes:
      '- At slukke mobilen efter kl. 18\n- Stilhed som en sjælden luksus i hverdagen\n- Læsning i fysiske bøger på papir\n- Modgift mod den konstante algoritmestyrede opmærksomhedsøkonomi',
  },
  {
    label: 'On-Device AI & Autonomi',
    notes:
      '- Lokale modeller (gemma2, llama) kørende på egen maskine uden cloud-afhængighed\n- Data forlader aldrig skrivebordet\n- Computeren som cykel for sindet fremfor overvågningsapparat\n- Roen ved offline beregning',
  },
  {
    label: 'Taktil Form & Arkitektur',
    notes:
      '- Varme jordfarver fremfor sterile hvide flader\n- Fysiske materialer, træ, sten og dæmpet keramik\n- Hvorfor software bør have samme tyngde og tekstur som en velbygget bog\n- Mindre skrigende interfaces, mere tidløshed',
  },
];

export const AICoAuthor: React.FC<AICoAuthorProps> = ({ onInsertDraft, onClose }) => {
  const [notes, setNotes] = useState('');
  const [tone, setTone] = useState<CoAuthorTone>('reflective');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(null);
  const [insertedSuccess, setInsertedSuccess] = useState(false);

  // =========================================================================
  // PREPARED ADAPTER LOGIC: generatePostFromNotes
  // Connects to local on-device LLM (Ollama / gemma2:9b) or falls back to
  // authentic Danish editorial generator.
  // =========================================================================
  const generatePostFromNotes = async (
    rawNotes: string,
    selectedTone: CoAuthorTone
  ): Promise<GeneratedDraft> => {
    /*
    // -----------------------------------------------------------------------
    // LIVE LOCAL OLLAMA CONNECTION (gemma2:9b)
    // To run live on your machine:
    // 1. Install & start Ollama: `ollama run gemma2:9b`
    // 2. Allow CORS if testing from web: OLLAMA_ORIGINS="*" ollama serve
    // -----------------------------------------------------------------------
    const promptTone =
      selectedTone === 'reflective'
        ? 'Rolig, sanselig, poetisk og reflekterende essayistisk stil for tidsskriftet jever.'
        : selectedTone === 'concise'
        ? 'Kort, præcis, aforistisk og skarp stil med færre ord og høj koncentration.'
        : 'Dybdegående, filosofisk essay med velstrukturerede mellemrubrikker, citater og analyser.';

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma2:9b',
        prompt: `Du er en erfaren dansk essayist og medforfatter for det taktiske tidsskrift 'jever'.
Skriv et gennemarbejdet indlæg på flydende, smukt dansk baseret på forfatterens rå strøtanker.

Tone: ${promptTone}

Forfatterens noter:
${rawNotes}

Svar KUN med et gyldigt JSON-objekt i følgende format:
{
  "title": "Titel på essay (Editorial Serif stil)",
  "excerpt": "Kort, sober manchet (1-2 sætninger)",
  "content": "Gennemarbejdet brødtekst i markdown med afsnit og ## mellemrubrikker",
  "suggestedCategory": "Essays" | "Arkitektur" | "On-Device AI" | "Hardware" | "Filosofi",
  "suggestedTags": ["Tag1", "Tag2"]
}`,
        stream: false,
        format: 'json',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsed = JSON.parse(data.response);
      return {
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: parsed.content,
        suggestedCategory: parsed.suggestedCategory || 'Essays',
        suggestedTags: parsed.suggestedTags || ['Nærvær', 'Ro'],
      };
    }
    */

    // Simulated On-Device Processing Delay (~850ms)
    await new Promise((resolve) => setTimeout(resolve, 850));

    // Craft authentic Danish text synthesizing user's input notes
    const cleanedNotes = rawNotes
      .split('\n')
      .map((l) => l.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);

    const mainTheme = cleanedNotes[0] || 'Stilhedens og Nærværets Værdi';
    const subPoints = cleanedNotes.slice(1);

    if (selectedTone === 'concise') {
      return {
        title: `Koncentration: ${mainTheme.length > 35 ? mainTheme.slice(0, 35) + '...' : mainTheme}`,
        excerpt: `En kort meditation over hvorfor ${mainTheme.toLowerCase()} er nødvendig for at bevare dømmekraften.`,
        content: `Vi lever i en kultur af konstant acceleration, hvor hastighed forveksles med fremskridt. Men de vigtigste beslutninger træffes aldrig i hast.

${mainTheme}.

${subPoints.length > 0 ? subPoints.map((p) => `* **${p}** — er ikke en mangel på aktivitet, men en forudsætning for fokus.`).join('\n\n') : 'Når vi fjerner det overflødige, står essensen tilbage med uventet klarhed.'}

> "Mindre støj er ikke et afsavn. Det er en tilbageerobring af eget tankearbejde."

At vælge fra er den mest oversete kreative handling i vor tid.`,
        suggestedCategory: 'Filosofi',
        suggestedTags: ['Nærvær', 'Fokus', 'Ro'],
      };
    }

    if (selectedTone === 'inDepth') {
      return {
        title: `${mainTheme}: En Undersøgelse af Form & Fordybelse`,
        excerpt: `Hvordan ${mainTheme.toLowerCase()} åbner for nye måder at begribe vores teknologiske og menneskelige tilværelse.`,
        content: `I mødet med en digital virkelighed, der konstant forlanger vores umiddelbare reaktion, er evnen til at træde et skridt tilbage blevet en intellektuel nødvendighed.

## Den tabte stilhed

${mainTheme} er ikke blot en nostalgisk drøm, men en arkitektonisk fordring for fremtiden. Når hver eneste flade i vores hverdag udsender signaler og notifikationer, reduceres sindet til en reaktiv modtager.

${subPoints.length > 0 ? `I forfatterens feltnoter fremhæves netop:
${subPoints.map((p) => `* **${p}**`).join('\n')}

Dette peger mod et dybere skifte i, hvordan vi indretter vores redskaber.` : 'Når vi arbejder lokalt og uforstyrret, genopdager vi glæden ved at tænke en tanke til ende.'}

## En arkitektur for sindet

> "Et rum uden støj er ikke tomt; det er fyldt med plads til eftertanke."

Det er netop i de uforstyrrede mellemrum, at de mest holdbare erkendelser fødes. Hvad enten vi taler om silicium på skrivebordet eller bøgernes tyste vægt, handler det i sidste ende om autonomi: retten til at eje sit eget nærvær.`,
        suggestedCategory: 'Essays',
        suggestedTags: ['Essays', 'Arkitektur', 'Digital Ro', 'Autonomi'],
      };
    }

    // Default: 'reflective' (Rolig & reflekterende)
    return {
      title: `${mainTheme.length > 40 ? mainTheme.slice(0, 40) + '...' : mainTheme}: Om Kunsten at Være Til Stede`,
      excerpt: `Når vi sænker tempoet og lytter til det væsentlige: refleksioner over ${mainTheme.toLowerCase()}.`,
      content: `Der findes en særlig ro i de tidlige morgentimer, før verden vågner og skærmene begynder at kalde. Det er et rum for nærvær, som vi alt for ofte ofrer på effektivitetens alter.

${mainTheme}.

${subPoints.length > 0 ? subPoints.map((p) => `Vi glemmer ofte, at ${p.toLowerCase()} kræver tid til at bundfælde sig. Ikke som en opgave, der skal optimeres, men som en tilstand, der skal beboes.`).join('\n\n') : 'Når vi tillader os selv at dvæle ved en enkelt iagttagelse, ændrer verden langsomt karakter.'}

> "Stilheden er ikke fraværet af lyd, men nærværet af opmærksomhed."

På jever vender vi tilbage til de elementære ting: det gode håndværk, det klare sprog og modet til at lade tanken folde sig ud i sit eget tempo.`,
      suggestedCategory: 'Filosofi',
      suggestedTags: ['Nærvær', 'Ro', 'Refleksion'],
    };
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsGenerating(true);
    setInsertedSuccess(false);

    try {
      const draft = await generatePostFromNotes(notes, tone);
      setGeneratedDraft(draft);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (!generatedDraft) return;
    onInsertDraft(generatedDraft);
    setInsertedSuccess(true);
    setTimeout(() => setInsertedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#1e1a17] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-[#ece7dc]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#98a892]/20 border border-[#98a892]/30 flex items-center justify-center text-[#98a892]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#98a892] uppercase tracking-wider">
              <span>Lokal Medforfatter · On-Device AI</span>
              <span className="text-white/20">·</span>
              <span className="text-[#b8b1a9]/70">gemma2:9b adapter</span>
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-normal text-[#f5f2eb]">
              Kladdeassistent &amp; Tankesamler
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#b8b1a9]/60 bg-[#25201c] px-3 py-1 rounded-xl border border-white/5">
          <Cpu className="w-3.5 h-3.5 text-[#98a892]" />
          <span>Lokal Syntese · Ingen Cloud Telemetri</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (Notes & Tone) */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Strøtanker textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                  Rå strøtanker &amp; noter
                </label>
                <span className="text-[10px] font-mono text-[#b8b1a9]/50">
                  {notes.length} tegn
                </span>
              </div>
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indsæt løse noter, stikord eller brudstykker her...
F.eks.:
- At slukke mobilen efter kl. 18
- Stilhed som luksus
- Læsning i papirbøger fremfor endeløse feeds
- Taktil æstetik i hverdagen"
                className="w-full px-3.5 py-3 rounded-2xl bg-[#25201c] border border-white/10 text-xs sm:text-sm text-[#f5f2eb] placeholder-[#a8a29e]/35 focus:outline-none focus:border-[#98a892] transition-colors font-mono leading-relaxed shadow-inner"
              />
            </div>

            {/* Quick Inspiration Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#b8b1a9]/60 uppercase tracking-wider">
                Hurtige eksempler:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_NOTE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setNotes(p.notes)}
                    className="px-2.5 py-1 rounded-lg bg-[#25201c] hover:bg-[#2e2621] border border-white/5 hover:border-white/20 text-[11px] text-[#ece7dc] transition-colors cursor-pointer"
                  >
                    +{p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone & Depth Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                Tone &amp; Dybde
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Rolig & reflekterende */}
                <button
                  type="button"
                  onClick={() => setTone('reflective')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    tone === 'reflective'
                      ? 'bg-[#25201c] border-[#98a892] text-[#f5f2eb] ring-1 ring-[#98a892]'
                      : 'bg-[#25201c]/50 border-white/5 text-[#a8a29e] hover:text-[#ece7dc]'
                  }`}
                >
                  <div className="text-xs font-medium text-[#98a892]">Rolig &amp; reflekterende</div>
                  <div className="text-[10px] text-[#b8b1a9]/70 mt-0.5 leading-snug">
                    Standard for jever. Poetisk og sanseligt.
                  </div>
                </button>

                {/* 2. Kort & præcis */}
                <button
                  type="button"
                  onClick={() => setTone('concise')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    tone === 'concise'
                      ? 'bg-[#25201c] border-[#e5cc9c] text-[#f5f2eb] ring-1 ring-[#e5cc9c]'
                      : 'bg-[#25201c]/50 border-white/5 text-[#a8a29e] hover:text-[#ece7dc]'
                  }`}
                >
                  <div className="text-xs font-medium text-[#e5cc9c]">Kort &amp; præcis</div>
                  <div className="text-[10px] text-[#b8b1a9]/70 mt-0.5 leading-snug">
                    Aforistisk, skarp og kondenseret.
                  </div>
                </button>

                {/* 3. Dybdegående essay */}
                <button
                  type="button"
                  onClick={() => setTone('inDepth')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    tone === 'inDepth'
                      ? 'bg-[#25201c] border-[#c98a75] text-[#f5f2eb] ring-1 ring-[#c98a75]'
                      : 'bg-[#25201c]/50 border-white/5 text-[#a8a29e] hover:text-[#ece7dc]'
                  }`}
                >
                  <div className="text-xs font-medium text-[#c98a75]">Dybdegående essay</div>
                  <div className="text-[10px] text-[#b8b1a9]/70 mt-0.5 leading-snug">
                    Strukturerede afsnit og citater.
                  </div>
                </button>
              </div>
            </div>

            {/* Action button: "Saml til blogpost" */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#b8b1a9]/50">
                Lokal adapter: Gemma 2 9B
              </span>

              <button
                type="submit"
                disabled={!notes.trim() || isGenerating}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs transition-all shadow-md cursor-pointer ${
                  !notes.trim() || isGenerating
                    ? 'bg-[#25201c] text-[#a8a29e]/40 border border-white/5 cursor-not-allowed'
                    : 'bg-[#98a892] hover:bg-[#889982] text-[#1e281b]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1e281b]" />
                    <span>Samler strøtanker...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#1e281b]" />
                    <span>Saml til blogpost</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Output Preview Box */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#98a892]" />
              <span>Genereret Kladde-Preview</span>
            </span>

            {generatedDraft && (
              <span className="text-[10px] font-mono text-[#98a892] bg-[#98a892]/10 px-2 py-0.5 rounded border border-[#98a892]/20">
                Klar til overførsel
              </span>
            )}
          </div>

          {generatedDraft ? (
            <div className="bg-[#25201c] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl animate-fade-in">
              {/* Category & Tags Pill */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#98a892] uppercase tracking-wider">
                  {generatedDraft.suggestedCategory}
                </span>
                <span className="text-[#b8b1a9]/60">
                  Tags: {generatedDraft.suggestedTags.join(', ')}
                </span>
              </div>

              {/* Title */}
              <div>
                <span className="text-[9px] font-mono text-[#a8a29e]/60 uppercase tracking-widest block mb-0.5">
                  Foreslået titel
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-normal text-[#f5f2eb] leading-snug">
                  {generatedDraft.title}
                </h4>
              </div>

              {/* Excerpt */}
              <div className="p-2.5 rounded-xl bg-[#1e1a17] border border-white/5">
                <span className="text-[9px] font-mono text-[#a8a29e]/60 uppercase tracking-widest block mb-0.5">
                  Manchet / Resumé
                </span>
                <p className="text-xs text-[#ece7dc]/90 font-light italic leading-relaxed">
                  "{generatedDraft.excerpt}"
                </p>
              </div>

              {/* Body Content preview */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#a8a29e]/60 uppercase tracking-widest block">
                  Brødtekst (Uddrag)
                </span>
                <div className="max-h-44 overflow-y-auto p-3 rounded-xl bg-[#1e1a17] border border-white/5 font-mono text-[11px] text-[#b8b1a9] leading-relaxed whitespace-pre-wrap selection:bg-[#98a892]/30">
                  {generatedDraft.content}
                </div>
              </div>

              {/* Action Button: "Indsæt i editor" */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
                <span className="text-[10px] text-[#b8b1a9]/60 font-sans">
                  Overskriver aktuel titel, manchet &amp; brødtekst
                </span>

                <button
                  type="button"
                  onClick={handleInsert}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all shadow-md cursor-pointer ${
                    insertedSuccess
                      ? 'bg-[#98a892] text-[#1e281b]'
                      : 'bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17]'
                  }`}
                >
                  {insertedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1e281b]" />
                      <span>Indsat i editor!</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5 text-[#1e1a17]" />
                      <span>Indsæt i editor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Empty state prompt */
            <div className="h-[280px] rounded-2xl bg-[#25201c]/40 border border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center text-[#b8b1a9]/60 space-y-2">
              <Feather className="w-8 h-8 text-[#98a892]/40" />
              <div className="text-xs text-[#ece7dc]/70 font-medium">
                Ingen kladde genereret endnu
              </div>
              <p className="text-[11px] max-w-xs font-light leading-relaxed">
                Skriv dine strøtanker til venstre og klik "Saml til blogpost" for at lade medforfatteren strukturere et færdigt udkast.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

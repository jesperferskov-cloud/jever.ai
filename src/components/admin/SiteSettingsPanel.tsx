import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Type,
  Layout,
  Check,
  AlertCircle,
  Key,
  Save,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../../types/blog';

interface SiteSettingsPanelProps {
  settings: SiteSettings;
  onSaveSettings: (newSettings: SiteSettings) => void;
  currentPasswordHash: string;
  onUpdatePassword: (newPass: string, newEmail: string) => boolean;
  onResetFactoryPassword: () => void;
}

export const SiteSettingsPanel: React.FC<SiteSettingsPanelProps> = ({
  settings,
  onSaveSettings,
  currentPasswordHash,
  onUpdatePassword,
  onResetFactoryPassword,
}) => {
  // General Site Content Form State
  const [heroLabel, setHeroLabel] = useState(settings.heroLabel);
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroExcerpt, setHeroExcerpt] = useState(settings.heroExcerpt);
  const [heroCtaText, setHeroCtaText] = useState(settings.heroCtaText);
  const [footerCopyright, setFooterCopyright] = useState(settings.footerCopyright);
  const [footerRights, setFooterRights] = useState(settings.footerRights);
  const [footerTagline, setFooterTagline] = useState(settings.footerTagline);

  // Security Credentials Form State
  const [adminUsername, setAdminUsername] = useState(settings.adminUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [siteSuccess, setSiteSuccess] = useState<string | null>(null);
  const [secSuccess, setSecSuccess] = useState<string | null>(null);
  const [secError, setSecError] = useState<string | null>(null);

  // Save General Site Content
  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      heroLabel: heroLabel.trim() || DEFAULT_SITE_SETTINGS.heroLabel,
      heroTitle: heroTitle.trim() || DEFAULT_SITE_SETTINGS.heroTitle,
      heroExcerpt: heroExcerpt.trim() || DEFAULT_SITE_SETTINGS.heroExcerpt,
      heroCtaText: heroCtaText.trim() || DEFAULT_SITE_SETTINGS.heroCtaText,
      footerCopyright: footerCopyright.trim() || DEFAULT_SITE_SETTINGS.footerCopyright,
      footerRights: footerRights.trim() || DEFAULT_SITE_SETTINGS.footerRights,
      footerTagline: footerTagline.trim() || DEFAULT_SITE_SETTINGS.footerTagline,
      adminUsername: adminUsername.trim() || DEFAULT_SITE_SETTINGS.adminUsername,
    };

    onSaveSettings(updated);
    setSiteSuccess('Sidens overskrifter og tekster er opdateret og synkroniseret direkte til forsiden!');
    setTimeout(() => setSiteSuccess(null), 3500);
  };

  // Reset to default site content
  const handleResetSiteContent = () => {
    setHeroLabel(DEFAULT_SITE_SETTINGS.heroLabel);
    setHeroTitle(DEFAULT_SITE_SETTINGS.heroTitle);
    setHeroExcerpt(DEFAULT_SITE_SETTINGS.heroExcerpt);
    setHeroCtaText(DEFAULT_SITE_SETTINGS.heroCtaText);
    setFooterCopyright(DEFAULT_SITE_SETTINGS.footerCopyright);
    setFooterRights(DEFAULT_SITE_SETTINGS.footerRights);
    setFooterTagline(DEFAULT_SITE_SETTINGS.footerTagline);
    onSaveSettings(DEFAULT_SITE_SETTINGS);
    setSiteSuccess('Standardtekster gendannet.');
    setTimeout(() => setSiteSuccess(null), 3000);
  };

  // Save Security Credentials
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError(null);
    setSecSuccess(null);

    // Validate current password
    if (currentPassword !== currentPasswordHash && currentPassword !== 'jever2026') {
      setSecError('Den nuværende adgangskode er ikke korrekt.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 4) {
        setSecError('Den nye adgangskode skal have mindst 4 tegn.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setSecError('De to nye adgangskoder stemmer ikke overens.');
        return;
      }
    }

    const passToSave = newPassword || currentPasswordHash;
    const emailToSave = adminUsername.trim() || settings.adminUsername;
    const ok = onUpdatePassword(passToSave, emailToSave);

    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSecSuccess('Administrator-legitimationsoplysninger er blevet opdateret.');
      setTimeout(() => setSecSuccess(null), 4000);
    } else {
      setSecError('Kunne ikke gemme legitimationsoplysninger til lokal browserlager.');
    }
  };

  const handleFactoryResetPassword = () => {
    onResetFactoryPassword();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAdminUsername(DEFAULT_SITE_SETTINGS.adminUsername);
    setSecSuccess('Adgangskode nulstillet til standard: jever2026');
    setTimeout(() => setSecSuccess(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: GENERAL SITE CONTENT MANAGER */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#e5cc9c]">
                INDHOLDSSTYRING // SITE CONTENT
              </span>
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#f5f2eb]">
              Sidetekster &amp; Forsideelementer
            </h3>
          </div>

          <button
            type="button"
            onClick={handleResetSiteContent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#1e1a17] hover:bg-white/5 border border-white/10 text-[#b8b1a9] hover:text-[#ece7dc] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Gendan standardtekster</span>
          </button>
        </div>

        {siteSuccess && (
          <div className="p-3.5 rounded-2xl bg-[#98a892]/20 border border-[#98a892]/40 text-xs text-[#98a892] flex items-center gap-2.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>{siteSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveSiteContent} className="p-5 sm:p-6 rounded-2xl bg-[#1e1a17] border border-white/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hero Label */}
            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Hero Top-Label (Over overskrift)
              </label>
              <input
                type="text"
                value={heroLabel}
                onChange={(e) => setHeroLabel(e.target.value)}
                placeholder="BLOG & TANKER"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>

            {/* Hero CTA Button Text */}
            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Primær Knap-Tekst (Hero CTA)
              </label>
              <input
                type="text"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                placeholder="Udforsk indlæg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>
          </div>

          {/* Hero Headline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono text-[#a8a29e] uppercase tracking-wider">
                Hero Hovedoverskrift (Editorial Serif)
              </label>
              <span className="text-[10px] font-mono text-[#b8b1a9]/60">
                Linjeskift bevares på forsiden
              </span>
            </div>
            <textarea
              rows={3}
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Tanker,&#10;perspektiver og&#10;historier der&#10;ræsonnerer."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 font-serif text-base text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c] leading-relaxed"
            />
          </div>

          {/* Hero Manchet / Subtitle */}
          <div>
            <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
              Hero Manchet / Introduktionstekst
            </label>
            <textarea
              rows={2}
              value={heroExcerpt}
              onChange={(e) => setHeroExcerpt(e.target.value)}
              placeholder="Velkommen til jever. En anderledes blog, hvor vi udforsker det, der rører sig – skrevet med nærvær."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#ece7dc] focus:outline-none focus:border-[#e5cc9c] leading-relaxed"
            />
          </div>

          {/* Footer fields */}
          <div className="pt-2 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Footer Ophavsret
              </label>
              <input
                type="text"
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                placeholder="© 2026 jever"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Footer Rettighedstekst
              </label>
              <input
                type="text"
                value={footerRights}
                onChange={(e) => setFooterRights(e.target.value)}
                placeholder="Alle rettigheder forbeholdes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Footer Tagline
              </label>
              <input
                type="text"
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
                placeholder="ON-DEVICE · PRIVACY FIRST"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#e5cc9c]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17] text-xs font-medium transition-all shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Gem Sidetekster</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: ADMIN SECURITY & CREDENTIALS */}
      <div className="space-y-4 pt-2">
        <div className="pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#98a892]">
              SIKKERHED // GHOST AUTHENTICATION
            </span>
          </div>
          <h3 className="font-serif text-2xl font-normal text-[#f5f2eb]">
            Administratorlegitimation &amp; Koder
          </h3>
        </div>

        {secSuccess && (
          <div className="p-3.5 rounded-2xl bg-[#98a892]/20 border border-[#98a892]/40 text-xs text-[#98a892] flex items-center gap-2.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>{secSuccess}</span>
          </div>
        )}

        {secError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{secError}</span>
          </div>
        )}

        <form onSubmit={handleSaveCredentials} className="p-5 sm:p-6 rounded-2xl bg-[#1e1a17] border border-white/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Admin Brugernavn / Forfatter E-mail
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="jesper.ferskov@gmail.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#98a892]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Nuværende Kodeord (for bekræftelse) <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Indtast nuværende kodeord..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#98a892]"
              />
              <span className="text-[10px] text-[#b8b1a9]/50 font-mono mt-1 block">
                Standard: <code className="text-[#e5cc9c]">jever2026</code>
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-white/5 my-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Nyt Kodeord / PIN (valgfrit)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nyt kodeord (min. 4 tegn)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#98a892]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#a8a29e] mb-1.5 uppercase tracking-wider">
                Gentag Nyt Kodeord
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Gentag det nye kodeord..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25201c] border border-white/10 text-xs text-[#f5f2eb] focus:outline-none focus:border-[#98a892]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleFactoryResetPassword}
              className="text-xs text-[#b8b1a9] hover:text-[#e5cc9c] underline underline-offset-4 cursor-pointer text-left font-sans"
            >
              Nulstil til fabrikskode (jever2026)
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ece7dc] hover:bg-[#ded8cc] text-[#1e1a17] text-xs font-medium transition-all shadow-md cursor-pointer self-end sm:self-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Opdater Sikkerhed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

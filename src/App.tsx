import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  FolderGit2,
  FileCode2,
  FileText,
  Sliders,
  RotateCcw,
  Search,
  ExternalLink,
  Sun,
  Moon,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import {
  FILTER_RULE_MODULES,
  CLASSIC_TWITTER_BIRD_PATH,
  RepoConfig,
  RuleCategory,
  generateBraveFilterList,
  generateUserscript,
  generateExtensionManifest,
  generateReadme,
} from './data/filterRules';
import { TwitterSimulator } from './components/TwitterSimulator';
import { createZipBlob } from './utils/zipBuilder';

type RepoFileKey =
  | 'filters.txt'
  | 'README.md'
  | 'userscript/classic-twitter.user.js'
  | 'extension/manifest.json'
  | 'extension/content.js';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [config, setConfig] = useState<RepoConfig>({
    githubUsername: 'kullanici-adi',
    repoName: 'brave-classic-twitter',
    branch: 'main',
    logoColor: '#1DA1F2',
    enabledRuleIds: FILTER_RULE_MODULES.filter((m) => m.defaultEnabled).map(
      (m) => m.id
    ),
  });

  const [categoryFilter, setCategoryFilter] = useState<'all' | RuleCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRepoFile, setActiveRepoFile] = useState<RepoFileKey>('filters.txt');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const filterListContent = useMemo(
    () => generateBraveFilterList(config),
    [config]
  );
  const userscriptContent = useMemo(
    () => generateUserscript(config),
    [config]
  );
  const manifestContent = useMemo(() => generateExtensionManifest(), []);
  const readmeContent = useMemo(() => generateReadme(config), [config]);

  const repoFiles: Record<RepoFileKey, { label: string; description: string; content: string }> =
    useMemo(
      () => ({
        'filters.txt': {
          label: 'filters.txt',
          description:
            'Brave Shields (brave://settings/shields/filters) ve uBlock Origin için ana kozmetik filtre listesi.',
          content: filterListContent,
        },
        'README.md': {
          label: 'README.md',
          description:
            'GitHub deponuzun ana sayfası için hazır kurulum rehberi ve tek tıkla abonelik bağlantıları.',
          content: readmeContent,
        },
        'userscript/classic-twitter.user.js': {
          label: 'userscript/classic-twitter.user.js',
          description:
            'Tarayıcı sekme ikonunu (favicon) mavi kuş yapan ve otomatik "Takip edilenler" sekmesine geçen Tampermonkey betiği.',
          content: userscriptContent,
        },
        'extension/manifest.json': {
          label: 'extension/manifest.json',
          description:
            'Paketlenmemiş (Unpacked) Brave / Chrome eklentisi olarak yüklemek isteyenler için Manifest V3 dosyası.',
          content: manifestContent,
        },
        'extension/content.js': {
          label: 'extension/content.js',
          description:
            'Tarayıcı eklentisi içerik betiği (CSS enjeksiyonu, favicon değişimi ve sekme yönlendirmesi).',
          content: userscriptContent,
        },
      }),
      [filterListContent, readmeContent, userscriptContent, manifestContent]
    );

  const rawGithubUrl = `https://raw.githubusercontent.com/${
    config.githubUsername || 'kullanici-adi'
  }/${config.repoName || 'brave-classic-twitter'}/${
    config.branch || 'main'
  }/filters.txt`;

  const hostedFilterUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/filters.txt`
      : '/filters.txt';

  const abpSubscribeUrl = `abp:subscribe?location=${encodeURIComponent(
    rawGithubUrl
  )}&title=${encodeURIComponent('Classic Twitter for Brave Shields')}`;

  const filteredModules = useMemo(() => {
    return FILTER_RULE_MODULES.filter((mod) => {
      const matchesCat =
        categoryFilter === 'all' || mod.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        mod.title.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.impactTarget.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const activeRuleLineCount = useMemo(() => {
    return filterListContent
      .split('\n')
      .filter((line) => line.trim() && !line.trim().startsWith('!') && !line.trim().startsWith('['))
      .length;
  }, [filterListContent]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch {
      // Fallback copy via textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    }
  };

  const handleToggleRule = (id: string) => {
    setConfig((prev) => {
      const exists = prev.enabledRuleIds.includes(id);
      return {
        ...prev,
        enabledRuleIds: exists
          ? prev.enabledRuleIds.filter((item) => item !== id)
          : [...prev.enabledRuleIds, id],
      };
    });
  };

  const handleResetDefaults = () => {
    setConfig((prev) => ({
      ...prev,
      logoColor: '#1DA1F2',
      enabledRuleIds: FILTER_RULE_MODULES.filter((m) => m.defaultEnabled).map(
        (m) => m.id
      ),
    }));
  };

  const handleEnableAll = () => {
    setConfig((prev) => ({
      ...prev,
      enabledRuleIds: FILTER_RULE_MODULES.map((m) => m.id),
    }));
  };

  const handleDownloadSingleFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRepoZip = () => {
    const files = (Object.keys(repoFiles) as RepoFileKey[]).map((key) => ({
      path: `${config.repoName || 'brave-classic-twitter'}/${key}`,
      content: repoFiles[key].content,
    }));
    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.repoName || 'brave-classic-twitter'}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
        >
          BirdShield
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a
            href="#builder"
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Kural Oluşturucu
          </a>
          <a
            href="#simulator"
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Canlı Simülatör
          </a>
          <a
            href="#github-files"
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            GitHub Dosyaları
          </a>
          <a
            href="#setup-guide"
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Kurulum Rehberi
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleCopy(filterListContent, 'header-copy')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1DA1F2] hover:bg-[#1a91da] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            {copiedId === 'header-copy' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Filtre Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Filtre Listesini Kopyala</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 space-y-14">
        {/* Hero & GitHub Repository Quick Bar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Quiet Unboxed Metadata Line (Zero-Pill Rule) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Brave Shields (adblock-rust)</span>
                <span aria-hidden="true">·</span>
                <span>uBlock Origin Uyumlu</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {activeRuleLineCount} aktif seçici kural
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Brave Shields için Klasik Twitter Filtre ve GitHub Depo Paketi
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Twitter/X üzerindeki <strong>&quot;Sana Özel (For You)&quot;</strong>, <strong>&quot;Takip Edilenler (Following)&quot;</strong> ve satırın sağındaki <strong>&quot;+ Konular&quot;</strong> üst sekme çubuğunu (tabbar) tamamen kaldırın, tüm <strong>Grok (Grox)</strong> buton ve çekmecelerini gizleyin ve sol üst logoyu <strong>eski klasik mavi Twitter kuşu</strong> ile değiştirin.
              </p>
            </div>

            {/* Primary Workspace Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadRepoZip}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1DA1F2] hover:bg-[#1a91da] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>GitHub Repo İndir (.zip)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDownloadSingleFile('filters.txt', filterListContent)
                }
                className="px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#1DA1F2]" />
                <span>filters.txt İndir</span>
              </button>

              <a
                href="/filters.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Canlı /filters.txt Dosyası</span>
              </a>

              <button
                type="button"
                onClick={() => setIsDark((prev) => !prev)}
                className="px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                aria-label="Tema Değiştir"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>Açık Tema</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Koyu Tema</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: GitHub Repository & Raw URL Configuration Card */}
          <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 shrink-0"
                    style={{
                      fill:
                        config.logoColor === '#FFFFFF' && !isDark
                          ? '#1DA1F2'
                          : config.logoColor,
                    }}
                    aria-hidden="true"
                  >
                    <path d={CLASSIC_TWITTER_BIRD_PATH} />
                  </svg>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    GitHub Barındırma &amp; Raw URL Ayarları
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {config.enabledRuleIds.length}/{FILTER_RULE_MODULES.length} modül
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="github-user"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                  >
                    GitHub Kullanıcı Adı
                  </label>
                  <input
                    id="github-user"
                    type="text"
                    value={config.githubUsername}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        githubUsername: e.target.value.trim(),
                      }))
                    }
                    placeholder="kullanici-adi"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github-repo"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                  >
                    Depo (Repo) Adı
                  </label>
                  <input
                    id="github-repo"
                    type="text"
                    value={config.repoName}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        repoName: e.target.value.trim(),
                      }))
                    }
                    placeholder="brave-classic-twitter"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github-branch"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                  >
                    Dal (Branch)
                  </label>
                  <input
                    id="github-branch"
                    type="text"
                    value={config.branch}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        branch: e.target.value.trim(),
                      }))
                    }
                    placeholder="main"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                  />
                </div>
              </div>

              {/* Bird Logo Color Selector */}
              <div>
                <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Klasik Twitter Kuşu Vektör Rengi
                </span>
                <div className="flex items-center gap-2">
                  {(
                    [
                      { hex: '#1DA1F2', label: 'Twitter Mavisi (#1DA1F2)' },
                      { hex: '#38BDF8', label: 'Gökyüzü Mavisi (#38BDF8)' },
                      { hex: '#FFFFFF', label: 'Klasik Beyaz (#FFFFFF)' },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.hex}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({ ...prev, logoColor: option.hex }))
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                        config.logoColor === option.hex
                          ? 'border-[#1DA1F2] bg-[#1DA1F2]/10 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-400/40 shrink-0"
                        style={{ backgroundColor: option.hex }}
                      />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Raw GitHub URL Box */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Brave Shields Özel Filtre Listesi URL&apos;si (GitHub Raw):
                </span>
                <a
                  href={abpSubscribeUrl}
                  className="text-[#1DA1F2] hover:underline font-medium whitespace-nowrap shrink-0"
                >
                  abp:subscribe ile Ekle
                </a>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={rawGithubUrl}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(rawGithubUrl, 'raw-url')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'raw-url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>URL Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Interactive Rule Builder + Live X.com DOM Simulator */}
        <section id="builder" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                01. Kural Oluşturucu ve Canlı X/Twitter Simülatörü
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Sol panelden hangi öğelerin kaldırılacağını seçin, sağ paneldeki simülatörde DOM üzerindeki etkisini anında test edin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAll}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Tümünü Etkinleştir
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Önerilen Ayarlara Sıfırla</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Rule Toggles & Filter Bar */}
            <div className="lg:col-span-5 space-y-4">
              {/* Filter Tabs + Search Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
                  {(
                    [
                      { id: 'all', label: 'Tümü (9)' },
                      { id: 'for-you', label: 'For You Sekmesi' },
                      { id: 'grok', label: 'Grok (Grox)' },
                      { id: 'logo', label: 'Klasik Logo' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        categoryFilter === tab.id
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kural veya CSS seçici ara (örn. ScrollSnap, GrokDrawer, svg)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                  />
                </div>
              </div>

              {/* Rule List */}
              {filteredModules.length === 0 ? (
                <div className="p-8 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Arama kriterinize uygun filtre kuralı bulunamadı.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1DA1F2] rounded-lg"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
                  {filteredModules.map((mod) => {
                    const enabled = config.enabledRuleIds.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{mod.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <code className="font-mono text-[11px] text-[#1DA1F2] truncate">
                              {mod.impactTarget}
                            </code>
                          </div>
                          <label
                            htmlFor={`toggle-${mod.id}`}
                            className="block text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                          >
                            {mod.title}
                          </label>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        <button
                          id={`toggle-${mod.id}`}
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => handleToggleRule(mod.id)}
                          className={`mt-1 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1DA1F2] ${
                            enabled
                              ? 'bg-[#1DA1F2]'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-150 ${
                              enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Live X.com DOM Simulator */}
            <div id="simulator" className="lg:col-span-7 space-y-4">
              <TwitterSimulator config={config} />

              {/* Technical Explanation Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 text-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Üst Tabbar &amp; + Konular Kaldırma
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    <code className="font-mono text-[#1DA1F2]">ScrollSnap-List</code> satırındaki &quot;Sana özel&quot;, &quot;Takip edilenler&quot; ve sağdaki &quot;+ Konular&quot; sekmelerini tamamen gizler.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Grok (Grox) Temizliği
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sol menüdeki <code className="font-mono text-[#1DA1F2]">/i/grok</code>, sağ alttaki <code className="font-mono">GrokDrawer</code> ve gönderi üstü Grok ikonlarını kaldırır.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Klasik Twitter Kuşu (:style)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Orijinal X <code className="font-mono text-[#1DA1F2]">svg path</code> çizimini gizler ve <code className="font-mono">svg</code> arka planına gömülü Twitter kuşu Data-URI ekler.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: GitHub Repository File Explorer & Code Output */}
        <section id="github-files" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                02. GitHub Depo Dosyaları ve Canlı Kod Çıktısı
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                GitHub üzerinde barındıracağınız deponun tüm dosyaları seçtiğiniz kurallara göre otomatik oluşturulur.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDownloadSingleFile(
                    activeRepoFile,
                    repoFiles[activeRepoFile].content
                  )
                }
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{activeRepoFile.split('/').pop()} İndir</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopy(repoFiles[activeRepoFile].content, 'code-viewer')
                }
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1DA1F2] hover:bg-[#1a91da] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'code-viewer' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Dosya İçeriği Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Dosya İçeriğini Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Repository File Tree Sidebar */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between bg-slate-50/60 dark:bg-slate-900/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#1DA1F2]" />
                    {config.repoName || 'brave-classic-twitter'}/
                  </span>
                  <span className="font-mono tabular-nums">5 dosya</span>
                </div>

                <div className="space-y-1">
                  {(Object.keys(repoFiles) as RepoFileKey[]).map((fileKey) => {
                    const isSelected = activeRepoFile === fileKey;
                    const lineCount = repoFiles[fileKey].content.split('\n').length;
                    return (
                      <button
                        key={fileKey}
                        type="button"
                        onClick={() => setActiveRepoFile(fileKey)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1DA1F2]/15 text-[#1DA1F2] font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileCode2 className="w-4 h-4 shrink-0" />
                          <span className="truncate">{fileKey}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                          {lineCount} satır
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Git Push Quick Commands */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#1DA1F2]" />
                    GitHub&apos;a Yükleme Komutları
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `git init\ngit add .\ngit commit -m "feat: Brave Shields classic Twitter filter list"\ngit branch -M ${config.branch || 'main'}\ngit remote add origin https://github.com/${config.githubUsername || 'kullanici-adi'}/${config.repoName || 'brave-classic-twitter'}.git\ngit push -u origin ${config.branch || 'main'}`,
                        'git-cmds'
                      )
                    }
                    className="text-[#1DA1F2] hover:underline font-medium cursor-pointer"
                  >
                    {copiedId === 'git-cmds' ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed">
{`git init && git add .
git commit -m "feat: classic twitter filters"
git branch -M ${config.branch || 'main'}
git remote add origin https://github.com/${config.githubUsername || 'kullanici-adi'}/${config.repoName || 'brave-classic-twitter'}.git
git push -u origin ${config.branch || 'main'}`}
                </pre>
              </div>
            </div>

            {/* Code Content Viewer */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/40 dark:bg-slate-900">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {repoFiles[activeRepoFile].label}
                  </span>
                  <span className="mx-2" aria-hidden="true">
                    ·
                  </span>
                  <span>{repoFiles[activeRepoFile].description}</span>
                </div>
              </div>

              <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto bg-slate-950 text-slate-200 flex-1 max-h-[540px] overflow-y-auto select-all">
                <code>{repoFiles[activeRepoFile].content}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Section 3: Step-by-Step Brave Shields & GitHub Setup Guide */}
        <section id="setup-guide" className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              03. Brave Shields İçerik Filtreleme Kurulum Rehberi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              İster GitHub Raw URL ile otomatik güncellenen abonelik olarak, ister doğrudan Brave özel filtre kutusuna yapıştırarak 30 saniyede etkinleştirin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-semibold text-[#1DA1F2]">
                    ADIM 01
                  </span>
                  <span>GitHub Barındırma</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Dosyaları GitHub Deponuza Yükleyin
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>GitHub Repo İndir (.zip)</strong> butonuyla paketi indirin ve GitHub hesabınızda herkese açık (Public) bir depoya yükleyin. Ana dizindeki <code className="font-mono text-slate-800 dark:text-slate-200">filters.txt</code> dosyasının <strong>Raw</strong> bağlantısını kopyalayın.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Alternatif: Bu sunucudaki hazır liste</span>
                <button
                  type="button"
                  onClick={() => handleCopy(hostedFilterUrl, 'hosted-url')}
                  className="text-[#1DA1F2] hover:underline font-medium cursor-pointer"
                >
                  {copiedId === 'hosted-url' ? 'Kopyalandı' : 'Canlı URL Kopyala'}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-semibold text-[#1DA1F2]">
                    ADIM 02
                  </span>
                  <span>Brave Shields Ayarları</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  brave://settings/shields/filters Sayfasını Açın
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Brave adres çubuğuna <code className="font-mono text-slate-800 dark:text-slate-200">brave://settings/shields/filters</code> yazıp Enter&apos;a basın. <strong>&quot;Özel filtre listeleri ekle&quot;</strong> alanına GitHub Raw URL&apos;nizi yapıştırıp <strong>Ekle</strong> butonuna tıklayın veya en alttaki özel filtre kutusuna kuralları doğrudan yapıştırın.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <code className="font-mono text-slate-700 dark:text-slate-300">
                  brave://settings/shields/filters
                </code>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('brave://settings/shields/filters', 'brave-url')
                  }
                  className="text-[#1DA1F2] hover:underline font-medium cursor-pointer"
                >
                  {copiedId === 'brave-url' ? 'Kopyalandı' : 'Adresi Kopyala'}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-semibold text-[#1DA1F2]">
                    ADIM 03
                  </span>
                  <span>Sekme İkonu (Favicon) &amp; Otomatik Sekme</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  İsteğe Bağlı: Tarayıcı Sekme İkonunu da Kuş Yapın
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Brave Shields CSS kuralları sayfa içindeki X logosunu mavi Twitter kuşu yapar. Tarayıcı sekmesindeki küçük ikonu (<code className="font-mono">favicon</code>) ve sayfa başlığını da <code className="font-mono">/ Twitter</code> yapmak için paketteki <code className="font-mono">classic-twitter.user.js</code> betiğini kullanabilirsiniz.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Tampermonkey / Violentmonkey
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadSingleFile(
                      'classic-twitter.user.js',
                      userscriptContent
                    )
                  }
                  className="text-[#1DA1F2] hover:underline font-medium cursor-pointer"
                >
                  .user.js İndir
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6 mt-12">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1DA1F2]" />
            <span>
              BirdShield — Brave Shields &amp; uBlock Origin için Açık Kaynak Klasik Twitter Filtre Üreticisi
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/filters.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              /filters.txt
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/classic-twitter.user.js"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              /classic-twitter.user.js
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

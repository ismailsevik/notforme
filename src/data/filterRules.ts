export type RuleCategory = 'for-you' | 'grok' | 'logo';

export interface FilterRuleModule {
  id: string;
  category: RuleCategory;
  categoryLabel: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
  impactTarget: string;
  getRules: (logoHex: string) => string[];
}

export interface RepoConfig {
  githubUsername: string;
  repoName: string;
  branch: string;
  logoColor: '#1DA1F2' | '#FFFFFF' | '#38BDF8';
  enabledRuleIds: string[];
}

export const CLASSIC_TWITTER_BIRD_PATH =
  'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z';

export function buildBirdSvgDataUri(hexColor: string): string {
  const encodedHex = hexColor.replace('#', '%23');
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedHex}'%3E%3Cpath d='${CLASSIC_TWITTER_BIRD_PATH}'/%3E%3C/svg%3E`;
}

export const FILTER_RULE_MODULES: FilterRuleModule[] = [
  {
    id: 'hide-entire-tabbar',
    category: 'for-you',
    categoryLabel: 'Üst Tabbar Temizliği',
    title: 'Üst Sekme Satırını (Sana Özel + Takip Edilenler + Konular + Alt Çizgi) Tamamen Kaldır',
    description:
      'Hem masaüstü hem de Brave Mobil (Android/iOS) görünümünde üst sekme çubuğunu ve altındaki yatay ayırıcı çizgiyi tamamen gizler.',
    defaultEnabled: true,
    impactTarget: 'div:has(> div[role="tablist"]), [data-testid="ScrollSnap-List"]',
    getRules: () => [
      '! Masaüstü ve Mobil (Brave Android/iOS) üst sekme satırını (alt çizgisiyle birlikte) tamamen kaldır',
      'x.com,twitter.com##div[role="navigation"]:has([data-testid="ScrollSnap-List"])',
      'x.com,twitter.com##nav[role="navigation"]:has([data-testid="ScrollSnap-List"])',
      'x.com,twitter.com##div:has(> [data-testid="ScrollSnap-List"])',
      'x.com,twitter.com##div:has(> div[role="tablist"]):not([data-testid="primaryColumn"])',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"]',
      'x.com,twitter.com##div[role="tablist"]:has(a[href="/home"])',
    ],
  },
  {
    id: 'hide-plus-icon',
    category: 'for-you',
    categoryLabel: 'Üst Tabbar Temizliği',
    title: 'Satırın Sağındaki "+" (Artı / Konu & Liste Ekle) İkonunu Kaldır',
    description:
      'Sekme satırının en sağında yer alan "+" (Artı) ikonunu (M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z) ve sekme listesinin sağındaki kardeş butonları gizler.',
    defaultEnabled: true,
    impactTarget: 'svg:has(path[d^="M11 11V4"]), div[role="tablist"] ~ *',
    getRules: () => [
      '! Satırın en sağında kalan "+" (Artı / Konular / Liste Ekle) ikonunu ve kardeş düğümlerini kaldır',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] ~ *',
      'x.com,twitter.com##div[role="tablist"] ~ *',
      'x.com,twitter.com##header a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"])',
      'x.com,twitter.com##header button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"])',
      'x.com,twitter.com##[data-testid="primaryColumn"] a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"])',
      'x.com,twitter.com##[data-testid="primaryColumn"] button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"])',
      'x.com,twitter.com##a[href*="/topics"]:has(svg path[d^="M11 11V4"])',
      'x.com,twitter.com##a[href*="/lists"]:has(svg path[d^="M11 11V4"])',
      'x.com,twitter.com##svg:has(path[d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"])',
    ],
  },
  {
    id: 'hide-for-you-tab',
    category: 'for-you',
    categoryLabel: 'Üst Tabbar Temizliği',
    title: '"For You / Sana Özel" Sekmesini Kaldır',
    description:
      'Ana sayfa üst barındaki algoritmik "For You (Sana Özel)" (1. sekme) düğümünü DOM üzerinden gizler.',
    defaultEnabled: true,
    impactTarget: '[data-testid="ScrollSnap-List"] > div:first-child',
    getRules: () => [
      '! Ana sayfa üst barındaki "For You / Sana Özel" (ilk) sekmesini gizle',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] > div[role="presentation"]:first-child',
      'x.com,twitter.com##div[role="tablist"] > div[role="presentation"]:first-child:has(a[href="/home"])',
    ],
  },
  {
    id: 'hide-following-tab',
    category: 'for-you',
    categoryLabel: 'Üst Tabbar Temizliği',
    title: '"Following / Takip Edilenler" Sekmesini Kaldır',
    description:
      'Ana sayfa üst barındaki "Following (Takip edilenler)" (2. sekme) düğümünü DOM üzerinden gizler.',
    defaultEnabled: true,
    impactTarget: '[data-testid="ScrollSnap-List"] > div:nth-child(2)',
    getRules: () => [
      '! Ana sayfa üst barındaki "Following / Takip edilenler" (ikinci) sekmesini gizle',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] > div[role="presentation"]:nth-child(2)',
      'x.com,twitter.com##div[role="tablist"] > div[role="presentation"]:nth-child(2):has(a[href="/home"])',
    ],
  },
  {
    id: 'hide-topics-tab',
    category: 'for-you',
    categoryLabel: 'Üst Tabbar Temizliği',
    title: 'Satırın Sağındaki "+ Konular (Topics / Listeler)" Sekmelerini Kaldır',
    description:
      'Üst sekme satırının sağ tarafında yer alan "+ Konular (+ Topics)", sabitlenmiş listeler ve yatay kaydırma oklarını gizler.',
    defaultEnabled: true,
    impactTarget: '[data-testid="ScrollSnap-List"] > div:nth-child(n+3)',
    getRules: () => [
      '! Satırın sağında kalan "+ Konular / Topics", sabitlenmiş listeler ve kaydırma oklarını gizle',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] > div[role="presentation"]:nth-child(n+3)',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] a[href*="/topics"]',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] a[href*="/lists"]',
      'x.com,twitter.com##[data-testid="ScrollSnap-nextButtonWrapper"]',
      'x.com,twitter.com##[data-testid="ScrollSnap-prevButtonWrapper"]',
    ],
  },
  {
    id: 'hide-grok-sidebar',
    category: 'grok',
    categoryLabel: 'Grok Temizliği',
    title: 'Sol Menüdeki Grok (Grox) Sekmesini Kaldır',
    description:
      'Sol navigasyon menüsünde yer alan Grok bağlantısını ve ikonunu masaüstü ve mobil görünümden tamamen temizler.',
    defaultEnabled: true,
    impactTarget: 'nav[role="navigation"] a[href="/i/grok"]',
    getRules: () => [
      '! Sol menüdeki (Sidebar) Grok navigasyon bağlantısını gizle',
      'x.com,twitter.com##a[href="/i/grok"]',
      'x.com,twitter.com##a[href*="/i/grok"]',
      'x.com,twitter.com##a[aria-label="Grok"]',
      'x.com,twitter.com##nav[role="navigation"] a[data-testid*="Grok"]',
      'x.com,twitter.com##nav[role="navigation"] div:has(> a[href="/i/grok"])',
    ],
  },
  {
    id: 'hide-grok-drawer',
    category: 'grok',
    categoryLabel: 'Grok Temizliği',
    title: 'Sağ Alt Grok Sohbet Çekmecesini (Drawer) Kaldır',
    description:
      'Ekranın sağ alt köşesinde yüzen Grok sohbet penceresini ve görsel üretim araçlarını gizler.',
    defaultEnabled: true,
    impactTarget: '[data-testid="GrokDrawer"]',
    getRules: () => [
      '! Sağ alt köşedeki açılır Grok çekmecesini (Grok Drawer) gizle',
      'x.com,twitter.com##[data-testid="GrokDrawer"]',
      'x.com,twitter.com##[data-testid="GrokDrawerHeader"]',
      'x.com,twitter.com##div[data-testid="grokImgGen"]',
    ],
  },
  {
    id: 'hide-grok-tweet-actions',
    category: 'grok',
    categoryLabel: 'Grok Temizliği',
    title: 'Gönderilerdeki (Tweet) Grok Özet/Açıklama İkonlarını Kaldır',
    description:
      'Her gönderinin sağ üst köşesinde ve aksiyon çubuğunda çıkan Grok "Bu gönderiyi açıkla" butonlarını gizler.',
    defaultEnabled: true,
    impactTarget: 'article button[aria-label*="Grok"]',
    getRules: () => [
      '! Gönderi (Tweet) kartları üzerindeki Grok ikonlarını ve butonlarını gizle',
      'x.com,twitter.com##button[aria-label*="Grok"]',
      'x.com,twitter.com##[data-testid="grok_button"]',
      'x.com,twitter.com##article [role="group"] button[aria-label*="Grok"]',
      'x.com,twitter.com##article div:has(> button[aria-label*="Grok"])',
    ],
  },
  {
    id: 'hide-grok-promos',
    category: 'grok',
    categoryLabel: 'Grok Temizliği',
    title: 'Sağ Kenar Çubuğu Grok Tanıtım Kartlarını Kaldır',
    description:
      'Sağ sütunda (Gündem / Kimi takip etmeli) beliren Grok reklam ve yönlendirme kutularını kaldırır.',
    defaultEnabled: true,
    impactTarget: '[data-testid="sidebarColumn"] a[href*="/i/grok"]',
    getRules: () => [
      '! Sağ kenar çubuğundaki (Sidebar) Grok öneri ve tanıtım kartlarını gizle',
      'x.com,twitter.com##[data-testid="sidebarColumn"] a[href*="/i/grok"]',
      'x.com,twitter.com##[data-testid="sidebarColumn"] aside:has(a[href*="/i/grok"])',
    ],
  },
  {
    id: 'restore-header-bird-logo',
    category: 'logo',
    categoryLabel: 'Klasik Twitter Logosu',
    title: 'Sol Üst X Logosunu Eski Klasik Twitter Kuşu Yap',
    description:
      'Brave Shields :style() kozmetik kuralı ile X SVG çizimini gizler ve yerine klasik Twitter kuşu vektörünü yerleştirir.',
    defaultEnabled: true,
    impactTarget: 'h1[role="heading"] a[href="/home"] svg',
    getRules: (logoHex: string) => {
      const dataUri = buildBirdSvgDataUri(logoHex);
      return [
        '! Sol üst köşedeki X logosunun orijinal vektör çizimini gizle',
        'x.com,twitter.com##h1[role="heading"] a[href="/home"] svg path:style(display: none !important;)',
        `! Sol üst köşedeki SVG kapsayıcısına klasik Twitter kuşu (${logoHex}) logosunu yerleştir`,
        `x.com,twitter.com##h1[role="heading"] a[href="/home"] svg:style(background-image: url("${dataUri}") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; width: 30px !important; height: 30px !important;)`,
      ];
    },
  },
  {
    id: 'restore-splash-bird-logo',
    category: 'logo',
    categoryLabel: 'Klasik Twitter Logosu',
    title: 'Yükleme Ekranı (Splash) ve Mobil Üst Bar Logosunu Kuş Yap',
    description:
      'Sayfa ilk açılırken beliren büyük X logosunu ve mobil görünüm üst çubuğundaki X ikonunu klasik Twitter kuşuyla değiştirir.',
    defaultEnabled: true,
    impactTarget: '#placeholder svg, header svg:has(path[d^="M18.244"])',
    getRules: (logoHex: string) => {
      const dataUri = buildBirdSvgDataUri(logoHex);
      return [
        '! Açılış / Yükleme ekranındaki (Splash Screen) X logosunu klasik Twitter kuşuyla değiştir',
        'x.com,twitter.com###placeholder svg path:style(display: none !important;)',
        `x.com,twitter.com###placeholder svg:style(background-image: url("${dataUri}") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important;)`,
        '! Mobil üst bar X logosunu klasik Twitter kuşuyla değiştir',
        'x.com,twitter.com##header svg path[d^="M18.244"]:style(display: none !important;)',
        `x.com,twitter.com##header svg:has(path[d^="M18.244"]):style(background-image: url("${dataUri}") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important;)`,
      ];
    },
  },
  {
    id: 'restore-bird-post-button',
    category: 'logo',
    categoryLabel: 'Klasik Twitter Logosu',
    title: 'Gönder (Post) Butonunu Klasik Twitter Mavisi (#1DA1F2) Yap',
    description:
      'Sol menüdeki siyah/beyaz "Post / Gönder" butonunu klasik Twitter mavisi (#1DA1F2) rengine dönüştürür.',
    defaultEnabled: true,
    impactTarget: 'a[data-testid="SideNav_NewTweet_Button"]',
    getRules: () => [
      '! Sol menüdeki Gönder (Post) butonunu klasik Twitter mavisi (#1DA1F2) yap',
      'x.com,twitter.com##a[data-testid="SideNav_NewTweet_Button"]:style(background-color: #1DA1F2 !important; color: #FFFFFF !important;)',
      'x.com,twitter.com##button[data-testid="tweetButtonInline"]:style(background-color: #1DA1F2 !important; color: #FFFFFF !important;)',
    ],
  },
];

export function generateBraveFilterList(config: RepoConfig): string {
  const activeModules = FILTER_RULE_MODULES.filter((m) =>
    config.enabledRuleIds.includes(m.id)
  );

  const lines: string[] = [
    '[Adblock Plus 2.0]',
    '! Title: Classic Twitter for Brave Shields (No For You, Following, +Konular & Plus Icon, No Grok, Classic Bird Logo)',
    '! Description: Twitter/X üzerinde "For You / Sana Özel", "Following / Takip edilenler", "+ Konular" ve sağdaki "+" ikonunu/satırını tamamen kaldırır, Grok (Grox) yapay zeka butonlarını gizler, X logosunu eski klasik Twitter kuşu logosuyla değiştirir.',
    '! Version: 2026.11.01',
    `! Homepage: https://github.com/${config.githubUsername}/${config.repoName}`,
    '! Expires: 1 day (update frequency)',
    '! License: MIT',
    '',
  ];

  const categories: { key: RuleCategory; heading: string }[] = [
    {
      key: 'for-you',
      heading:
        '1. "SANA ÖZEL", "TAKİP EDİLENLER", "+ KONULAR" VE SAĞDAKİ "+" İKONUNU KALDIRMA',
    },
    {
      key: 'grok',
      heading: '2. GROK (GROX) BUTONLARINI, SEKME VE PANELLERİNİ KALDIRMA',
    },
    {
      key: 'logo',
      heading: '3. X LOGOSUNU ESKİ KLASİK TWITTER KUŞU LOGOSUYLA DEĞİŞTİRME',
    },
  ];

  for (const cat of categories) {
    const catModules = activeModules.filter((m) => m.category === cat.key);
    if (catModules.length === 0) continue;

    lines.push('! ============================================================================');
    lines.push(`! ${cat.heading}`);
    lines.push('! ============================================================================');
    lines.push('');

    for (const mod of catModules) {
      for (const ruleLine of mod.getRules(config.logoColor)) {
        lines.push(ruleLine);
      }
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd() + '\n';
}

export function generateUserscript(config: RepoConfig): string {
  const birdDataUri = buildBirdSvgDataUri(config.logoColor);
  const hasForYou = config.enabledRuleIds.includes('hide-for-you-tab');
  const hasFollowing = config.enabledRuleIds.includes('hide-following-tab');
  const hasTopics = config.enabledRuleIds.includes('hide-topics-tab');
  const hasPlusIcon = config.enabledRuleIds.includes('hide-plus-icon');
  const hasEntireTabbar = config.enabledRuleIds.includes('hide-entire-tabbar');
  const hasGrok = config.enabledRuleIds.some((id) => id.startsWith('hide-grok'));
  const hasLogo = config.enabledRuleIds.some((id) => id.startsWith('restore-'));

  return `// ==UserScript==
// @name         Classic Twitter (No For You, Following, +Konular & Plus Icon, No Grok, Old Bird Logo & Favicon)
// @namespace    https://github.com/${config.githubUsername}/${config.repoName}
// @version      2.7.0
// @description  Twitter/X üzerinde "For You", "Takip edilenler", "+ Konular" ve sağdaki "+" ikonunu tamamen kaldırır, Grok (Grox) öğelerini temizler, sol üst logoyu ve tarayıcı sekme ikonunu (favicon) klasik mavi Twitter kuşu yapar.
// @author       ${config.githubUsername}
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TWITTER_BIRD_SVG_DATA_URI = "${birdDataUri}";

  const style = document.createElement('style');
  style.id = 'birdshield-classic-twitter-style';
  style.textContent = \`
    ${
      hasEntireTabbar
        ? `/* Üst sekme çubuğunu (Sana özel + Takip edilenler + Konular satırı) tamamen gizle */
    div[role="navigation"]:has([data-testid="ScrollSnap-List"]),
    nav[role="navigation"]:has([data-testid="ScrollSnap-List"]),
    div:has(> [data-testid="ScrollSnap-List"]),
    div:has(> div[role="tablist"]):not([data-testid="primaryColumn"]),
    [data-testid="ScrollSnap-List"],
    div[role="tablist"]:has(a[href="/home"]) {
      display: none !important;
    }`
        : ''
    }
    ${
      hasPlusIcon
        ? `/* Satırın sağındaki "+" (Artı) ikonunu ve kardeş düğümlerini gizle */
    [data-testid="ScrollSnap-List"] ~ *,
    div[role="tablist"] ~ *,
    header a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    header button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    [data-testid="primaryColumn"] a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    [data-testid="primaryColumn"] button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    svg:has(path[d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"]) {
      display: none !important;
    }`
        : ''
    }
    ${
      hasForYou
        ? `/* "For You / Sana Özel" sekmesini gizle */
    [data-testid="ScrollSnap-List"] > div[role="presentation"]:first-child {
      display: none !important;
    }`
        : ''
    }
    ${
      hasFollowing
        ? `/* "Following / Takip edilenler" sekmesini gizle */
    [data-testid="ScrollSnap-List"] > div[role="presentation"]:nth-child(2) {
      display: none !important;
    }`
        : ''
    }
    ${
      hasTopics
        ? `/* Satırın sağındaki "+ Konular (Topics / Lists)" sekmesini ve kaydırma oklarını gizle */
    [data-testid="ScrollSnap-List"] > div[role="presentation"]:nth-child(n+3),
    [data-testid="ScrollSnap-List"] a[href*="/topics"],
    [data-testid="ScrollSnap-List"] a[href*="/lists"],
    [data-testid="ScrollSnap-nextButtonWrapper"],
    [data-testid="ScrollSnap-prevButtonWrapper"] {
      display: none !important;
    }`
        : ''
    }
    ${
      hasGrok
        ? `/* Grok (Grox) menü, çekmece ve gönderi butonlarını gizle */
    a[href="/i/grok"],
    a[href*="/i/grok"],
    a[aria-label="Grok"],
    [data-testid="GrokDrawer"],
    [data-testid="GrokDrawerHeader"],
    div[data-testid="grokImgGen"],
    button[aria-label*="Grok"],
    [data-testid="grok_button"],
    nav[role="navigation"] div:has(> a[href="/i/grok"]),
    [data-testid="sidebarColumn"] aside:has(a[href*="/i/grok"]) {
      display: none !important;
    }`
        : ''
    }
    ${
      hasLogo
        ? `/* X Logosunu Klasik Twitter Kuşu ile değiştir */
    h1[role="heading"] a[href="/home"] svg path,
    header svg path[d^="M18.244"],
    #placeholder svg path {
      display: none !important;
    }
    h1[role="heading"] a[href="/home"] svg,
    header svg:has(path[d^="M18.244"]),
    #placeholder svg {
      background-image: url("\${TWITTER_BIRD_SVG_DATA_URI}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: contain !important;
      width: 30px !important;
      height: 30px !important;
    }`
        : ''
    }
  \`;
  document.documentElement.appendChild(style);

  function restoreFaviconAndTitle() {
    const links = document.querySelectorAll('link[rel*="icon"]');
    links.forEach((link) => {
      if (link.href !== TWITTER_BIRD_SVG_DATA_URI) {
        link.href = TWITTER_BIRD_SVG_DATA_URI;
      }
    });
    if (document.title.endsWith(' / X')) {
      document.title = document.title.replace(/ \\/ X$/, ' / Twitter');
    } else if (document.title === 'X') {
      document.title = 'Twitter';
    }
  }

  const observer = new MutationObserver(() => {
    restoreFaviconAndTitle();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
`;
}

export function generateExtensionManifest(): string {
  return JSON.stringify(
    {
      manifest_version: 3,
      name: 'Classic Twitter — No Tabbar & Plus Icon, No Grok & Bird Logo',
      version: '2.7.0',
      description:
        'Twitter/X üzerinde Sana Özel, Takip edilenler, + Konular ve sağdaki + ikonunu, Grok öğelerini kaldırır; eski mavi Twitter kuşu logosunu geri getirir.',
      content_scripts: [
        {
          matches: ['https://x.com/*', 'https://twitter.com/*'],
          js: ['content.js'],
          run_at: 'document_start',
        },
      ],
    },
    null,
    2
  );
}

export function generateReadme(config: RepoConfig): string {
  const rawUrl = `https://raw.githubusercontent.com/${config.githubUsername}/${config.repoName}/${config.branch}/filters.txt`;
  const subscribeUrl = `abp:subscribe?location=${encodeURIComponent(
    rawUrl
  )}&title=${encodeURIComponent('Classic Twitter for Brave Shields')}`;

  return `# Classic Twitter for Brave Shields 🐦

Twitter/X arayüzündeki **"For You" (Sana Özel)**, **"Following" (Takip edilenler)**, **"+ Konular" (+ Topics)** ve satırın en sağındaki **"+" (Artı)** ikonunu/sekme çubuğunu (tabbar) tamamen kaldıran, **Grok (Grox)** yapay zeka butonlarını/panellerini temizleyen ve **X logosunu eski klasik mavi Twitter kuşu (\`#1DA1F2\`)** logosuna dönüştüren **Brave Shields İçerik Filtreleme** listesi ve yardımcı betik paketi.

---

## ✨ Özellikler

1. **"Sana Özel", "Takip Edilenler", "+ Konular" ve Sağdaki "+" İkonu Temizliği:**
   - Masaüstü ve Brave Mobil (Android/iOS) üzerinde \`For You (Sana özel)\`, \`Following (Takip edilenler)\`, \`+ Konular\` sekmelerini, satırın en sağındaki \`+\` (artı) butonunu ve alt ayırıcı çizgiyi tamamen kaldırır.
2. **Grok (Grox) Tam Temizliği:**
   - Sol menüdeki (\`nav\`) Grok sekmesini kaldırır.
   - Sağ alt köşedeki açılır Grok sohbet çekmecesini (\`GrokDrawer\`) gizler.
   - Gönderilerin (\`article\`) sağ üst köşesindeki Grok özet/açıklama butonlarını kaldırır.
   - Sağ sütundaki Grok tanıtım kartlarını gizler.
3. **Eski Klasik Twitter Kuşu Logosu (\`#1DA1F2\`):**
   - Brave Shields \`:style()\` kozmetik kuralı ile sol üst köşedeki, mobil üst çubuktaki ve açılış ekranındaki (\`#placeholder\`) X logosunu orijinal mavi Twitter kuşu vektörüyle değiştirir.
   - Yardımcı Userscript / Eklenti ile tarayıcı sekme ikonunu (\`favicon\`) ve sayfa başlığını (\`/ Twitter\`) eski haline döndürür.

---

## 🚀 Brave Shields Kurulumu (Adım Adım)

### Yöntem 1: GitHub Raw Bağlantısı ile Otomatik Güncellenen Liste (Önerilen)

1. Brave tarayıcınızda adres çubuğuna şu adresi yapıştırıp açın:
   \`\`\`text
   brave://settings/shields/filters
   \`\`\`
2. Sayfanın alt kısmındaki **"Özel filtre listeleri ekle" (Add custom filter lists)** bölümüne inin.
3. **"Liste URL'sini girin" (Enter filter list URL)** kutusuna aşağıdaki GitHub Raw adresini yapıştırın:
   \`\`\`text
   ${rawUrl}
   \`\`\`
4. **"Ekle" (Add)** butonuna tıklayın ve açık olan \`x.com\` sekmesini yenileyin (\`Ctrl + R\` veya \`Cmd + R\`).

> **Tek Tıkla Abonelik:** Tarayıcınız \`abp:subscribe\` protokolünü destekliyorsa [buraya tıklayarak listeyi doğrudan Brave Shields'a ekleyebilirsiniz](${subscribeUrl}).

---

### Yöntem 2: Doğrudan Özel Filtre Kutusu (Manuel Kopyala-Yapıştır)

GitHub URL'si kullanmadan doğrudan kuralları yapıştırmak isterseniz:
1. \`brave://settings/shields/filters\` sayfasına gidin.
2. En alttaki **"Özel filtreler oluşturun" (Create custom filters)** metin kutusuna bu depodaki [\`filters.txt\`](./filters.txt) dosyasının içeriğini yapıştırın.
3. **"Değişiklikleri Kaydet" (Save changes)** butonuna tıklayın.

---

## 📁 Depo Dosya Yapısı

\`\`\`text
├── filters.txt                        # Brave Shields & uBlock Origin ana filtre listesi
├── userscript/
│   └── classic-twitter.user.js        # Favicon ve başlık değişimi içeren Tampermonkey betiği
├── extension/
│   ├── manifest.json                  # Manifest V3 Brave/Chrome eklenti yapılandırması
│   └── content.js                     # Eklenti içerik betiği
└── README.md                          # Kurulum ve kullanım kılavuzu
\`\`\`

## 📄 Lisans

MIT License — Özgürce çatallayabilir (fork), özelleştirebilir ve kendi GitHub hesabınızda barındırabilirsiniz.
`;
}

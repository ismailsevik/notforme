export type RuleCategory = 'for-you' | 'grok' | 'menu' | 'logo';

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
    title: 'Üst Sekme Satırını (Sana Özel + Takip Edilenler + Konular) Kaldır (Profil Resmi & Logo Korunur)',
    description:
      '1. satırdaki Profil Resmini (UserAvatar / TopNavBar) ve ortadaki Twitter kuşu logosunu kesinlikle korur; yalnızca 2. satırdaki sekme çubuğunu gizler.',
    defaultEnabled: true,
    impactTarget: 'div:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"]))',
    getRules: () => [
      '! Yalnızca 2. satırdaki sekme çubuğunu (ScrollSnap-List satırı ve sağdaki gri + kutusu) tamamen gizle.',
      '! 1. satırdaki Profil Resmi (UserAvatar / DashButton_ProfileIcon_Link), Üst Bar (TopNavBar) ve Twitter Logosu (M18.244) kesinlikle korunur!',
      'x.com,twitter.com##div:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"])):not(:has(img[src*="profile_images"])):not(:has(svg path[d^="M18.244"])):not(:has(h1)):not(:has(section)):not(:has(article)):not(:has([data-testid="cellInnerDiv"])):not(:has(main)):not([data-testid="primaryColumn"])',
      'x.com,twitter.com##nav:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"]))',
      'x.com,twitter.com##div[role="tablist"]:has([data-testid="ScrollSnap-List"])',
      'x.com,twitter.com##[data-testid="ScrollSnap-SwipeableList"]',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"]',
    ],
  },
  {
    id: 'hide-plus-icon',
    category: 'for-you',
    categoryLabel: 'Üst Tabbar Temizliği',
    title: 'Satırın Sağındaki "+" Gri Kutu Alanını ve Butonunu Kaldır',
    description:
      'Sekme satırının en sağında kalan gri kare kutuyu (a / button / div kapsayıcısını) ve içindeki "+" ikonunu tamamen gizler; Profil resmine ve Ayarlar sayfasına dokunmaz.',
    defaultEnabled: true,
    impactTarget: 'div[role="tablist"]:has([data-testid="ScrollSnap-List"]) ~ *',
    getRules: () => [
      '! Sekme satırının en sağında kalan gri kutuyu ve "+" (Artı) butonunu kapsayıcısıyla birlikte gizle (Profil resmine dokunmaz)',
      'x.com,twitter.com##div[role="tablist"]:has([data-testid="ScrollSnap-List"]) ~ *',
      'x.com,twitter.com##[data-testid="ScrollSnap-SwipeableList"] ~ *',
      'x.com,twitter.com##[data-testid="ScrollSnap-List"] ~ *',
      'x.com,twitter.com##div:has(> a > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article))',
      'x.com,twitter.com##div:has(> button > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article))',
      'x.com,twitter.com##div:has(> div[role="button"] > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article))',
      'x.com,twitter.com##a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]):not([href="/compose/post"])',
      'x.com,twitter.com##button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"])',
      'x.com,twitter.com##div[role="button"]:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"])',
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
    id: 'hide-menu-calls-premium',
    category: 'menu',
    categoryLabel: 'Menü Temizliği',
    title: 'Menüden "Aramalar" ve "Premium" Öğelerini Kaldır',
    description:
      'Sol navigasyon ve mobil profil çekmecesindeki "Aramalar (Calls)" ve "Premium" satırlarını gizler.',
    defaultEnabled: true,
    impactTarget: 'a[href*="/calls"], a[href*="/i/premium"]',
    getRules: () => [
      '! 3.1 Aramalar (Calls)',
      'x.com,twitter.com##a[href="/i/calls"]',
      'x.com,twitter.com##a[href*="/calls"]',
      'x.com,twitter.com##a[data-testid="calls"]',
      'x.com,twitter.com##a[aria-label="Aramalar"]',
      'x.com,twitter.com##a[aria-label="Calls"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^Aramalar$|^Calls$/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^Aramalar$|^Calls$/)',
      '! 3.2 Premium',
      'x.com,twitter.com##a[href="/i/premium_sign_up"]',
      'x.com,twitter.com##a[href*="/i/premium"]',
      'x.com,twitter.com##a[href="/i/verified-choose"]',
      'x.com,twitter.com##a[data-testid="premium-signup-tab"]',
      'x.com,twitter.com##a[data-testid="premium-hub-tab"]',
      'x.com,twitter.com##a[aria-label="Premium"]',
      'x.com,twitter.com##a[aria-label="X Premium"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^Premium$/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^Premium$/)',
    ],
  },
  {
    id: 'hide-menu-lists-communities',
    category: 'menu',
    categoryLabel: 'Menü Temizliği',
    title: 'Menüden "Listeler" ve "Topluluklar" Öğelerini Kaldır',
    description:
      'Sol navigasyon ve mobil profil çekmecesindeki "Listeler (Lists)" ve "Topluluklar (Communities)" satırlarını gizler.',
    defaultEnabled: true,
    impactTarget: 'a[href*="/lists"], a[href*="/communities"]',
    getRules: () => [
      '! 3.3 Listeler (Lists)',
      'x.com,twitter.com##a[href*="/lists"]',
      'x.com,twitter.com##a[data-testid="AppTabBar_Lists_Link"]',
      'x.com,twitter.com##a[aria-label="Listeler"]',
      'x.com,twitter.com##a[aria-label="Lists"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^Listeler$|^Lists$/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^Listeler$|^Lists$/)',
      '! 3.4 Topluluklar (Communities)',
      'x.com,twitter.com##a[href*="/communities"]',
      'x.com,twitter.com##a[data-testid="communities"]',
      'x.com,twitter.com##a[data-testid="AppTabBar_Communities_Link"]',
      'x.com,twitter.com##a[aria-label="Topluluklar"]',
      'x.com,twitter.com##a[aria-label="Communities"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^Topluluklar$|^Communities$/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^Topluluklar$|^Communities$/)',
    ],
  },
  {
    id: 'hide-menu-creator-orgs-ads',
    category: 'menu',
    categoryLabel: 'Menü Temizliği',
    title: 'Menüden "İçerik Üreticisi Stüdyosu", "Kurumsal" ve "Reklamlar" Öğelerini Kaldır',
    description:
      'Menüdeki "İçerik Üreticisi Stüdyosu (Creator Studio)", "Kurumsal (Verified Orgs)" ve "Reklamlar (Ads)" satırlarını gizler; Profil, Geçmiş, Ayarlar ve Çıkış yap korunur.',
    defaultEnabled: true,
    impactTarget: 'a[href*="/creators"], a[href*="/verified-orgs"], a[href*="ads."]',
    getRules: () => [
      '! 3.5 İçerik Üreticisi Stüdyosu (Creator Studio / Monetization)',
      'x.com,twitter.com##a[href="/i/jf/creators/studio"]',
      'x.com,twitter.com##a[href*="/creators"]',
      'x.com,twitter.com##a[href*="/monetization"]',
      'x.com,twitter.com##a[data-testid="creatorStudio"]',
      'x.com,twitter.com##a[data-testid="monetization"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^İçerik Üreticisi Stü|^Creator Studio|^Para kazanma|^Monetization/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^İçerik Üreticisi Stü|^Creator Studio|^Para kazanma|^Monetization/)',
      'x.com,twitter.com##div[role="button"]:has-text(/^İçerik Üreticisi Stü|^Creator Studio/)',
      '! 3.6 Kurumsal (Verified Organizations / Business)',
      'x.com,twitter.com##a[href="/i/verified-orgs-signup"]',
      'x.com,twitter.com##a[href*="/verified-orgs"]',
      'x.com,twitter.com##a[href*="/i/business"]',
      'x.com,twitter.com##a[data-testid="vo-signup-tab"]',
      'x.com,twitter.com##a[aria-label="Kurumsal"]',
      'x.com,twitter.com##a[aria-label="Verified Orgs"]',
      'x.com,twitter.com##a[aria-label="Onaylı Kuruluşlar"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^Kurumsal$|^Onaylı Kuruluşlar$|^Verified Orgs$|^Business$/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^Kurumsal$|^Onaylı Kuruluşlar$|^Verified Orgs$|^Business$/)',
      '! 3.7 Reklamlar (Ads)',
      'x.com,twitter.com##a[href*="ads.x.com"]',
      'x.com,twitter.com##a[href*="ads.twitter.com"]',
      'x.com,twitter.com##a[href*="/i/ads"]',
      'x.com,twitter.com##a[data-testid="ads"]',
      'x.com,twitter.com##a[aria-label="Reklamlar"]',
      'x.com,twitter.com##a[aria-label="Ads"]',
      'x.com,twitter.com##a[role="link"]:has-text(/^Reklamlar$|^Ads$/)',
      'x.com,twitter.com##div[role="menuitem"]:has-text(/^Reklamlar$|^Ads$/)',
    ],
  },
  {
    id: 'restore-header-bird-logo',
    category: 'logo',
    categoryLabel: 'Klasik Twitter Logosu',
    title: 'Sol Üst X Logosunu Eski Klasik Twitter Kuşu Yap',
    description:
      'Brave Shields :style() kozmetik kuralı ile X SVG çizimini saydamlaştırır ve yerine klasik Twitter kuşu vektörünü yerleştirir.',
    defaultEnabled: true,
    impactTarget: 'h1[role="heading"] a[href="/home"] svg',
    getRules: (logoHex: string) => {
      const dataUri = buildBirdSvgDataUri(logoHex);
      return [
        '! Masaüstü sol üst köşedeki X logosunun orijinal vektör çizimini saydam yap (boyutu çökmesin) ve mavi Twitter kuşu ekle',
        'x.com,twitter.com##h1[role="heading"] a[href="/home"] svg path:style(opacity: 0 !important;)',
        `x.com,twitter.com##h1[role="heading"] a[href="/home"] svg:style(background-image: url("${dataUri}") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; width: 30px !important; height: 30px !important; min-width: 30px !important; min-height: 30px !important;)`,
      ];
    },
  },
  {
    id: 'restore-splash-bird-logo',
    category: 'logo',
    categoryLabel: 'Klasik Twitter Logosu',
    title: 'Mobil Üst Bar (TopNavBar) ve Yükleme Ekranı Logosunu Kuş Yap',
    description:
      'Mobil görünüm üst çubuğunun (TopNavBar) ortasındaki X ikonunu ve açılış ekranındaki X logosunu sabit boyutlu klasik Twitter kuşuyla değiştirir.',
    defaultEnabled: true,
    impactTarget: 'header svg:has(path[d^="M18.244"]), #placeholder svg',
    getRules: (logoHex: string) => {
      const dataUri = buildBirdSvgDataUri(logoHex);
      return [
        '! Açılış / Yükleme ekranındaki (Splash Screen) X logosunu klasik Twitter kuşuyla değiştir',
        'x.com,twitter.com###placeholder svg path:style(opacity: 0 !important;)',
        `x.com,twitter.com###placeholder svg:style(background-image: url("${dataUri}") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important;)`,
        '! Mobil üst bar (TopNavBar) ortasındaki X logosunu klasik Twitter kuşuyla değiştir',
        'x.com,twitter.com##header svg path[d^="M18.244"]:style(opacity: 0 !important;)',
        `x.com,twitter.com##header svg:has(path[d^="M18.244"]):style(background-image: url("${dataUri}") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; width: 28px !important; height: 28px !important; min-width: 28px !important; min-height: 28px !important;)`,
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
    '! Title: Classic Twitter for Brave Shields (No Tabbar & Gray Box, Keep Profile & Bird Logo, No Grok, Clean Menu)',
    '! Description: Twitter/X üzerinde üstteki "Sana Özel / Takip edilenler / + Konular / +" sekme satırını tamamen kaldırır, Profil resmini ve klasik mavi Twitter kuşu logosunu korur, Ayarlar sayfasını bozmaz, Grok\'u ve gereksiz menü öğelerini temizler.',
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
        '1. ÜST SEKME SATIRI ("SANA ÖZEL", "TAKİP EDİLENLER", "+ KONULAR", "+" KUTUSU) KALDIRMA (PROFİL VE LOGO KORUNUR)',
    },
    {
      key: 'grok',
      heading: '2. GROK (GROX) BUTONLARINI, SEKME VE PANELLERİNİ KALDIRMA',
    },
    {
      key: 'menu',
      heading:
        '3. MENÜ / ÇEKMECE TEMİZLİĞİ (ARAMALAR, PREMIUM, LİSTELER, TOPLULUKLAR, STÜDYO, KURUMSAL, REKLAMLAR)',
    },
    {
      key: 'logo',
      heading: '4. X LOGOSUNU ESKİ KLASİK TWITTER KUŞU LOGOSUYLA DEĞİŞTİRME',
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
  const hasMenuClean = config.enabledRuleIds.some((id) => id.startsWith('hide-menu-'));
  const hasLogo = config.enabledRuleIds.some((id) => id.startsWith('restore-'));

  return `// ==UserScript==
// @name         Classic Twitter (No Tabbar & Gray Box, Keep Profile & Bird Logo, No Grok, Clean Menu)
// @namespace    https://github.com/${config.githubUsername}/${config.repoName}
// @version      3.0.0
// @description  Twitter/X üzerinde "For You", "Takip edilenler", "+ Konular" ve sağdaki "+" gri kutusunu kaldırır, Profil resmini, Twitter kuşu logosunu ve Ayarlar sayfasını korur, Grok ve gereksiz menü öğelerini temizler.
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
        ? `/* Yalnızca 2. satırdaki sekme çubuğunu gizle; 1. satırdaki Profil Resmi (UserAvatar / TopNavBar) ve Twitter Logosu korunur */
    div:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"])):not(:has(img[src*="profile_images"])):not(:has(svg path[d^="M18.244"])):not(:has(h1)):not(:has(section)):not(:has(article)):not(:has([data-testid="cellInnerDiv"])):not(:has(main)):not([data-testid="primaryColumn"]),
    nav:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"])),
    div[role="tablist"]:has([data-testid="ScrollSnap-List"]),
    [data-testid="ScrollSnap-SwipeableList"],
    [data-testid="ScrollSnap-List"] {
      display: none !important;
    }`
        : ''
    }
    ${
      hasPlusIcon
        ? `/* Satırın sağındaki gri kutuyu ve "+" (Artı) butonunu kapsayıcısıyla birlikte gizle */
    div[role="tablist"]:has([data-testid="ScrollSnap-List"]) ~ *,
    [data-testid="ScrollSnap-SwipeableList"] ~ *,
    [data-testid="ScrollSnap-List"] ~ *,
    div:has(> a > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article)),
    div:has(> button > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article)),
    div:has(> div[role="button"] > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article)),
    a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]):not([href="/compose/post"]),
    button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]),
    div[role="button"]:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]) {
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
    [data-testid="sidebarColumn"] aside:has(a[href*="/i/grok"]) {
      display: none !important;
    }`
        : ''
    }
    ${
      hasMenuClean
        ? `/* Menü / Çekmece Temizliği (Aramalar, Premium, Listeler, Topluluklar, İçerik Üreticisi Stüdyosu, Kurumsal, Reklamlar) */
    a[href="/i/calls"],
    a[href*="/calls"],
    a[data-testid="calls"],
    a[aria-label="Aramalar"],
    a[aria-label="Calls"],
    a[href="/i/premium_sign_up"],
    a[href*="/i/premium"],
    a[href="/i/verified-choose"],
    a[data-testid="premium-signup-tab"],
    a[data-testid="premium-hub-tab"],
    a[aria-label="Premium"],
    a[aria-label="X Premium"],
    a[href*="/lists"],
    a[data-testid="AppTabBar_Lists_Link"],
    a[aria-label="Listeler"],
    a[aria-label="Lists"],
    a[href*="/communities"],
    a[data-testid="communities"],
    a[data-testid="AppTabBar_Communities_Link"],
    a[aria-label="Topluluklar"],
    a[aria-label="Communities"],
    a[href="/i/jf/creators/studio"],
    a[href*="/creators"],
    a[href*="/monetization"],
    a[data-testid="creatorStudio"],
    a[data-testid="monetization"],
    a[href="/i/verified-orgs-signup"],
    a[href*="/verified-orgs"],
    a[href*="/i/business"],
    a[data-testid="vo-signup-tab"],
    a[aria-label="Kurumsal"],
    a[aria-label="Verified Orgs"],
    a[aria-label="Onaylı Kuruluşlar"],
    a[href*="ads.x.com"],
    a[href*="ads.twitter.com"],
    a[href*="/i/ads"],
    a[data-testid="ads"],
    a[aria-label="Reklamlar"],
    a[aria-label="Ads"] {
      display: none !important;
    }`
        : ''
    }
    ${
      hasLogo
        ? `/* X Logosunu Klasik Twitter Kuşu ile değiştir (opacity: 0 ile boyut korunur) */
    h1[role="heading"] a[href="/home"] svg path,
    header svg path[d^="M18.244"],
    #placeholder svg path {
      opacity: 0 !important;
    }
    h1[role="heading"] a[href="/home"] svg,
    header svg:has(path[d^="M18.244"]),
    #placeholder svg {
      background-image: url("\${TWITTER_BIRD_SVG_DATA_URI}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: contain !important;
      width: 28px !important;
      height: 28px !important;
      min-width: 28px !important;
      min-height: 28px !important;
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
      name: 'Classic Twitter — Keep Profile & Bird Logo, No Tabbar, No Grok',
      version: '3.0.0',
      description:
        'Twitter/X üzerinde Sana Özel, Takip edilenler, + Konular, + gri kutusu, Grok ve gereksiz menü öğelerini kaldırır; Profil resmini, Ayarlar sayfasını ve mavi Twitter kuşu logosunu korur.',
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

Twitter/X arayüzündeki **"For You" (Sana Özel)**, **"Following" (Takip edilenler)**, **"+ Konular" (+ Topics)** ve satırın en sağındaki **"+" (Artı) gri kutu alanını** tamamen kaldıran, **1. satırdaki Profil Resmini ve Klasik Mavi Twitter Kuşu (\`#1DA1F2\`) Logosunu** koruyan, **Ayarlar (\`/settings\`)** sayfasını bozmayan, **Grok (Grox)** ve menüdeki gereksiz öğeleri temizleyen **Brave Shields İçerik Filtreleme** listesi.

---

## ✨ Özellikler

1. **Profil Resmi ve Twitter Logosu Korunarak Üst Sekme Satırı Temizliği:**
   - Mobil ve masaüstünde 1. satırdaki **Profil Resmi (Avatar)** ve ortadaki **Mavi Twitter Kuşu Logosu** korunur (böylece profil çekmecesini ve Ayarlar menüsünü her zaman açabilirsiniz).
   - Yalnızca 2. satırdaki \`For You (Sana özel)\`, \`Following (Takip edilenler)\`, \`+ Konular\` sekmeleri ve sağdaki gri \`+\` kutusu tamamen kaldırılır.
2. **Grok (Grox) Tam Temizliği:**
   - Sol menüdeki (\`nav\`) Grok sekmesini, sağ alt köşedeki açılır Grok çekmecesini (\`GrokDrawer\`), gönderi üstü Grok özet butonlarını ve sağ sütun tanıtım kartlarını gizler.
3. **Sol Menü ve Mobil Profil Çekmecesi Temizliği:**
   - Menüdeki **Aramalar (Calls)**, **Premium**, **Listeler (Lists)**, **Topluluklar (Communities)**, **İçerik Üreticisi Stüdyosu (Creator Studio)**, **Kurumsal (Verified Orgs)** ve **Reklamlar (Ads)** satırlarını gizler.
   - **Profil**, **Geçmiş / Yer İşaretleri**, **Ayarlar ve gizlilik** ve **Çıkış yap** öğeleri korunur.
4. **Eski Klasik Twitter Kuşu Logosu (\`#1DA1F2\`):**
   - Brave Shields \`:style()\` kozmetik kuralı ile sol üst köşedeki, mobil üst çubuktaki (\`TopNavBar\`) ve açılış ekranındaki (\`#placeholder\`) X logosunu orijinal mavi Twitter kuşu vektörüyle değiştirir.

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

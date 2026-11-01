// ==UserScript==
// @name         Classic Twitter (No For You, Following, +Konular & Plus Icon, No Grok, Old Bird Logo & Favicon)
// @namespace    https://github.com/classic-twitter/brave-shields-filter
// @version      2.7.0
// @description  Twitter/X üzerinde "For You / Sana Özel", "Following / Takip edilenler", "+ Konular" ve sağdaki "+" ikonunu tamamen kaldırır, Grok (Grox) öğelerini temizler, sol üst logoyu ve tarayıcı sekme ikonunu (favicon) klasik mavi Twitter kuşu yapar.
// @author       BirdShield
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TWITTER_BIRD_SVG_DATA_URI =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231DA1F2'%3E%3Cpath d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'/%3E%3C/svg%3E";

  // 1. CSS Enjeksiyonu (Üst Tabbar, Sana Özel, Takip Edilenler, + Konular, sağdaki + ikonu, Grok gizleme ve Klasik Twitter kuşu logosu)
  const style = document.createElement('style');
  style.id = 'birdshield-classic-twitter-style';
  style.textContent = `
    /* "Sana Özel", "Takip edilenler", "+ Konular", sağdaki "+" ikonu ve üst sekme çubuğunu (tabbar) tamamen gizle */
    div[role="navigation"]:has([data-testid="ScrollSnap-List"]),
    nav[role="navigation"]:has([data-testid="ScrollSnap-List"]),
    div:has(> [data-testid="ScrollSnap-List"]),
    div:has(> div[role="tablist"]):not([data-testid="primaryColumn"]),
    [data-testid="ScrollSnap-List"],
    [data-testid="ScrollSnap-List"] ~ *,
    div[role="tablist"] ~ *,
    [data-testid="ScrollSnap-List"] > div[role="presentation"],
    [data-testid="ScrollSnap-List"] a[href*="/topics"],
    [data-testid="ScrollSnap-List"] a[href*="/lists"],
    [data-testid="ScrollSnap-nextButtonWrapper"],
    [data-testid="ScrollSnap-prevButtonWrapper"],
    header a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    header button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    [data-testid="primaryColumn"] a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    [data-testid="primaryColumn"] button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    svg:has(path[d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"]),
    div[role="tablist"]:has(a[href="/home"]) {
      display: none !important;
    }

    /* Grok (Grox) menü, çekmece ve gönderi butonlarını gizle */
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
    }

    /* X Logosunu Klasik Twitter Kuşu (#1DA1F2) ile değiştir */
    h1[role="heading"] a[href="/home"] svg path,
    header svg path[d^="M18.244"],
    #placeholder svg path {
      display: none !important;
    }
    h1[role="heading"] a[href="/home"] svg,
    header svg:has(path[d^="M18.244"]),
    #placeholder svg {
      background-image: url("${TWITTER_BIRD_SVG_DATA_URI}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: contain !important;
    }
  `;
  document.documentElement.appendChild(style);

  // 2. Tarayıcı Sekme İkonunu (Favicon) ve Başlığını Klasik Twitter Yap
  function restoreFaviconAndTitle() {
    const links = document.querySelectorAll('link[rel*="icon"]');
    links.forEach((link) => {
      if (link.href !== TWITTER_BIRD_SVG_DATA_URI) {
        link.href = TWITTER_BIRD_SVG_DATA_URI;
      }
    });
    if (document.title.endsWith(' / X')) {
      document.title = document.title.replace(/ \/ X$/, ' / Twitter');
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

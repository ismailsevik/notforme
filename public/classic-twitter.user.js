// ==UserScript==
// @name         Classic Twitter (No Tabbar & Gray Box, Keep Profile & Bird Logo, No Grok)
// @namespace    https://github.com/classic-twitter/brave-shields-filter
// @version      3.1.0
// @description  Twitter/X üzerinde "For You", "Takip edilenler", "+ Konular" ve sağdaki "+" gri kutusunu kaldırır, Profil bağlantısını, menüyü ve Twitter kuşu logosunu korur, Grok'u temizler.
// @author       ClassicTwitter
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TWITTER_BIRD_PATH =
    'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z';

  const TWITTER_BIRD_SVG_DATA_URI =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231DA1F2'%3E%3Cpath d='" +
    TWITTER_BIRD_PATH +
    "'/%3E%3C/svg%3E";

  const style = document.createElement('style');
  style.id = 'birdshield-classic-twitter-style';
  style.textContent = `
    /* 1. Yalnızca 2. satırdaki sekme çubuğunu ve sağdaki gri + kutusunu gizle (1. satır: Profil bağlantısı ve Logo korunur) */
    div:first-child + div:has([data-testid="ScrollSnap-List"]):not(:has(article)):not(:has(section)):not(:has([data-testid="cellInnerDiv"])),
    div:first-child + nav:has([data-testid="ScrollSnap-List"]),
    nav:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"])),
    div[role="tablist"]:has([data-testid="ScrollSnap-List"]),
    div[role="tablist"]:has([data-testid="ScrollSnap-List"]) ~ *,
    [data-testid="ScrollSnap-SwipeableList"],
    [data-testid="ScrollSnap-SwipeableList"] ~ *,
    [data-testid="ScrollSnap-List"],
    [data-testid="ScrollSnap-List"] ~ *,
    div:has(> a:only-child svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    div:has(> button:only-child svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    div:has(> div[role="button"]:only-child svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]),
    a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]):not([href="/compose/post"]),
    button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]),
    div[role="button"]:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]) {
      display: none !important;
    }

    /* 2. Grok (Grox) menü, çekmece ve gönderi butonlarını gizle */
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
    }

    /* 3. X Logosunu Klasik Twitter Kuşu ile değiştir (CSP-uyumlu d: path() ve fill) */
    svg path[d^="M18.244"] {
      d: path("${TWITTER_BIRD_PATH}") !important;
      fill: #1DA1F2 !important;
      color: #1DA1F2 !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: inline !important;
    }
  `;
  document.documentElement.appendChild(style);

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

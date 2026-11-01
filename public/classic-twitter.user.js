// ==UserScript==
// @name         Classic Twitter (No Tabbar & Gray Box, Keep Profile & Bird Logo, No Grok, Clean Menu)
// @namespace    https://github.com/classic-twitter/brave-shields-filter
// @version      3.0.0
// @description  Twitter/X üzerinde "Sana Özel / Takip edilenler / + Konular / +" satırını kaldırır, Profil resmini, Twitter kuşu logosunu ve Ayarlar sayfasını korur, Grok'u ve gereksiz menü öğelerini temizler.
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

  const style = document.createElement('style');
  style.id = 'birdshield-classic-twitter-style';
  style.textContent = `
    /* 1. Yalnızca 2. satırdaki sekme çubuğu (Sana Özel, Takip edilenler, + Konular ve sağdaki + gri kutusu) gizlenir.
       1. satırdaki Profil Resmi (UserAvatar / TopNavBar), Twitter Logosu ve Ayarlar (/settings) korunur! */
    div:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"])):not(:has(img[src*="profile_images"])):not(:has(svg path[d^="M18.244"])):not(:has(h1)):not(:has(section)):not(:has(article)):not(:has([data-testid="cellInnerDiv"])):not(:has(main)):not([data-testid="primaryColumn"]),
    nav:has([data-testid="ScrollSnap-List"]):not(:has([data-testid="TopNavBar"])):not(:has([data-testid="DashButton_ProfileIcon_Link"])):not(:has([data-testid^="UserAvatar-Container"])),
    div[role="tablist"]:has([data-testid="ScrollSnap-List"]),
    div[role="tablist"]:has([data-testid="ScrollSnap-List"]) ~ *,
    [data-testid="ScrollSnap-SwipeableList"],
    [data-testid="ScrollSnap-SwipeableList"] ~ *,
    [data-testid="ScrollSnap-List"],
    [data-testid="ScrollSnap-List"] ~ *,
    [data-testid="ScrollSnap-List"] > div[role="presentation"],
    [data-testid="ScrollSnap-List"] a[href*="/topics"],
    [data-testid="ScrollSnap-List"] a[href*="/lists"],
    [data-testid="ScrollSnap-nextButtonWrapper"],
    [data-testid="ScrollSnap-prevButtonWrapper"],
    div:has(> a > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article)),
    div:has(> button > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article)),
    div:has(> div[role="button"] > div > svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not(:has([data-testid^="UserAvatar-Container"])):not(:has(section)):not(:has(article)),
    a:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]):not([href="/compose/post"]),
    button:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]),
    div[role="button"]:has(svg path[d^="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7"]):not([data-testid*="SideNav"]) {
      display: none !important;
    }

    /* 2. Grok (Grox) menü, çekmece ve gönderi butonları */
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

    /* 3. Menü / Çekmece Temizliği (Aramalar, Premium, Listeler, Topluluklar, İçerik Üreticisi Stüdyosu, Kurumsal, Reklamlar) */
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
    }

    /* 4. X Logosunu Klasik Twitter Kuşu (#1DA1F2) ile değiştir (opacity: 0 ile boyut korunur) */
    h1[role="heading"] a[href="/home"] svg path,
    header svg path[d^="M18.244"],
    #placeholder svg path {
      opacity: 0 !important;
    }
    h1[role="heading"] a[href="/home"] svg,
    header svg:has(path[d^="M18.244"]),
    #placeholder svg {
      background-image: url("${TWITTER_BIRD_SVG_DATA_URI}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: contain !important;
      width: 28px !important;
      height: 28px !important;
      min-width: 28px !important;
      min-height: 28px !important;
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

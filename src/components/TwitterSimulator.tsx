import React, { useState } from 'react';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CLASSIC_TWITTER_BIRD_PATH, RepoConfig } from '../data/filterRules';

interface TwitterSimulatorProps {
  config: RepoConfig;
}

const X_LOGO_PATH =
  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';

export const TwitterSimulator: React.FC<TwitterSimulatorProps> = ({ config }) => {
  const [shieldsActive, setShieldsActive] = useState<boolean>(true);
  const [showXray, setShowXray] = useState<boolean>(false);

  const isRuleActive = (id: string) =>
    shieldsActive && config.enabledRuleIds.includes(id);

  const hideEntireTabbar = isRuleActive('hide-entire-tabbar');
  const hideForYouTab = isRuleActive('hide-for-you-tab') || hideEntireTabbar;
  const hideFollowingTab = isRuleActive('hide-following-tab') || hideEntireTabbar;
  const hideTopicsTab = isRuleActive('hide-topics-tab') || hideEntireTabbar;
  const isTabbarCompletelyHidden =
    hideEntireTabbar || (hideForYouTab && hideFollowingTab && hideTopicsTab);

  const hideGrokSidebar = isRuleActive('hide-grok-sidebar');
  const hideGrokDrawer = isRuleActive('hide-grok-drawer');
  const hideGrokTweetActions = isRuleActive('hide-grok-tweet-actions');
  const hideGrokPromos = isRuleActive('hide-grok-promos');
  const restoreHeaderBirdLogo = isRuleActive('restore-header-bird-logo');
  const restoreBirdPostButton = isRuleActive('restore-bird-post-button');

  const blockedElementsCount = [
    hideEntireTabbar,
    isRuleActive('hide-for-you-tab'),
    isRuleActive('hide-following-tab'),
    isRuleActive('hide-topics-tab'),
    hideGrokSidebar,
    hideGrokDrawer,
    hideGrokTweetActions,
    hideGrokPromos,
    restoreHeaderBirdLogo,
    restoreBirdPostButton,
  ].filter(Boolean).length;

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
      {/* Simulator Browser Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
        <div className="flex items-center gap-3 min-w-0">
          {/* Simulated Browser Tab */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
            {restoreHeaderBirdLogo ? (
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0"
                style={{ fill: config.logoColor === '#FFFFFF' ? '#1DA1F2' : config.logoColor }}
                aria-hidden="true"
              >
                <path d={CLASSIC_TWITTER_BIRD_PATH} />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 shrink-0 fill-current text-slate-900 dark:text-white"
                aria-hidden="true"
              >
                <path d={X_LOGO_PATH} />
              </svg>
            )}
            <span className="truncate">
              {restoreHeaderBirdLogo ? 'Ana Sayfa / Twitter' : 'Ana Sayfa / X'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>https://x.com/home</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{blockedElementsCount} kural uygulandı</span>
          </div>
        </div>

        {/* Simulator Mode Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowXray((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              showXray
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {showXray ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Seçici X-Ray {showXray ? 'Açık' : 'Kapalı'}</span>
          </button>

          <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setShieldsActive(false)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !shieldsActive
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Standart X (Filtresiz)
            </button>
            <button
              type="button"
              onClick={() => setShieldsActive(true)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                shieldsActive
                  ? 'bg-[#1DA1F2] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Brave Shields Aktif
            </button>
          </div>
        </div>
      </div>

      {/* Simulated X.com DOM Canvas */}
      <div className="bg-black text-white grid grid-cols-12 min-h-[510px] relative select-none">
        {/* Left Navigation Sidebar */}
        <div className="col-span-3 sm:col-span-3 lg:col-span-3 border-r border-neutral-800 p-3 sm:p-4 flex flex-col justify-between">
          <div className="space-y-1">
            {/* Top-Left Brand Logo (h1[role="heading"] a[href="/home"] svg) */}
            <div className="pb-2">
              <div
                className={`inline-flex items-center gap-2 p-2 rounded-full hover:bg-neutral-900 transition-colors relative ${
                  showXray ? 'ring-1 ring-[#1DA1F2]' : ''
                }`}
                title='h1[role="heading"] a[href="/home"] svg'
              >
                {restoreHeaderBirdLogo ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 transition-transform duration-150"
                    style={{ fill: config.logoColor }}
                    aria-label="Classic Twitter Bird"
                  >
                    <path d={CLASSIC_TWITTER_BIRD_PATH} />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 fill-white"
                    aria-label="X Logo"
                  >
                    <path d={X_LOGO_PATH} />
                  </svg>
                )}
                {showXray && (
                  <span className="text-[10px] font-mono text-[#1DA1F2] bg-neutral-950/90 px-1.5 py-0.5 rounded border border-[#1DA1F2]/40">
                    :style(bird-svg)
                  </span>
                )}
              </div>
            </div>

            {/* Nav Items */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-bold text-white bg-neutral-900/60">
              <Home className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline truncate">Ana Sayfa</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-neutral-400 hover:bg-neutral-900/40">
              <Search className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline truncate">Keşfet</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-neutral-400 hover:bg-neutral-900/40">
              <Bell className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline truncate">Bildirimler</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-neutral-400 hover:bg-neutral-900/40">
              <Mail className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline truncate">Mesajlar</span>
            </div>

            {/* Grok Sidebar Item (a[href="/i/grok"]) */}
            {(!hideGrokSidebar || showXray) && (
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-full text-sm transition-opacity ${
                  hideGrokSidebar && showXray
                    ? 'opacity-35 ring-1 ring-rose-500/60 bg-rose-950/20 line-through text-rose-300'
                    : 'text-neutral-300 hover:bg-neutral-900/40'
                }`}
                title='a[href="/i/grok"]'
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Sparkles className="w-5 h-5 shrink-0 text-neutral-200" />
                  <span className="hidden sm:inline truncate font-medium">Grok</span>
                </div>
                {showXray && (
                  <span className="hidden md:inline text-[10px] font-mono text-rose-400">
                    ##a[href=&quot;/i/grok&quot;]
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-neutral-400 hover:bg-neutral-900/40">
              <Bookmark className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline truncate">Yer İşaretleri</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-neutral-400 hover:bg-neutral-900/40">
              <User className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline truncate">Profil</span>
            </div>
          </div>

          {/* Post / Tweet Button */}
          <div className="pt-3">
            <div
              className={`w-full py-2.5 px-4 rounded-full text-center text-sm font-bold transition-colors ${
                restoreBirdPostButton
                  ? 'bg-[#1DA1F2] text-white'
                  : 'bg-white text-black'
              }`}
            >
              <span className="hidden sm:inline">
                {restoreHeaderBirdLogo ? 'Tweetle' : 'Gönder'}
              </span>
              <span className="sm:hidden">+</span>
            </div>
          </div>
        </div>

        {/* Center Primary Feed Column ([data-testid="primaryColumn"]) */}
        <div className="col-span-9 sm:col-span-6 lg:col-span-6 border-r border-neutral-800 flex flex-col">
          {/* Top Timeline Tabbar ([data-testid="ScrollSnap-List"]) */}
          {(!isTabbarCompletelyHidden || showXray) && (
            <div
              className={`border-b border-neutral-800 bg-black/85 backdrop-blur-xs flex items-center ${
                isTabbarCompletelyHidden && showXray
                  ? 'opacity-35 ring-1 ring-rose-500/60 bg-rose-950/20'
                  : ''
              }`}
              title='[data-testid="ScrollSnap-List"]'
            >
              {/* First Child: "For You / Sana Özel" Tab */}
              {(!hideForYouTab || showXray) && (
                <div
                  className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm relative transition-opacity ${
                    hideForYouTab && showXray
                      ? 'opacity-40 bg-rose-950/30 line-through text-rose-300'
                      : 'text-neutral-400 hover:bg-neutral-900/40'
                  }`}
                >
                  <span>Sana özel</span>
                  {showXray && (
                    <div className="mt-0.5 text-[10px] font-mono text-rose-400">
                      :first-child
                    </div>
                  )}
                </div>
              )}

              {/* Second Child: "Following / Takip edilenler" Tab */}
              {(!hideFollowingTab || showXray) && (
                <div
                  className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm font-bold relative transition-opacity ${
                    hideFollowingTab && showXray
                      ? 'opacity-40 bg-rose-950/30 line-through text-rose-300'
                      : 'text-white'
                  }`}
                >
                  <span>Takip edilenler</span>
                  {!hideFollowingTab && (
                    <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#1DA1F2]" />
                  )}
                  {showXray && (
                    <div className="mt-0.5 text-[10px] font-mono text-rose-400">
                      :nth-child(2)
                    </div>
                  )}
                </div>
              )}

              {/* Third+ Child on the right: "+ Konular (+ Topics)" Tab */}
              {(!hideTopicsTab || showXray) && (
                <div
                  className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm relative transition-opacity ${
                    hideTopicsTab && showXray
                      ? 'opacity-40 bg-rose-950/30 line-through text-rose-300'
                      : 'text-neutral-400 hover:bg-neutral-900/40'
                  }`}
                >
                  <span>+ Konular</span>
                  {showXray && (
                    <div className="mt-0.5 text-[10px] font-mono text-rose-400">
                      :nth-child(n+3)
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Simulated Posts / Tweets */}
          <div className="divide-y divide-neutral-800 flex-1">
            {/* Tweet 1 */}
            <article className="p-4 hover:bg-neutral-950/60 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 border border-[#1DA1F2]/40 flex items-center justify-center text-[#1DA1F2] font-bold text-sm shrink-0">
                  BT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm truncate">
                      <span className="font-bold text-white">Açık Kaynak Web</span>
                      <CheckCircle2 className="w-4 h-4 text-[#1DA1F2] shrink-0" />
                      <span className="text-neutral-500 text-xs">@acikkaynak · 14d</span>
                    </div>

                    {/* Tweet-level Grok Button (button[aria-label*="Grok"]) */}
                    <div className="flex items-center gap-2 shrink-0">
                      {(!hideGrokTweetActions || showXray) && (
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] ${
                            hideGrokTweetActions && showXray
                              ? 'opacity-35 border-rose-500/60 text-rose-300 line-through'
                              : 'border-neutral-700 text-neutral-400 bg-neutral-900'
                          }`}
                          title='button[aria-label*="Grok"]'
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Grok</span>
                        </div>
                      )}
                      <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>

                  <p className="mt-1.5 text-sm text-neutral-200 leading-relaxed">
                    Üst satırdaki &quot;Sana özel&quot;, &quot;Takip edilenler&quot; ve sağdaki &quot;+ Konular&quot; sekme çubuğu (tabbar) tamamen kaldırıldı! Akış doğrudan gönderilerle başlıyor, Grok temizlendi ve sol üstte klasik mavi Twitter kuşu yer alıyor.
                  </p>

                  <div className="mt-3 flex items-center justify-between max-w-xs text-neutral-500 text-xs font-mono tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" /> 18
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Repeat2 className="w-4 h-4" /> 64
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-500">
                      <Heart className="w-4 h-4 fill-current" /> 412
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Share className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Tweet 2 */}
            <article className="p-4 hover:bg-neutral-950/60 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                  DEV
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm truncate">
                      <span className="font-bold text-white">Kronolojik Akış</span>
                      <span className="text-neutral-500 text-xs">@kronolojik · 42d</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {(!hideGrokTweetActions || showXray) && (
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] ${
                            hideGrokTweetActions && showXray
                              ? 'opacity-35 border-rose-500/60 text-rose-300 line-through'
                              : 'border-neutral-700 text-neutral-400 bg-neutral-900'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Grok</span>
                        </div>
                      )}
                      <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>

                  <p className="mt-1.5 text-sm text-neutral-200 leading-relaxed">
                    GitHub üzerinde barındırılan <code className="text-[#1DA1F2]">filters.txt</code> dosyasını <code className="text-neutral-300">brave://settings/shields/filters</code> adresine eklediğinizde hem masaüstü hem mobil Brave üzerinde otomatik güncellenir.
                  </p>

                  <div className="mt-3 flex items-center justify-between max-w-xs text-neutral-500 text-xs font-mono tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" /> 9
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Repeat2 className="w-4 h-4" /> 31
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" /> 195
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Share className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Right Sidebar Column ([data-testid="sidebarColumn"]) */}
        <div className="hidden sm:flex sm:col-span-3 lg:col-span-3 p-4 flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Search Box */}
            <div className="px-3.5 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Ara</span>
            </div>

            {/* Right Sidebar Grok Promo Card (aside:has(a[href*="/i/grok"])) */}
            {(!hideGrokPromos || showXray) && (
              <aside
                className={`p-3.5 rounded-xl border transition-opacity ${
                  hideGrokPromos && showXray
                    ? 'opacity-35 border-rose-500/60 bg-rose-950/20'
                    : 'border-neutral-800 bg-neutral-900/60'
                }`}
                title='[data-testid="sidebarColumn"] aside:has(a[href*="/i/grok"])'
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Grok 3 Yayında
                  </span>
                  {showXray && (
                    <span className="text-[10px] font-mono text-rose-400">gizlendi</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  Grok ile gönderileri analiz edin ve görsel üretin.
                </p>
              </aside>
            )}

            {/* Clean Trends Box */}
            <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-2.5">
              <div className="text-xs font-bold text-white">Gündemdekiler</div>
              <div className="space-y-0.5">
                <div className="text-[11px] text-neutral-500">Teknoloji · Gündemdekiler</div>
                <div className="text-xs font-semibold text-neutral-200">#BraveShields</div>
                <div className="text-[11px] text-neutral-500 font-mono tabular-nums">4.820 gönderi</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] text-neutral-500">Açık Kaynak · Gündemdekiler</div>
                <div className="text-xs font-semibold text-neutral-200">Classic Twitter</div>
                <div className="text-[11px] text-neutral-500 font-mono tabular-nums">12.400 gönderi</div>
              </div>
            </div>
          </div>

          {/* Floating Bottom-Right Grok Drawer ([data-testid="GrokDrawer"]) */}
          {(!hideGrokDrawer || showXray) && (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                hideGrokDrawer && showXray
                  ? 'opacity-35 border-rose-500/60 bg-rose-950/30 text-rose-300 line-through'
                  : 'border-neutral-700 bg-neutral-900 text-white shadow-lg'
              }`}
              title='[data-testid="GrokDrawer"]'
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Grok Çekmecesi</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">GrokDrawer</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import InheritanceForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

type Language = "en" | "tr";
type Theme = "dark" | "light";
type View = "overview" | "how" | "security" | "vault";

const copy = {
  en: {
    nav: {
      overview: "Home",
      how: "Flow",
      security: "Security",
      vault: "Vault",
      deployed: "Etherlink Deployed",
      light: "Light",
      dark: "Dark",
    },
    hero: {
      badge: "TEZOS EVM HACKATHON 2026",
      title1: "Built for what comes __LAST__.",
      title2: "Your crypto shouldn't die with you.",
      title3: "",
      body:
        "AI-powered access continuity on Etherlink.",
      kicker:
        "Set one plan. LastKey watches the signal. Etherlink enforces the rule.",
      cta: "Open Vault Console",
      ctaDisconnected: "Connect Wallet",
      secondary: "Explore How It Works",
      powered: "Powered by Etherlink (Tezos EVM) · AI-guided · Self-custodial",
      protocolTitle: "Protocol overview",
      protocolCopy:
        "Your assets are yours today. LastKey exists so they do not become unreachable tomorrow.",
    },
    stats: {
      assets: "Assets at risk",
      days: "Day protection window",
      intermediaries: "Intermediaries",
    },
    quick: {
      readiness: "System readiness",
      parser: "Why LastKey exists",
      parserDesc: "If something happens to you, your assets should not stay stranded forever. LastKey turns your final instruction into an onchain continuity plan.",
      contract: "Watched onchain",
      contractDesc: "LastKey agents watch your wallet activity on Etherlink. Real outbound activity keeps your vault alive without relying on offchain promises.",
      monitor: "Day 293 warning",
      monitorDesc: "If no valid activity appears for 293 days, LastKey sends a warning email from lastkeyxyz@gmail.com before the final threshold is reached.",
      agent: "Day 300 execution",
      agentDesc: "If your wallet shows no life for the full 300-day window, LastKey transfers the vault to the beneficiary wallet you configured. Nothing is lost. Built on Tezos.",
    },
    how: {
      badge: "Flow",
      title: "Three signals. One final rule.",
      body:
        "LastKey now works in layers: manual check-in, detected onchain activity, and qualified auto-reset logic. Funds move only when the full protection window passes without a valid signal.",
      steps: [
        {
          title: "Manual check-in",
          desc: "You can always reset the protection window yourself with a direct onchain confirmation.",
        },
        {
          title: "Onchain activity detected",
          desc: "The agent watches real outbound wallet activity and surfaces that signal directly in LastKey.",
        },
        {
          title: "Qualified activity can reset",
          desc: "Signed outbound activity can refresh the timer even if you never open the site.",
        },
        {
          title: "Execution only after full inactivity",
          desc: "Day 293 triggers a warning email. Beneficiaries receive funds only if no valid signal appears by day 300.",
        },
      ],
    },
    security: {
      badge: "Security",
      title: "Clear rules, verifiable execution.",
      body:
        "LastKey makes the conditions legible. Onchain activity is watched, the reset source stays visible, and execution remains locked to Etherlink rules only.",
      cards: [
        {
          title: "What counts as alive",
          desc: "Manual check-ins and qualified signed wallet activity both count as protection signals.",
        },
        {
          title: "What does not count",
          desc: "Passive noise or the absence of a qualified signal will not keep the continuity window alive.",
        },
        {
          title: "Day 293 and day 300",
          desc: "LastKey sends a warning email from lastkeyxyz@gmail.com at day 293 and only permits execution after the full inactivity window expires.",
        },
      ],
    },
    vault: {
      title: "Your LastKey Vault",
      subtitle: "Review your protection window, see which signals count, and track whether activity was manual, detected, or auto-reset.",
      badge: "Protected by Etherlink",
      empty: "Connect your wallet to configure the vault console.",
    },
  },
  tr: {
    nav: {
      overview: "Genel Bakış",
      how: "Nasıl Çalışır",
      security: "Güvenlik",
      vault: "Vault Paneli",
      deployed: "Etherlink Yayında",
      light: "Açık",
      dark: "Koyu",
    },
    hero: {
      badge: "TEZOS EVM HACKATHON 2026",
      title1: "Erişimi koru.",
      title2: "Varlık planını",
      title3: "tasarımla sürdürülebilir kıl.",
      body:
        "LastKey, doğal dille yazılan süreklilik kurallarını Etherlink üzerinde çalışan bir onchain vault sistemine dönüştürür. Yüzeyde sade görünür; kritik garantiler ise zincir üstünde kalır.",
      kicker:
        "Mirasçı adreslerini tanımla, düzenli check-in yap ve süre dolarsa Etherlink'in son talimatı uygulamasına izin ver.",
      cta: "Vault Panelini Aç",
      ctaDisconnected: "Connect Wallet",
      secondary: "Nasıl Çalıştığını Gör",
      powered: "Etherlink (Tezos EVM) ile çalışır · AI destekli · Self-custodial",
      protocolTitle: "Protokol özeti",
      protocolCopy:
        "Manual recovery vaatleri yerine doğrulanabilir onchain execution isteyen kripto sahipleri için premium bir continuity rail.",
    },
    stats: {
      assets: "Risk altındaki varlık",
      days: "Koruma penceresi",
      intermediaries: "Aracı",
    },
    quick: {
      readiness: "Sistem durumu",
      parser: "AI parser aktif",
      parserDesc: "Doğal dil beneficiary yapısına dönüşür.",
      contract: "Kontrat hazır",
      contractDesc: "Etherlink vault mantığı şeffaf ve denetlenebilir kalır.",
      monitor: "Onchain izleme",
      monitorDesc: "Qualified wallet activity izlenir ve vault içinde görünür olur.",
      agent: "Agent döngüsü",
      agentDesc: "Günlük izleme ve check-in uyarı akışı.",
    },
    how: {
      badge: "Akış",
      title: "Üç sinyal. Tek nihai kural.",
      body:
        "LastKey artık katmanlı çalışır: manuel check-in, algılanan wallet aktivitesi ve qualified auto-reset mantığı. Fonlar yalnızca tam koruma penceresi geçerse hareket eder.",
      steps: [
        {
          title: "Manuel check-in",
          desc: "Koruma penceresini her zaman doğrudan onchain onayla sıfırlayabilirsin.",
        },
        {
          title: "Onchain aktivite algılanır",
          desc: "Agent gerçek outbound wallet aktivitesini izler ve bunu LastKey içinde gösterir.",
        },
        {
          title: "Qualified aktivite resetler",
          desc: "İmzalı outbound activity, site açılmasa bile timer'ı yenileyebilir.",
        },
        {
          title: "Tam hareketsizlikte icra",
          desc: "Mirasçılar yalnızca tam eşik süresi boyunca geçerli sinyal gelmezse ödeme alır.",
        },
      ],
    },
    security: {
      badge: "Güvenlik",
      title: "Kurallar net, icra doğrulanabilir.",
      body:
        "LastKey koşulları okunur hale getirir. Neyin activity sayıldığı açıktır, reset kaynağı görünürdür ve execution Etherlink üzerindeki kurallara bağlı kalır.",
      cards: [
        {
          title: "Yaşıyor sinyali nedir",
          desc: "Manuel check-in ve qualified signed wallet activity koruma sinyali sayılır.",
        },
        {
          title: "Neler sayılmaz",
          desc: "Pasif gürültü ya da qualified olmayan hareket continuity penceresini açık tutmaz.",
        },
        {
          title: "Mirasçılar ne zaman alır",
          desc: "Yalnızca warning aşaması ve tam inactivity eşiği geçerli reset olmadan tamamlanırsa.",
        },
      ],
    },
    vault: {
      title: "LastKey Vault",
      subtitle: "Koruma penceresini, hangi sinyalin geçerli olduğunu ve aktivitenin manuel mi agent tarafından mı algılandığını gör.",
      badge: "Etherlink tarafından korunuyor",
      empty: "Vault panelini yapılandırmak için cüzdanını bağla.",
    },
  },
} as const;

export default function HomeClient() {
  const { address, isConnected } = useAccount();
  const [language] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [view, setView] = useState<View>("overview");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("lastkey-theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("lastkey-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isConnected && view === "vault") {
      setView("overview");
    }
  }, [isConnected, view]);

  const t = copy[language];
  const shortAddress = useMemo(
    () => (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""),
    [address]
  );

  const navItems: Array<{ key: View; label: string }> = [
    { key: "overview", label: t.nav.overview },
    { key: "how", label: t.nav.how },
    { key: "security", label: t.nav.security },
    ...(isConnected ? [{ key: "vault" as View, label: t.nav.vault }] : []),
  ];

  const stats = [
    { value: "$140B+", label: t.stats.assets, tone: "text-[var(--blue-primary)]" },
    { value: "300", label: t.stats.days, tone: "text-[var(--gold-strong)]" },
    { value: "0", label: t.stats.intermediaries, tone: "text-[var(--success)]" },
  ];

  const heroAction = isConnected
    ? { label: t.hero.cta, onClick: () => setView("vault"), primary: true }
    : { label: t.hero.ctaDisconnected, onClick: () => null, primary: true };

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-shell">
            <Image
              src={theme === "light" ? "/lastkey-logo.png" : "/lastkey-logo-white.png"}
              alt="LastKey"
              width={212}
              height={64}
              priority
              className="h-12 w-auto rounded-2xl sm:h-14"
            />
            <div className="hidden md:block">
              <div className="font-display text-lg font-bold text-[var(--text-primary)]">LastKey</div>
              <div className="hidden text-sm text-[var(--text-secondary)] xl:block">
                Built for what comes last.
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setView(item.key)}
                className={`nav-link text-xs xl:text-sm ${view === item.key ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="toggle-pill hidden md:inline-flex">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={theme === "dark" ? "active" : ""}
              >
                {t.nav.dark}
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={theme === "light" ? "active" : ""}
              >
                {t.nav.light}
              </button>
            </div>

            <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 xl:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.nav.deployed}
            </span>

            <ConnectWallet language={language} />
          </div>
        </div>
      </header>

      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          {view === "overview" ? (
            <>
              <section className="panel relative overflow-hidden rounded-[36px] px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
                <div className="hero-halo left" />
                <div className="hero-halo right" />

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_390px] lg:items-center">
                  <div className="space-y-8">
                    <span className="section-badge">✦ {t.hero.badge} ✦</span>

                    <div className="space-y-5">
                      <h1 className="section-title max-w-5xl text-[clamp(4.15rem,8vw,7rem)] leading-[0.86]">
                        <span className="block">
                          {renderHeroTitle(t.hero.title1)}
                        </span>
                      </h1>
                      <p className="text-gradient max-w-3xl text-[clamp(1.7rem,3vw,2.65rem)] font-semibold leading-[1.08] animate-sheen">
                        {t.hero.title2}
                      </p>
                    <p className="max-w-2xl text-xl leading-9 text-[var(--text-secondary)]">
                      {t.hero.body}
                    </p>
                    <p className="max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                      {t.hero.kicker}
                    </p>
                  </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {isConnected ? (
                        <button
                          type="button"
                          onClick={heroAction.onClick}
                          className="btn-gold px-7 py-4 text-base"
                        >
                          {heroAction.label}
                        </button>
                      ) : (
                        <ConnectWallet large language={language} />
                      )}

                      <button
                        type="button"
                        onClick={() => setView("how")}
                        className="btn-secondary px-6 py-4 text-base"
                      >
                        {t.hero.secondary}
                      </button>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)]">{t.hero.powered}</p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {stats.map((item) => (
                        <article key={item.label} className="stat-card">
                          <p className={`font-display text-4xl font-bold ${item.tone}`}>{item.value}</p>
                          <p className="mt-2 text-sm text-[var(--text-muted)]">{item.label}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <aside className="panel-soft rounded-[30px] p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="eyebrow">{t.hero.protocolTitle}</p>
                        <h2 className="card-title mt-3 text-3xl">LastKey Rail</h2>
                      </div>
                      <div className="animate-orbit h-14 w-14 rounded-full border border-[rgba(212,181,122,0.3)] bg-[radial-gradient(circle,var(--gold-strong),transparent_70%)]" />
                    </div>

                    <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                      {t.hero.protocolCopy}
                    </p>

                    <div className="mt-8 space-y-4">
                      {[
                        { title: t.quick.parser, desc: t.quick.parserDesc, tone: "var(--blue-primary)" },
                        { title: t.quick.contract, desc: t.quick.contractDesc, tone: "var(--gold-strong)" },
                        { title: t.quick.monitor, desc: t.quick.monitorDesc, tone: "var(--blue-soft)" },
                        { title: t.quick.agent, desc: t.quick.agentDesc, tone: "var(--success)" },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.tone }}
                            />
                            <strong className="text-sm text-[var(--text-primary)]">{item.title}</strong>
                          </div>
                          <p className="mt-2 pl-5 text-sm leading-6 text-[var(--text-secondary)]">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {isConnected ? (
                      <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4">
                        <p className="eyebrow">{t.quick.readiness}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">{shortAddress}</span>
                          <span className="font-mono text-xs text-[var(--blue-primary)]">
                            Etherlink Shadownet
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </aside>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
                <div className="panel rounded-[32px] px-6 py-8 sm:px-8">
                  <p className="eyebrow">{t.how.badge}</p>
                  <h2 className="card-title mt-4 text-4xl">{t.how.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                    {t.how.body}
                  </p>

                  <div className="relative mt-10 space-y-4 pl-12">
                    <div className="timeline-line absolute left-5 top-3 h-[calc(100%-1.5rem)] w-px" />
                    {t.how.steps.map((step, index) => (
                      <div key={step.title} className="panel-soft relative rounded-[24px] p-5">
                        <div className="absolute -left-12 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(93,156,244,0.25)] bg-[var(--bg-raised)] font-mono text-[10px] text-[var(--blue-soft)]">
                          0{index + 1}
                        </div>
                        <h3 className="card-title text-xl">{step.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="panel-soft rounded-[30px] p-6">
                    <p className="eyebrow">{t.security.badge}</p>
                    <h3 className="card-title mt-4 text-2xl">{t.security.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                      {t.security.body}
                    </p>
                  </div>

                  {t.security.cards.map((card) => (
                    <div key={card.title} className="panel-soft rounded-[28px] p-5">
                      <h4 className="card-title text-lg">{card.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {view === "how" ? (
            <section className="panel rounded-[34px] px-6 py-8 sm:px-8 sm:py-10">
              <p className="eyebrow">{t.how.badge}</p>
              <h2 className="card-title mt-4 text-4xl">{t.how.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
                {t.how.body}
              </p>
              <div className="mt-10 grid gap-4 lg:grid-cols-2">
                {t.how.steps.map((step, index) => (
                  <div key={step.title} className="panel-soft rounded-[28px] p-6">
                    <div className="font-mono text-xs text-[var(--blue-soft)]">0{index + 1}</div>
                    <h3 className="card-title mt-3 text-2xl">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {view === "security" ? (
            <section className="panel rounded-[34px] px-6 py-8 sm:px-8 sm:py-10">
              <p className="eyebrow">{t.security.badge}</p>
              <h2 className="card-title mt-4 text-4xl">{t.security.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
                {t.security.body}
              </p>
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {t.security.cards.map((card) => (
                  <div key={card.title} className="panel-soft rounded-[28px] p-6">
                    <h3 className="card-title text-2xl">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {view === "vault" ? (
            <section className="space-y-6">
              <div className="panel rounded-[34px] px-6 py-7 sm:px-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="eyebrow">Vault Console</p>
                    <h2 className="card-title mt-4 text-4xl">{t.vault.title}</h2>
                    <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                      {isConnected ? t.vault.subtitle : t.vault.empty}
                    </p>
                    {isConnected ? (
                      <p className="font-mono mt-4 text-sm text-[var(--text-muted)]">{shortAddress}</p>
                    ) : null}
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-[rgba(93,156,244,0.25)] bg-[rgba(93,156,244,0.08)] px-4 py-2 text-xs font-medium text-[var(--blue-soft)]">
                    {t.vault.badge}
                  </span>
                </div>
              </div>

              {isConnected ? (
                <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                  <VaultStatus address={address!} language={language} />
                  <InheritanceForm address={address!} language={language} />
                </div>
              ) : (
                <div className="panel-soft rounded-[30px] p-8 text-center">
                  <p className="text-base text-[var(--text-secondary)]">{t.vault.empty}</p>
                </div>
              )}
            </section>
          ) : null}
        </div>
      </section>

      <Footer language={language} theme={theme} />
    </main>
  );
}

function renderHeroTitle(title: string) {
  const parts = title.split("__LAST__");
  if (parts.length === 1) return title;

  return (
    <>
      {parts[0]}
      <span className="text-gradient">last</span>
      {parts[1]}
    </>
  );
}

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
      overview: "Overview",
      how: "How it Works",
      security: "Security",
      vault: "Vault Console",
      deployed: "Etherlink Deployed",
      light: "Light",
      dark: "Dark",
    },
    hero: {
      badge: "TEZOS EVM HACKATHON 2026",
      title1: "Protect access.",
      title2: "Keep your vault",
      title3: "reachable by design.",
      body:
        "LastKey turns plain-language continuity rules into an onchain vault system on Etherlink. It feels calm on the surface, but every important action still resolves onchain.",
      kicker:
        "Define the heirs, keep checking in, and let Etherlink enforce the final instruction if your continuity window expires.",
      cta: "Open Vault Console",
      ctaDisconnected: "Connect Wallet",
      secondary: "Explore How It Works",
      powered: "Powered by Etherlink (Tezos EVM) · AI-guided · Self-custodial",
      protocolTitle: "Protocol overview",
      protocolCopy:
        "A premium continuity rail for crypto holders who want verifiable execution instead of manual recovery promises.",
    },
    stats: {
      assets: "Assets at risk",
      days: "Day protection window",
      intermediaries: "Intermediaries",
    },
    quick: {
      readiness: "System readiness",
      parser: "AI parser online",
      parserDesc: "Natural language becomes structured beneficiaries.",
      contract: "Contract armed",
      contractDesc: "Etherlink vault logic stays visible and inspectable.",
      agent: "Agent cycle",
      agentDesc: "Daily monitoring and check-in reminder flow.",
    },
    how: {
      badge: "Flow",
      title: "A simple route from intent to execution.",
      body:
        "LastKey keeps the interface human while the hard guarantees stay onchain. You write the plan once, review the structure, and keep your continuity window alive with a single check-in.",
      steps: [
        {
          title: "Describe your plan",
          desc: "Say who receives what, in plain English.",
        },
        {
          title: "AI structures it",
          desc: "Wallets, percentages, labels, and thresholds become clean contract parameters.",
        },
        {
          title: "Stay checked in",
          desc: "A single onchain ping resets your protection window.",
        },
        {
          title: "Execute only if needed",
          desc: "If the window expires, the contract distributes exactly what you approved.",
        },
      ],
    },
    security: {
      badge: "Security",
      title: "Built like a protocol, not a landing page demo.",
      body:
        "The UI stays elegant, but the trust model is explicit. Wallet signatures stay client-side, contract state stays queryable, and the execution flow remains tied to Etherlink.",
      cards: [
        {
          title: "Onchain state",
          desc: "Vault status, beneficiaries, and timers remain readable from the contract itself.",
        },
        {
          title: "Self-custodial",
          desc: "You keep the wallet. LastKey never turns into a custodial recovery service.",
        },
        {
          title: "AI with guardrails",
          desc: "AI structures the intent, but the final action is still a wallet-approved onchain transaction.",
        },
      ],
    },
    vault: {
      title: "Your LastKey Vault",
      subtitle: "Open the console to review status, structure beneficiaries, and keep your continuity rail alive.",
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
      ctaDisconnected: "Cüzdanı Bağla",
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
      agent: "Agent döngüsü",
      agentDesc: "Günlük izleme ve check-in uyarı akışı.",
    },
    how: {
      badge: "Akış",
      title: "Niyetten icraya sade bir rota.",
      body:
        "LastKey arayüzü insani kalır, sert garantiler ise zincirde durur. Planı bir kez yazarsın, yapıyı gözden geçirirsin ve koruma penceresini tek bir check-in ile yenilersin.",
      steps: [
        {
          title: "Planını tanımla",
          desc: "Kime ne gideceğini doğal dille yaz.",
        },
        {
          title: "AI yapılandırsın",
          desc: "Adresler, yüzdeler, etiketler ve eşikler kontrat parametresine dönüşür.",
        },
        {
          title: "Check-in yap",
          desc: "Tek bir onchain ping koruma penceresini sıfırlar.",
        },
        {
          title: "Gerekirse uygula",
          desc: "Süre dolarsa kontrat yalnızca senin onayladığın dağıtımı yapar.",
        },
      ],
    },
    security: {
      badge: "Güvenlik",
      title: "Landing page demosu gibi değil, protokol gibi tasarlandı.",
      body:
        "Arayüz şık kalır ama güven modeli nettir. İmzalar tarayıcı tarafında kalır, kontrat durumu sorgulanabilir olur ve execution akışı Etherlink'e bağlı kalır.",
      cards: [
        {
          title: "Onchain state",
          desc: "Vault durumu, beneficiary listesi ve sayaç doğrudan kontrattan okunur.",
        },
        {
          title: "Self-custodial",
          desc: "Cüzdan sende kalır. LastKey saklama hizmetine dönüşmez.",
        },
        {
          title: "AI + guardrails",
          desc: "AI niyeti yapılandırır; son adım yine cüzdan onaylı onchain işlemdir.",
        },
      ],
    },
    vault: {
      title: "LastKey Vault",
      subtitle: "Durumu gözden geçir, miras planını yapılandır ve continuity rail'i aktif tut.",
      badge: "Etherlink tarafından korunuyor",
      empty: "Vault panelini yapılandırmak için cüzdanını bağla.",
    },
  },
} as const;

export default function HomeClient() {
  const { address, isConnected } = useAccount();
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [view, setView] = useState<View>("overview");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("lastkey-theme") as Theme | null;
    const savedLanguage = window.localStorage.getItem("lastkey-language") as Language | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    if (savedLanguage === "en" || savedLanguage === "tr") setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("lastkey-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("lastkey-language", language);
  }, [language]);

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
              src="/lastkey-logo.png"
              alt="LastKey"
              width={168}
              height={48}
              priority
              className="h-11 w-auto rounded-2xl"
            />
            <div className="hidden md:block">
              <div className="font-display text-lg font-bold text-[var(--text-primary)]">LastKey</div>
              <div className="text-sm text-[var(--text-secondary)]">
                Access continuity for assets that matter.
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setView(item.key)}
                className={`nav-link text-sm ${view === item.key ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="toggle-pill hidden sm:inline-flex">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={language === "en" ? "active" : ""}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("tr")}
                className={language === "tr" ? "active" : ""}
              >
                TR
              </button>
            </div>

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
                      <h1 className="section-title max-w-4xl text-[clamp(3.6rem,8vw,6.7rem)] leading-[0.88]">
                        <span className="block">{t.hero.title1}</span>
                        <span className="text-gradient block animate-sheen">{t.hero.title2}</span>
                        <span className="text-gradient block animate-sheen">{t.hero.title3}</span>
                      </h1>
                      <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
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

      <Footer language={language} />
    </main>
  );
}

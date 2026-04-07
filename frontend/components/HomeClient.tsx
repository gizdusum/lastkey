"use client";

import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import InheritanceForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

const STEPS = [
  {
    step: "01",
    title: "Describe your plan",
    desc: "Type in plain English who gets what. No legal language.",
  },
  {
    step: "02",
    title: "AI structures it",
    desc: "GPT-4o converts your words into verified onchain beneficiary data.",
  },
  {
    step: "03",
    title: "Stay checked in",
    desc: "Tap once every 300 days. Each tap resets your continuity window.",
  },
  {
    step: "04",
    title: "Automatic execution",
    desc: "If your window expires, LastKey executes your plan on Etherlink. Exact. Permanent.",
  },
];

const STATS = [
  { value: "$140B+", tone: "text-[#4a8fe8]", label: "Assets lost annually" },
  { value: "300", tone: "text-[#c8a96e]", label: "Day protection window" },
  { value: "0", tone: "text-[#3fb07a]", label: "Intermediaries" },
];

export default function HomeClient() {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-transparent">
      <nav className="sticky top-0 z-50 h-[72px] border-b border-[rgba(74,143,232,0.1)] bg-[rgba(4,6,15,0.85)] backdrop-blur-[20px]">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src="/lastkey-logo.png"
              alt="LastKey"
              className="h-10 w-[148px] object-cover object-center [object-position:center_68%] sm:h-11 sm:w-[164px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Etherlink Deployed
            </span>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {!isConnected ? (
        <section className="px-6 pb-24 pt-20 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center rounded-full border border-[rgba(74,143,232,0.3)] bg-[rgba(74,143,232,0.08)] px-5 py-2 text-[11px] font-semibold tracking-[0.25em] text-[var(--blue-primary)]">
                ✦ TEZOS EVM HACKATHON 2026 ✦
              </span>
            </div>

            <div className="mt-10 max-w-5xl text-center">
              <h1
                className="animate-fade-up font-black tracking-[-0.05em] text-[var(--text-primary)]"
                style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 0.9 }}
              >
                <span className="block">Your keys.</span>
                <span className="animate-shimmer-text block">Even when you</span>
                <span className="animate-shimmer-text block">can&apos;t hold them.</span>
              </h1>

              <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6">
                <span className="h-px w-20 bg-gradient-to-r from-transparent via-[rgba(74,143,232,0.8)] to-[rgba(74,143,232,0.15)] sm:w-40" />
                <span className="animate-reach text-xl text-[var(--gold-bright)]">✦</span>
                <span className="h-px w-20 bg-gradient-to-r from-[rgba(200,169,110,0.15)] via-[rgba(200,169,110,0.8)] to-transparent sm:w-40" />
              </div>

              <div className="mx-auto mt-10 max-w-[520px] space-y-1 text-center text-[17px] leading-7 text-[var(--text-secondary)]">
                <p>AI-powered access continuity protocol on Etherlink.</p>
                <p>Set your plan once. Your assets are protected forever.</p>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4">
                <ConnectWallet large />
                <p className="text-sm text-[var(--text-secondary)]">
                  Powered by Etherlink (Tezos EVM) · Zero intermediaries
                </p>
              </div>
            </div>

            <div className="mt-16 grid w-full max-w-[520px] grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((item, index) => (
                <div
                  key={item.label}
                  className="glass-card animate-fade-up rounded-2xl p-5 text-center"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <p className={`text-4xl font-black ${item.tone}`}>{item.value}</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 w-full max-w-5xl">
              <p className="text-center text-xs tracking-[0.3em] text-[var(--text-muted)]">
                HOW IT WORKS
              </p>

              <div className="relative mt-12">
                <div className="absolute left-6 top-3 hidden h-[calc(100%-2rem)] border-l border-dashed border-[var(--blue-border)] md:block" />

                <div className="space-y-6">
                  {STEPS.map((item, index) => {
                    const reverse = index % 2 === 1;

                    return (
                      <div
                        key={item.step}
                        className={`grid items-start gap-6 md:grid-cols-[88px_minmax(0,1fr)] ${
                          reverse ? "md:grid-cols-[minmax(0,1fr)_88px]" : ""
                        }`}
                      >
                        <div className={`flex justify-center ${reverse ? "md:order-2" : ""}`}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--blue-border)] bg-[rgba(74,143,232,0.06)] font-mono text-sm font-bold text-[var(--blue-primary)]">
                            {item.step}
                          </div>
                        </div>

                        <div
                          className={`glass-card rounded-3xl p-6 ${reverse ? "md:order-1 md:text-right" : ""}`}
                        >
                          <h3 className="text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
                          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 pb-20 pt-14 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                  Your LastKey Vault
                </h2>
                <p className="font-mono text-sm text-[var(--text-muted)]">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-[rgba(74,143,232,0.2)] bg-[rgba(74,143,232,0.08)] px-4 py-2 text-xs font-semibold text-[var(--blue-primary)]">
                Protected by Etherlink
              </span>
            </div>

            <VaultStatus address={address!} />
            <InheritanceForm address={address!} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

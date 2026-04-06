"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import ContinuityForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

type ViewMode = "home" | "vault" | "how" | "security" | "faq";

const primaryCards = [
  {
    title: "Intent becomes structure",
    copy: "You describe the outcome in plain language. LastKey converts that into wallets, percentages, and an exact continuity rule.",
  },
  {
    title: "You keep control",
    copy: "A single check-in keeps the plan dormant. Nothing executes while you are still actively checking in.",
  },
  {
    title: "Etherlink carries it through",
    copy: "If the continuity window expires, the contract executes the plan exactly as it was anchored.",
  },
];

const infoViews: Record<Exclude<ViewMode, "home" | "vault">, { eyebrow: string; title: string; body: string }> = {
  how: {
    eyebrow: "How It Works",
    title: "A simple path from human intent to onchain execution.",
    body:
      "LastKey is built to feel straightforward. You connect, define who should receive assets, let AI structure the instruction, and then anchor that exact plan on Etherlink. The interface stays calm while the smart contract handles the hard guarantees underneath.",
  },
  security: {
    eyebrow: "Security",
    title: "Transparent rules, reviewable logic, no hidden black box.",
    body:
      "The goal is not vague automation. LastKey keeps the execution logic reviewable on Tezos EVM. AI helps structure the instruction, but the final continuity rail is explicit, inspectable, and anchored to a real contract address.",
  },
  faq: {
    eyebrow: "Why LastKey",
    title: "Built for continuity, not only for loss.",
    body:
      "LastKey covers broader access continuity scenarios: prolonged absence, device loss, illness, or the moment heirs need certainty. The product language stays human, but the system is still rigorous enough for an onchain workflow.",
  },
};

export default function HomeClient() {
  const { address, isConnected } = useAccount();
  const [view, setView] = useState<ViewMode>("home");

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const infoView = view === "how" || view === "security" || view === "faq" ? infoViews[view] : null;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(117,200,255,0.16),transparent_66%)] blur-3xl" />
        <div className="absolute right-[-8rem] top-[20rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(243,186,77,0.14),transparent_68%)] blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[30px] border border-white/10 bg-[rgba(7,12,24,0.82)] px-5 py-4 shadow-[0_16px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-4 text-left"
          >
            <div className="overflow-hidden rounded-[26px] border border-white/10 bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <Image
                src="/lastkey-logo.png"
                alt="LastKey"
                width={176}
                height={88}
                className="h-16 w-auto object-cover sm:h-20"
                priority
              />
            </div>
            <div>
              <p className="text-[1.8rem] font-semibold tracking-tight text-white">LastKey</p>
              <p className="text-sm text-slate-400 sm:text-base">
                Access continuity for the people you trust most
              </p>
            </div>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setView("home")}
              className={`rounded-full px-4 py-2.5 text-sm transition-colors ${
                view === "home"
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setView("how")}
              className={`rounded-full px-4 py-2.5 text-sm transition-colors ${
                view === "how"
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              How it Works
            </button>
            <button
              type="button"
              onClick={() => setView("security")}
              className={`rounded-full px-4 py-2.5 text-sm transition-colors ${
                view === "security"
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              Security
            </button>
            <button
              type="button"
              onClick={() => setView("faq")}
              className={`rounded-full px-4 py-2.5 text-sm transition-colors ${
                view === "faq"
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              Why LastKey
            </button>

            {isConnected ? (
              <button
                type="button"
                onClick={() => setView("vault")}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  view === "vault"
                    ? "bg-[var(--gold)] text-slate-950"
                    : "border border-white/10 text-slate-200 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                Open Vault
              </button>
            ) : null}

            <a
              href="https://faucet.etherlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white md:inline-flex"
            >
              Get Test XTZ
            </a>

            <ConnectWallet />
          </div>
        </div>
      </nav>

      {view === "home" ? (
        <section className="px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="hero-panel rounded-[44px] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
              <div className="mx-auto max-w-5xl text-center">
                <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold tracking-[0.28em] text-sky-200">
                  ACCESS CONTINUITY ON ETHERLINK
                </div>

                <h1 className="mt-8 text-[clamp(3.6rem,8vw,7.6rem)] font-black leading-[0.86] tracking-[-0.075em] text-white">
                  Your keys.
                  <br />
                  <span className="text-shimmer">Still protected when you disappear.</span>
                </h1>

                <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                  Create one continuity plan so the right wallet or heir wallets receive your
                  assets if you ever become unreachable, lose access, or stop checking in.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {!isConnected ? (
                    <ConnectWallet large />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView("vault")}
                      className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-[var(--gold)] px-7 py-4 text-base font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Open Vault
                    </button>
                  )}

                  <a
                    href="https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-[240px] items-center justify-center rounded-full border border-white/12 bg-white/6 px-7 py-4 text-base font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    View Contract
                  </a>
                </div>

                {isConnected ? (
                  <div className="mt-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    Connected wallet: {shortAddress}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {primaryCards.map((card) => (
                <div
                  key={card.title}
                  className="glass-panel rounded-[32px] p-7"
                >
                  <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate-300">{card.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="glass-panel rounded-[30px] p-6">
                <p className="text-5xl font-black text-white">$140B+</p>
                <p className="mt-2 text-sm text-slate-400">Assets at risk globally</p>
              </div>
              <div className="glass-panel rounded-[30px] p-6">
                <p className="text-5xl font-black text-[var(--gold)]">300</p>
                <p className="mt-2 text-sm text-slate-400">Day continuity window</p>
              </div>
              <div className="glass-panel rounded-[30px] p-6">
                <p className="text-5xl font-black text-[var(--success)]">0</p>
                <p className="mt-2 text-sm text-slate-400">Intermediaries needed</p>
              </div>
            </div>
          </div>
        </section>
      ) : view === "vault" ? (
        <section className="px-4 pb-24 pt-8 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setView("home")}
                className="rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                ← Back to Home
              </button>
            </div>

            <div className="glass-panel rounded-[44px] px-5 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-xs font-semibold tracking-[0.3em] text-sky-200/80">
                  LASTKEY VAULT
                </p>
                <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.4rem)] font-black tracking-[-0.05em] text-white">
                  One exact continuity rail.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-300">
                  This screen stays focused on your active plan, your current vault state,
                  and one final onchain action.
                </p>
              </div>

              <div className="mx-auto mt-6 max-w-3xl space-y-5">
                <VaultStatus address={address!} />
                <ContinuityForm address={address!} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-24 pt-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="glass-panel rounded-[40px] p-8 sm:p-10">
              <p className="text-xs font-semibold tracking-[0.3em] text-sky-200/80">
                {infoView?.eyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(2.4rem,5vw,4rem)] font-black tracking-[-0.05em] text-white">
                {infoView?.title}
              </h2>
              <p className="mt-6 text-base leading-9 text-slate-300">{infoView?.body}</p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

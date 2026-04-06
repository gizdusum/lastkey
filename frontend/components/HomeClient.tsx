"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import ContinuityForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

type ViewMode = "home" | "dashboard";

const SIGNALS = [
  {
    title: "Choose your trusted wallets",
    description: "Set one clear allocation for the people or wallets that should receive access if you stop responding.",
  },
  {
    title: "Check in with one onchain tap",
    description: "Any check-in resets your 300-day window. No paperwork, no third-party approval, no account manager.",
  },
  {
    title: "Let Etherlink carry it through",
    description: "If the window expires, the contract executes exactly what you approved and the record stays verifiable onchain.",
  },
];

export default function HomeClient() {
  const { address, isConnected } = useAccount();
  const [view, setView] = useState<ViewMode>("home");

  useEffect(() => {
    if (!isConnected) {
      setView("home");
      return;
    }

    setView("dashboard");
  }, [isConnected]);

  const showDashboard = isConnected && view === "dashboard";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/72 px-4 py-4 backdrop-blur-2xl sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-3 text-left"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
              <Image
                src="/lastkey-logo.png"
                alt="LastKey"
                width={120}
                height={60}
                className="h-11 w-auto object-cover sm:h-12"
                priority
              />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-950">LastKey</p>
              <p className="text-xs text-slate-500">
                Access continuity for the people you trust most
              </p>
            </div>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              href="https://faucet.etherlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex whitespace-nowrap rounded-full border border-slate-300 bg-white/85 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-amber-300 hover:text-slate-950"
            >
              Get Test XTZ
            </a>

            <ConnectWallet />
          </div>
        </div>
      </nav>

      {!showDashboard ? (
        <section className="px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
            <div className="w-full rounded-[36px] border border-slate-200/80 bg-white/88 p-8 text-center shadow-[0_45px_120px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-12">
              <div className="inline-flex rounded-full border border-amber-200 bg-amber-50/90 px-4 py-2 text-[11px] font-semibold tracking-[0.24em] text-amber-700">
                ETHERLINK ACCESS CONTINUITY
              </div>

              <h1 className="mx-auto mt-6 max-w-4xl text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.05em] text-slate-950">
                Your keys.
                <br />
                <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-slate-900 bg-clip-text text-transparent">
                  Even when you can&apos;t hold them.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Set one continuity plan for loss, absence, or the moment your heirs need
                certainty. If you stop checking in, LastKey can route your assets to the
                heir wallet or wallets you already approved.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => setView("dashboard")}
                    className="inline-flex min-w-[220px] justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Open Your Vault
                  </button>
                ) : (
                  <ConnectWallet large />
                )}

                <a
                  href="https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-[220px] justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
                >
                  View Onchain Contract
                </a>
              </div>

              <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                  <p className="text-4xl font-black tracking-tight text-slate-950">$140B+</p>
                  <p className="mt-2 text-sm text-slate-500">Assets at risk globally</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                  <p className="text-4xl font-black tracking-tight text-amber-600">300</p>
                  <p className="mt-2 text-sm text-slate-500">Day continuity window</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                  <p className="text-4xl font-black tracking-tight text-emerald-600">0</p>
                  <p className="mt-2 text-sm text-slate-500">Middlemen required</p>
                </div>
              </div>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-3">
              {SIGNALS.map((signal, index) => (
                <div
                  key={signal.title}
                  className="rounded-[28px] border border-white/12 bg-slate-950/82 p-6 text-white shadow-[0_24px_70px_rgba(2,6,23,0.32)] backdrop-blur-xl"
                >
                  <p className="text-xs font-semibold tracking-[0.28em] text-amber-300/90">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-white">{signal.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full rounded-[28px] border border-amber-500/20 bg-slate-950/76 p-6 text-center shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-xl">
              <p className="text-xs font-semibold tracking-[0.28em] text-amber-300">
                HACKATHON FIT
              </p>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                LastKey stays aligned with the Etherlink AI hackathon: AI structures a
                human instruction into wallet allocations, and an autonomous agent
                monitors and executes that plan through a verifiable Tezos EVM workflow.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-20 pt-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setView("home")}
                className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-100 transition-colors hover:border-white/30 hover:bg-white/12"
              >
                ← Back to Home
              </button>
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs text-slate-300">
                Dashboard
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-slate-950/78 p-5 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur sm:p-8">
              <div className="mb-6 rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-xs font-semibold tracking-[0.28em] text-slate-400">
                  LASTKEY VAULT
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  Calm, clear continuity.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Keep one trusted plan onchain, check in when you want, and let
                  Etherlink carry out exactly what you approved if you ever stop responding.
                </p>
              </div>

              <div className="mx-auto max-w-3xl space-y-5">
                <VaultStatus address={address!} />
                <ContinuityForm address={address!} />
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

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
  "Name the wallet or heir wallet you trust.",
  "Check in with one onchain tap whenever you want.",
  "If you're gone, unreachable, or unable to respond, Etherlink executes exactly what you set.",
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
    <main className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-3 text-left"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <Image
                src="/lastkey-logo.png"
                alt="LastKey"
                width={112}
                height={56}
                className="h-12 w-auto object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-slate-900">LastKey</p>
              <p className="text-[11px] text-slate-500">
                Continuity for the people you trust most
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <a
              href="https://faucet.etherlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-amber-300 hover:text-slate-900 sm:inline-flex"
            >
              Tezos Faucet
            </a>

            {isConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => setView("home")}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                    view === "home"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setView("dashboard")}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                    view === "dashboard"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Dashboard
                </button>
              </>
            ) : null}

            <ConnectWallet />
          </div>
        </div>
      </nav>

      {!showDashboard ? (
        <section className="px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.14)] backdrop-blur xl:p-12">
              <div className="mb-6 inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-amber-700">
                ETHERLINK ACCESS CONTINUITY
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-tight text-slate-950 sm:text-6xl">
                Your keys.
                <br />
                <span className="bg-gradient-to-r from-sky-500 to-slate-900 bg-clip-text text-transparent">
                  Even when you can&apos;t hold them.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Set one continuity plan for absence, device loss, or the day your heirs
                need certainty. If you fail to check in for 300 days, LastKey sends your
                assets to the wallet or heir wallets you already chose.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => setView("dashboard")}
                    className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Open Dashboard
                  </button>
                ) : (
                  <ConnectWallet large />
                )}

                <a
                  href="https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900"
                >
                  View Contract
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-3xl font-black text-slate-950">$140B+</p>
                  <p className="mt-1 text-xs text-slate-500">Assets at risk</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-3xl font-black text-amber-600">300</p>
                  <p className="mt-1 text-xs text-slate-500">Day continuity window</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-3xl font-black text-emerald-600">0</p>
                  <p className="mt-1 text-xs text-slate-500">Intermediaries required</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur xl:p-10">
              <p className="text-xs font-semibold tracking-[0.28em] text-slate-400">
                WHY IT WORKS
              </p>
              <div className="mt-6 space-y-4">
                {SIGNALS.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm leading-6 text-slate-200">{signal}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-300">
                  HACKATHON FIT
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  LastKey stays aligned with the Etherlink AI hackathon: AI
                  structures intent into wallet allocations, and an autonomous agent
                  monitors and executes an onchain workflow on Tezos EVM.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-16 pt-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setView("home")}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                ← Back to Home
              </button>
              <p className="text-right text-xs text-slate-400">
                Connected as
                <span className="ml-2 font-mono text-slate-200">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-950/78 p-5 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur sm:p-7">
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold tracking-[0.28em] text-slate-400">
                  LASTKEY VAULT
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Simple, verifiable continuity on Etherlink
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Set who should receive your assets, keep checking in when you want,
                  and let the chain handle the rest if you ever stop responding.
                </p>
              </div>

              <div className="space-y-5">
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

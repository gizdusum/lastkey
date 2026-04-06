"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import ContinuityForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

type ViewMode = "home" | "vault";

const overviewCards = [
  {
    title: "Plain-language setup",
    body: "Describe who should receive assets if you ever stop checking in. AI structures that instruction into an onchain plan.",
  },
  {
    title: "Check-in control",
    body: "You stay in charge. A single onchain check-in resets your continuity window whenever you want.",
  },
  {
    title: "Exact Etherlink execution",
    body: "If the window expires, the contract executes exactly what you approved, with a permanent onchain record.",
  },
];

const detailCards = [
  {
    id: "how-it-works",
    eyebrow: "How It Works",
    title: "A clean continuity flow, not a legal maze.",
    body: "LastKey is designed for clarity. You define one intent, AI structures it, and Etherlink preserves the execution path. The interface stays simple while the contract handles the exact rule set.",
  },
  {
    id: "security",
    eyebrow: "Security",
    title: "Transparent rules on Tezos EVM.",
    body: "The plan is not a vague promise. It becomes a concrete contract call path on Etherlink Shadownet, so the trigger logic and outcome remain reviewable onchain.",
  },
  {
    id: "faq",
    eyebrow: "FAQ",
    title: "Built for continuity, not just loss.",
    body: "The product narrative covers device loss, absence, illness, and unexpected life events. The point is continuity of access, not only inheritance.",
  },
];

export default function HomeClient() {
  const { address, isConnected } = useAccount();
  const [view, setView] = useState<ViewMode>("home");

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(98,189,255,0.24),transparent_35%)]" />
        <div className="absolute left-[-12rem] top-[18rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(78,126,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute right-[-10rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,209,102,0.16),transparent_62%)] blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[30px] border border-white/40 bg-white/82 px-5 py-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-4 text-left"
          >
            <div className="overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <Image
                src="/lastkey-logo.png"
                alt="LastKey"
                width={168}
                height={84}
                className="h-16 w-auto object-cover sm:h-20"
                priority
              />
            </div>
            <div>
              <p className="text-[1.75rem] font-semibold tracking-tight text-slate-950">
                LastKey
              </p>
              <p className="text-sm text-slate-500 sm:text-base">
                Access continuity for the people you trust most
              </p>
            </div>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {view === "home" ? (
              <>
                <a
                  href="#how-it-works"
                  className="rounded-full px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  How it works
                </a>
                <a
                  href="#security"
                  className="rounded-full px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  Security
                </a>
                <a
                  href="#faq"
                  className="rounded-full px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  FAQ
                </a>
              </>
            ) : null}

            <a
              href="https://faucet.etherlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-slate-300 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-amber-300 hover:text-slate-950 md:inline-flex"
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
            <div className="rounded-[44px] border border-white/55 bg-white/86 px-6 py-10 shadow-[0_50px_140px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:px-10 sm:py-14 lg:px-14">
              <div className="mx-auto max-w-5xl text-center">
                <div className="inline-flex rounded-full border border-sky-200 bg-sky-50/90 px-4 py-2 text-[11px] font-semibold tracking-[0.28em] text-sky-700">
                  ETHERLINK ACCESS CONTINUITY
                </div>

                <h1 className="mt-8 text-[clamp(3.6rem,8vw,7.4rem)] font-black leading-[0.88] tracking-[-0.07em] text-slate-950">
                  Your keys.
                  <br />
                  <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-slate-950 bg-clip-text text-transparent">
                    Calm when life is not.
                  </span>
                </h1>

                <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600">
                  Set one continuity plan so the right wallet or heir wallets receive your
                  assets if you ever become unreachable, lose access, or stop checking in
                  for an extended period.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {!isConnected ? (
                    <ConnectWallet large />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView("vault")}
                      className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Mirasçı göster
                    </button>
                  )}

                  <a
                    href="https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-[240px] items-center justify-center rounded-full border border-slate-300 bg-white/85 px-7 py-4 text-base font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
                  >
                    View Contract
                  </a>
                </div>

                {isConnected ? (
                  <div className="mt-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-2 text-sm text-emerald-700">
                    Wallet connected: {shortAddress}
                  </div>
                ) : null}

                <div className="mt-14 grid gap-4 text-left md:grid-cols-3">
                  <div className="rounded-[30px] border border-slate-200 bg-white/75 p-6">
                    <p className="text-5xl font-black tracking-tight text-slate-950">$140B+</p>
                    <p className="mt-2 text-sm text-slate-500">Assets at risk globally</p>
                  </div>
                  <div className="rounded-[30px] border border-slate-200 bg-white/75 p-6">
                    <p className="text-5xl font-black tracking-tight text-amber-600">300</p>
                    <p className="mt-2 text-sm text-slate-500">Day continuity window</p>
                  </div>
                  <div className="rounded-[30px] border border-slate-200 bg-white/75 p-6">
                    <p className="text-5xl font-black tracking-tight text-emerald-600">0</p>
                    <p className="mt-2 text-sm text-slate-500">Intermediaries needed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {overviewCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[32px] border border-white/10 bg-slate-950/82 p-7 text-white shadow-[0_28px_80px_rgba(2,6,23,0.3)] backdrop-blur-xl"
                >
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {detailCards.map((card) => (
                <section
                  id={card.id}
                  key={card.id}
                  className="rounded-[32px] border border-white/10 bg-slate-950/78 p-7 text-white shadow-[0_24px_70px_rgba(2,6,23,0.28)] backdrop-blur-xl"
                >
                  <p className="text-xs font-semibold tracking-[0.3em] text-amber-300">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight">{card.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate-300">{card.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-24 pt-8 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setView("home")}
                className="rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-slate-100 transition-colors hover:border-white/30 hover:bg-white/12"
              >
                ← Back to Home
              </button>
            </div>

            <div className="rounded-[44px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,16,31,0.92),rgba(10,20,38,0.86))] px-5 py-6 shadow-[0_38px_110px_rgba(2,6,23,0.35)] backdrop-blur-2xl sm:px-8 sm:py-8">
              <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-xs font-semibold tracking-[0.3em] text-sky-200/80">
                  LASTKEY VAULT
                </p>
                <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-[-0.05em] text-white">
                  One clean continuity rail.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-300">
                  Keep this page focused on the only things that matter: your current vault
                  state, your beneficiary plan, and one exact anchor action.
                </p>
              </div>

              <div className="mx-auto mt-6 max-w-3xl space-y-5">
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

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import ContinuityForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

type ViewMode = "home" | "dashboard";

const FEATURES = [
  {
    label: "Continuity Plan",
    copy: "Write one instruction in plain language. LastKey turns it into a clear wallet distribution flow.",
  },
  {
    label: "Check-in Rail",
    copy: "A single onchain check-in keeps your plan dormant and your control fully intact.",
  },
  {
    label: "Exact Execution",
    copy: "If the window expires, Etherlink executes the plan exactly as approved, with a permanent onchain record.",
  },
];

const DETAIL_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e", label: "Contract", external: true },
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,210,255,0.22)_0%,rgba(124,210,255,0.04)_42%,transparent_72%)] blur-2xl" />
        <div className="absolute right-[-6rem] top-[24rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.18)_0%,rgba(212,168,83,0.03)_45%,transparent_75%)] blur-2xl" />
      </div>

      <nav className="sticky top-0 z-50 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/40 bg-white/78 px-4 py-3 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-6">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-4 text-left"
          >
            <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <Image
                src="/lastkey-logo.png"
                alt="LastKey"
                width={148}
                height={74}
                className="h-14 w-auto object-cover sm:h-16"
                priority
              />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-slate-950">LastKey</p>
              <p className="text-sm text-slate-500">Access continuity for the people you trust most</p>
            </div>
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            {!showDashboard
              ? DETAIL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="rounded-full px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {link.label}
                  </a>
                ))
              : null}
          </div>

          <div className="flex items-center gap-2">
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

      {!showDashboard ? (
        <section className="px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-10">
            <div className="grid w-full gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
              <div className="rounded-[40px] border border-white/55 bg-white/86 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-12">
                <div className="inline-flex rounded-full border border-sky-200 bg-sky-50/90 px-4 py-2 text-[11px] font-semibold tracking-[0.24em] text-sky-700">
                  ETHERLINK ACCESS CONTINUITY
                </div>

                <h1 className="mt-8 max-w-4xl text-[clamp(3.6rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.06em] text-slate-950">
                  Keep access calm,
                  <br />
                  <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-slate-900 bg-clip-text text-transparent">
                    even when life is not.
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                  LastKey lets you define who should receive your assets if you ever
                  become unreachable, lose access, or stop checking in for a prolonged period.
                  One plan. One wallet rail. One exact outcome.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {isConnected ? (
                    <button
                      type="button"
                      onClick={() => setView("dashboard")}
                      className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Open Vault
                    </button>
                  ) : (
                    <ConnectWallet large />
                  )}

                  <a
                    href="#how-it-works"
                    className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
                  >
                    How it works
                  </a>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[28px] border border-slate-200 bg-white/75 p-5">
                    <p className="text-4xl font-black tracking-tight text-slate-950">$140B+</p>
                    <p className="mt-2 text-sm text-slate-500">Assets at risk</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 bg-white/75 p-5">
                    <p className="text-4xl font-black tracking-tight text-amber-600">300</p>
                    <p className="mt-2 text-sm text-slate-500">Day continuity window</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 bg-white/75 p-5">
                    <p className="text-4xl font-black tracking-tight text-emerald-600">0</p>
                    <p className="mt-2 text-sm text-slate-500">Intermediaries needed</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,34,0.92),rgba(10,25,48,0.84))] p-7 text-white shadow-[0_30px_90px_rgba(2,6,23,0.34)] backdrop-blur-2xl sm:p-9">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                  <p className="text-xs font-semibold tracking-[0.3em] text-sky-200/80">
                    LASTKEY SIGNAL
                  </p>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                    A gentler way to protect what matters.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Inspired by the calm feel of modern product launches, but built for an
                    onchain use case: predictable continuity, transparent rules, and an AI
                    layer that turns intent into a verifiable action plan.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {FEATURES.map((feature) => (
                    <div
                      key={feature.label}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                    >
                      <p className="text-sm font-semibold text-white">{feature.label}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{feature.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="how-it-works" className="grid w-full gap-4 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Describe the outcome",
                  copy: "Name the wallets you trust and the split you want. You can phrase it naturally.",
                },
                {
                  step: "02",
                  title: "Let AI structure it",
                  copy: "LastKey converts your sentence into beneficiary addresses, percentages, and a continuity rule.",
                },
                {
                  step: "03",
                  title: "Anchor it on Etherlink",
                  copy: "Once confirmed, the plan lives onchain and your future check-ins keep it dormant.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-[30px] border border-white/10 bg-slate-950/82 p-7 text-white shadow-[0_24px_70px_rgba(2,6,23,0.32)] backdrop-blur-xl"
                >
                  <p className="text-xs font-semibold tracking-[0.3em] text-amber-300">{item.step}</p>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.copy}</p>
                </div>
              ))}
            </div>

            <div
              id="security"
              className="w-full rounded-[32px] border border-white/10 bg-slate-950/78 p-7 text-center shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:p-9"
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-amber-300">SECURITY & FIT</p>
              <p className="mx-auto mt-4 max-w-4xl text-sm leading-8 text-slate-300">
                LastKey stays inside the Etherlink hackathon thesis: AI structures an
                instruction into wallet allocations, while an autonomous agent and
                smart contract carry out the onchain workflow on Tezos EVM. No fake
                decentralization claims, no vague black box. Just a clear AI-to-contract rail.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-24 pt-8 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setView("home")}
                className="rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-slate-100 transition-colors hover:border-white/30 hover:bg-white/12"
              >
                ← Back to Home
              </button>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                Dashboard
              </div>
            </div>

            <div className="rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,34,0.9),rgba(10,21,39,0.82))] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.38)] backdrop-blur-2xl sm:p-8">
              <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-7 text-center">
                <p className="text-xs font-semibold tracking-[0.3em] text-sky-200/80">
                  LASTKEY VAULT
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white">
                  One clean continuity rail.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  Keep your plan simple here. The technical detail stays in the contract,
                  while this screen stays focused on status, check-in, and a single anchor action.
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

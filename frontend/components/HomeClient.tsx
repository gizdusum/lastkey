"use client";

import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import InheritanceForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

export default function HomeClient() {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-[#06070f]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#06070f]/80 px-6 py-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="animate-key-pulse text-2xl text-amber-400">🔑</span>
          <div>
            <h1 className="text-base font-bold leading-none tracking-tight">LastKey</h1>
            <p className="text-[10px] tracking-[0.3em] text-gray-500">
              ETHERLINK ACCESS CONTINUITY
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs text-green-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Etherlink Deployed
          </span>
          <ConnectWallet />
        </div>
      </nav>

      {!isConnected ? (
        <section className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex items-center gap-2">
            <span className="rounded-full border border-amber-400/30 px-4 py-1.5 text-xs tracking-[0.3em] text-amber-300">
              LITE RELEASE // ETHERLINK DEPLOYED // TEZOS EVM
            </span>
          </div>

          <h2 className="mb-6 text-5xl font-black leading-[0.9] tracking-tight sm:text-7xl">
            Your keys.
            <br />
            <span className="animate-shimmer">
              Even when you
              <br />
              can&apos;t hold them.
            </span>
          </h2>

          <p className="mb-4 max-w-xl text-lg leading-relaxed text-gray-400">
            AI-powered access continuity on Etherlink. Set it once. It lasts forever.
          </p>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-gray-500">
            Set your continuity plan once. If you go offline for{" "}
            <strong className="text-white">300 days</strong> — lost device, extended
            absence, or the unexpected — your assets reach exactly who you intended.
          </p>

          <ConnectWallet large />

          <p className="mt-4 text-xs text-gray-600">
            Powered by Etherlink (Tezos EVM) · Low gas · Fast finality
          </p>

          <div className="mt-16 grid w-full max-w-lg grid-cols-3 gap-4 text-center sm:gap-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black text-amber-400 sm:text-3xl">$140B+</p>
              <p className="mt-1 text-xs text-gray-500">Assets at risk</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black text-amber-300 sm:text-3xl">300</p>
              <p className="mt-1 text-xs text-gray-500">Day window</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black text-green-400 sm:text-3xl">0</p>
              <p className="mt-1 text-xs text-gray-500">Intermediaries</p>
            </div>
          </div>

          <div className="mt-20 w-full max-w-2xl text-left">
            <h3 className="mb-6 text-center text-xs tracking-[0.3em] text-gray-500">
              HOW IT WORKS
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Write your plan",
                  desc:
                    "Describe in plain English who should receive your assets and under what conditions. No legal language needed.",
                },
                {
                  step: "02",
                  title: "AI structures it",
                  desc:
                    "Our AI converts your words into a verified onchain continuity contract — wallet addresses, percentages, all confirmed.",
                },
                {
                  step: "03",
                  title: "Stay checked in",
                  desc:
                    "Tap 'I'm Still Here' whenever you like. Each tap resets your 300-day continuity window. One transaction, done.",
                },
                {
                  step: "04",
                  title: "Automatic execution",
                  desc:
                    "If your window expires without a check-in, LastKey executes your plan on Etherlink. Trustless. Permanent. Exact.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="shrink-0 text-2xl font-black text-gray-700">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl px-4 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black">Your LastKey Vault</h2>
            <p className="mt-1 text-sm text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>

          <VaultStatus address={address!} />
          <InheritanceForm address={address!} />
        </section>
      )}

      <Footer />
    </main>
  );
}

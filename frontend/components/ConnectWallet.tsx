"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { etherlinkTestnet } from "@/lib/wagmi-config";

interface ConnectWalletProps {
  large?: boolean;
}

export default function ConnectWallet({
  large = false,
}: ConnectWalletProps) {
  const { address, chain, isConnected } = useAccount();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const baseClass = large
    ? "min-w-[220px] px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg"
    : "px-4 py-2.5 text-sm";

  if (!isConnected) {
    return (
      <button
        onClick={() => connectAsync({ connector: injected() })}
        disabled={isPending}
        className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[var(--gold)] font-semibold text-slate-950 transition-all duration-200 hover:brightness-105 disabled:opacity-60 ${baseClass}`}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  if (chain?.id !== etherlinkTestnet.id) {
    return (
      <button
        onClick={() => switchChainAsync({ chainId: etherlinkTestnet.id })}
        disabled={isSwitching}
        className="rounded-full bg-[var(--danger)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {isSwitching ? "Switching..." : "⚠️ Switch to Etherlink"}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-300 lg:block">
        {chain?.name || "Etherlink Shadownet"}
      </div>
      <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-mono text-slate-200">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
      </div>
      <button
        onClick={() => disconnect()}
        className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        Disconnect
      </button>
    </div>
  );
}

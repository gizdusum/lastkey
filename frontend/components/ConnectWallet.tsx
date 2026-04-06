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

  const baseClass = large ? "px-10 py-5 text-lg" : "px-5 py-2.5 text-sm";

  if (!isConnected) {
    return (
      <button
        onClick={() => connectAsync({ connector: injected() })}
        disabled={isPending}
        className={`rounded-full bg-amber-500 font-bold text-black transition-all duration-200 hover:bg-amber-400 disabled:opacity-60 ${baseClass}`}
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
        className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-400 disabled:opacity-60"
      >
        {isSwitching ? "Switching..." : "⚠️ Switch to Etherlink"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 sm:block">
        {chain?.name || "Etherlink Shadownet"}
      </div>
      <div className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-700">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
      </div>
      <button
        onClick={() => disconnect()}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-slate-900 hover:text-slate-950"
      >
        Disconnect
      </button>
    </div>
  );
}

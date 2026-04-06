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
        className={`rounded-xl bg-amber-500 font-bold text-black transition-all duration-200 hover:bg-amber-400 disabled:opacity-60 ${baseClass}`}
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
        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-400 disabled:opacity-60"
      >
        {isSwitching ? "Switching..." : "⚠️ Switch to Etherlink"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-gray-300">
        {chain?.name || "Etherlink Shadownet"}
      </div>
      <button
        onClick={() => disconnect()}
        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-mono transition-all hover:bg-white/20"
      >
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Disconnect"}
      </button>
    </div>
  );
}

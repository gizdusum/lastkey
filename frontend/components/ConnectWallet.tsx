"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { etherlinkTestnet } from "@/lib/wagmi-config";

type Language = "en" | "tr";

export default function ConnectWallet({
  large = false,
  language = "en",
}: {
  large?: boolean;
  language?: Language;
}) {
  const { address, chain, isConnected } = useAccount();
  const { connectAsync, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const cls = large ? "px-8 py-4 text-base" : "px-4 py-3 text-sm";
  const copy = {
    en: {
      missing: "MetaMask not found. Please install MetaMask.",
      connect: "Connect Wallet",
      connecting: "Connecting...",
      switch: "Switch to Etherlink",
      switching: "Switching...",
      disconnect: "Disconnect",
    },
    tr: {
      missing: "MetaMask bulunamadı. Lütfen MetaMask yükleyin.",
      connect: "Cüzdanı Bağla",
      connecting: "Bağlanıyor...",
      switch: "Etherlink'e Geç",
      switching: "Geçiliyor...",
      disconnect: "Bağlantıyı Kes",
    },
  }[language];

  const handleConnect = async () => {
    const c = connectors[0];
    if (!c) {
      alert(copy.missing);
      return;
    }
    try {
      await connectAsync({ connector: c });
    } catch (e: unknown) {
      if (e instanceof Error && !e.message.includes("rejected")) console.error(e);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleConnect}
          disabled={isPending}
          className={`btn-gold disabled:opacity-60 ${cls}`}
        >
          {isPending ? copy.connecting : copy.connect}
        </button>
        {error ? <p className="text-xs text-[var(--danger)]">{error.message.slice(0, 80)}</p> : null}
      </div>
    );
  }

  if (chain?.id !== etherlinkTestnet.id) {
    return (
      <button
        onClick={() => switchChainAsync({ chainId: etherlinkTestnet.id }).catch(console.error)}
        disabled={switching}
        className="rounded-2xl border border-red-500/30 bg-[rgba(235,103,103,0.12)] px-4 py-3 text-sm font-bold text-red-300 transition-all hover:border-red-400/40 hover:bg-[rgba(235,103,103,0.18)] disabled:opacity-60"
      >
        {switching ? copy.switching : `⚠ ${copy.switch}`}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-panel)] px-3 py-2 text-xs text-[var(--text-secondary)]">
        {chain.name}
      </span>
      <button
        onClick={() => disconnect()}
        className="font-mono rounded-full border border-[var(--border-subtle)] bg-[var(--bg-panel)] px-4 py-2 text-sm text-[var(--text-primary)] transition-all hover:border-[rgba(93,156,244,0.25)] hover:bg-[rgba(93,156,244,0.08)]"
        title={copy.disconnect}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    </div>
  );
}

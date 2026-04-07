"use client";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { etherlinkTestnet } from "@/lib/wagmi-config";

export default function ConnectWallet({ large = false }: { large?: boolean }) {
  const { address, chain, isConnected } = useAccount();
  const { connectAsync, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const cls = large ? "px-10 py-5 text-lg" : "px-5 py-2.5 text-sm";

  const handleConnect = async () => {
    const c = connectors[0];
    if (!c) { alert("MetaMask bulunamadı. Lütfen MetaMask yükleyin."); return; }
    try { await connectAsync({ connector: c }); }
    catch (e: unknown) { if (e instanceof Error && !e.message.includes("rejected")) console.error(e); }
  };

  if (!isConnected) return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={handleConnect} disabled={isPending}
        className={`btn-gold disabled:opacity-60 ${cls}`}>
        {isPending ? "Bağlanıyor..." : "Connect Wallet"}
      </button>
      {error && <p className="text-xs text-red-400">{error.message.slice(0,80)}</p>}
    </div>
  );

  if (chain?.id !== etherlinkTestnet.id) return (
    <button onClick={() => switchChainAsync({ chainId: etherlinkTestnet.id }).catch(console.error)}
      disabled={switching}
      className="rounded-xl border border-red-400/30 bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(224,85,85,0.25)] transition-all hover:-translate-y-0.5 hover:bg-red-400 disabled:opacity-60">
      {switching ? "Değiştiriliyor..." : "⚠️ Etherlink'e Geç"}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-[var(--text-secondary)]">
        {chain.name}
      </span>
      <button onClick={() => disconnect()}
        className="font-mono rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-[var(--text-primary)] transition-all hover:bg-white/20">
        {address?.slice(0,6)}...{address?.slice(-4)}
      </button>
    </div>
  );
}

"use client";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import { etherlinkTestnet } from "@/lib/wagmi-config";
import ExplorerLink from "./ExplorerLink";

export default function ActivityPing() {
  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handlePing = async () => {
    if (chain?.id !== etherlinkTestnet.id) {
      try { await switchChainAsync({ chainId: etherlinkTestnet.id }); }
      catch { return; }
    }
    writeContract({ address: DEADDROP_ADDRESS, abi: DEADDROP_ABI, functionName: "pingActivity", chainId: etherlinkTestnet.id });
  };

  if (isSuccess) return (
    <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-4 text-center">
      <p className="text-sm font-bold text-green-400">✅ Check-in onaylandı</p>
      <p className="mt-1 text-xs text-gray-500">300 günlük pencere sıfırlandı</p>
      {txHash && <div className="mt-2"><ExplorerLink type="tx" hash={txHash} label="Explorer'da gör →" /></div>}
    </div>
  );

  if (error) return (
    <div className="space-y-2">
      <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-4 text-center">
        <p className="text-sm text-red-400">İşlem başarısız</p>
        <p className="mt-1 text-xs text-gray-500 break-words">{error.message.slice(0,120)}</p>
      </div>
      <button onClick={reset} className="w-full py-2 text-xs text-gray-500 hover:text-white">Tekrar dene</button>
    </div>
  );

  return (
    <button onClick={handlePing} disabled={isPending || confirming}
      className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-4 text-sm font-bold hover:bg-white/15 disabled:opacity-50">
      {isPending ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />MetaMask&apos;ta onayla...</>)
       : confirming ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/40 border-t-cyan-400" />Etherlink&apos;e kaydediliyor...</>)
       : (<><span className="text-amber-400">🔑</span>I&apos;m Still Here — Timer Sıfırla</>)}
    </button>
  );
}

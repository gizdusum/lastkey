"use client";

import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import { etherlinkTestnet } from "@/lib/wagmi-config";
import ExplorerLink from "./ExplorerLink";

type Language = "en" | "tr";

export default function ActivityPing({ language = "en" }: { language?: Language }) {
  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const copy = {
    en: {
      success: "Check-in confirmed",
      successBody: "Your 300 day continuity window has been reset.",
      open: "View in explorer →",
      failed: "Transaction failed",
      retry: "Try again",
      sign: "Confirm in MetaMask...",
      recording: "Recording on Etherlink...",
      action: "I'm Still Here — Reset Timer",
    },
    tr: {
      success: "Check-in onaylandı",
      successBody: "300 günlük continuity penceresi sıfırlandı.",
      open: "Explorer'da gör →",
      failed: "İşlem başarısız",
      retry: "Tekrar dene",
      sign: "MetaMask'ta onayla...",
      recording: "Etherlink'e kaydediliyor...",
      action: "I'm Still Here — Süreyi Sıfırla",
    },
  }[language];

  const handlePing = async () => {
    if (chain?.id !== etherlinkTestnet.id) {
      try {
        await switchChainAsync({ chainId: etherlinkTestnet.id });
      } catch {
        return;
      }
    }
    writeContract({
      address: DEADDROP_ADDRESS,
      abi: DEADDROP_ABI,
      functionName: "pingActivity",
      chainId: etherlinkTestnet.id,
    });
  };

  if (isSuccess) {
    return (
      <div className="rounded-[22px] border border-[rgba(75,193,132,0.24)] bg-[rgba(75,193,132,0.1)] p-4 text-center">
        <p className="font-display text-lg font-bold text-[var(--success)]">{copy.success}</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.successBody}</p>
        {txHash ? (
          <div className="mt-3">
            <ExplorerLink type="tx" hash={txHash} label={copy.open} className="text-[var(--blue-soft)]" />
          </div>
        ) : null}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="rounded-[22px] border border-[rgba(235,103,103,0.24)] bg-[rgba(235,103,103,0.1)] p-4 text-center">
          <p className="font-display text-base font-bold text-[var(--danger)]">{copy.failed}</p>
          <p className="mt-2 break-words text-sm text-[var(--text-secondary)]">
            {error.message.slice(0, 120)}
          </p>
        </div>
        <button onClick={reset} className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          {copy.retry}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handlePing}
      disabled={isPending || confirming}
      className="btn-secondary flex w-full items-center justify-center gap-2 px-5 py-4 text-sm disabled:opacity-60"
    >
      {isPending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {copy.sign}
        </>
      ) : confirming ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--blue-soft)]/40 border-t-[var(--blue-soft)]" />
          {copy.recording}
        </>
      ) : (
        <>
          <span className="text-[var(--gold-strong)]">✦</span>
          {copy.action}
        </>
      )}
    </button>
  );
}

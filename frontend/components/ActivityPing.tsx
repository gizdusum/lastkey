"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LASTKEY_ABI, LASTKEY_ADDRESS } from "@/lib/contract";
import ExplorerLink from "./ExplorerLink";

export default function ActivityPing() {
  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handlePing = () => {
    writeContract({
      address: LASTKEY_ADDRESS,
      abi: LASTKEY_ABI,
      functionName: "pingActivity",
    });
  };

  if (isSuccess) {
    return (
      <div className="animate-fade-in rounded-xl border border-green-500/30 bg-green-900/20 p-4 text-center">
        <p className="text-sm font-bold text-green-400">✅ Check-in confirmed onchain</p>
        <p className="mt-1 text-xs text-gray-500">Your continuity window has been reset</p>
        {txHash ? (
          <div className="mt-2">
            <ExplorerLink type="tx" hash={txHash} label="View on Etherlink Explorer →" />
          </div>
        ) : null}
      </div>
    );
  }

  if (writeError) {
    return (
      <div className="space-y-2">
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-4 text-center">
          <p className="text-sm text-red-400">Transaction failed</p>
          <p className="mt-1 break-words text-xs text-gray-500">
            {writeError.message?.slice(0, 100)}
          </p>
        </div>
        <button
          onClick={reset}
          className="w-full py-2 text-xs text-gray-500 transition-colors hover:text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handlePing}
      disabled={isPending || isConfirming}
      className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-4 text-sm font-bold transition-all duration-200 hover:bg-white/15 disabled:opacity-50"
    >
      {isPending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Confirm in MetaMask...
        </>
      ) : isConfirming ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/40 border-t-cyan-400" />
          Recording on Etherlink...
        </>
      ) : (
        <>
          <span className="text-amber-400 transition-transform group-hover:scale-110">🔑</span>
          I&apos;m Still Here — Reset Timer
        </>
      )}
    </button>
  );
}

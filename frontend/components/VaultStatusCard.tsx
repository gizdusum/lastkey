"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { LASTKEY_ABI, LASTKEY_ADDRESS } from "@/lib/contract";
import ActivityPing from "./ActivityPing";

interface VaultStatusProps {
  address: string;
}

export default function VaultStatus({ address }: VaultStatusProps) {
  const {
    data: status,
    isLoading,
  } = useReadContract({
    address: LASTKEY_ADDRESS,
    abi: LASTKEY_ABI,
    functionName: "getVaultStatus",
    args: [address as `0x${string}`],
    query: { refetchInterval: 15000 },
  });

  const { data: beneficiaries } = useReadContract({
    address: LASTKEY_ADDRESS,
    abi: LASTKEY_ABI,
    functionName: "getBeneficiaries",
    args: [address as `0x${string}`],
    query: { enabled: !!status?.[0] },
  });

  if (isLoading) {
    return (
      <div className="mb-6 animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 h-4 w-1/3 rounded bg-white/10" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!status || !status[0]) {
    return (
      <div className="mb-6 rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-slate-300">No continuity vault yet.</p>
        <p className="mt-1 text-xs text-slate-500">Create one below when you are ready.</p>
      </div>
    );
  }

  const [
    ,
    executed,
    warningIssued,
    ,
    daysInactive,
    daysUntilExecution,
    vaultBalance,
    beneficiaryCount,
  ] = status;

  const days = Number(daysInactive);
  const remaining = Number(daysUntilExecution);
  const balance = formatEther(vaultBalance);
  const progress = Math.min((days / 300) * 100, 100);

  const urgency = remaining <= 7 ? "critical" : remaining <= 30 ? "warning" : "safe";

  const urgencyStyle = {
    safe: {
      border: "border-amber-500/20",
      bg: "bg-amber-900/10",
      color: "text-amber-400",
      bar: "bg-amber-400",
      badge: "bg-amber-900/40 text-amber-300 border-amber-500/30",
    },
    warning: {
      border: "border-yellow-500/20",
      bg: "bg-yellow-900/10",
      color: "text-yellow-400",
      bar: "bg-yellow-400",
      badge: "bg-yellow-900/40 text-yellow-400 border-yellow-500/30",
    },
    critical: {
      border: "border-red-500/30",
      bg: "bg-red-900/10",
      color: "text-red-400",
      bar: "bg-red-400",
      badge: "bg-red-900/40 text-red-400 border-red-500/30",
    },
  }[urgency];

  const beneWallets = beneficiaries?.[0] ?? [];
  const benePercentages = beneficiaries?.[1] ?? [];
  const beneLabels = beneficiaries?.[2] ?? [];

  return (
    <div
      className={`mb-6 rounded-[28px] border p-6 transition-all ${urgencyStyle.border} ${urgencyStyle.bg}`}
    >
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-white">LastKey Status</h3>
          <p className="mt-1 text-sm text-slate-400">Locked balance: {balance} XTZ</p>
        </div>
        <div className="flex items-center gap-2">
          {warningIssued ? (
            <span className="rounded-full border border-yellow-500/30 bg-yellow-900/40 px-2 py-1 text-xs text-yellow-400">
              ⚠️ Check-in Overdue
            </span>
          ) : null}
          <span className={`rounded-full border px-3 py-1 font-mono text-xs ${urgencyStyle.badge}`}>
            {executed ? "EXECUTED" : "PROTECTED"}
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-black/30 p-4 text-center">
          <p className={`text-3xl font-black ${urgencyStyle.color}`}>{days}</p>
          <p className="mt-1 text-[10px] text-gray-500">DAYS SINCE CHECK-IN</p>
        </div>
        <div className="rounded-2xl bg-black/30 p-4 text-center">
          <p className={`text-3xl font-black ${remaining <= 30 ? "text-red-400" : "text-white"}`}>
            {remaining}
          </p>
          <p className="mt-1 text-[10px] text-gray-500">DAYS REMAINING</p>
        </div>
        <div className="rounded-2xl bg-black/30 p-4 text-center">
          <p className="text-3xl font-black text-gray-400">{Number(beneficiaryCount)}</p>
          <p className="mt-1 text-[10px] text-gray-500">BENEFICIARIES</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-1.5 flex justify-between text-[10px] text-gray-600">
          <span>Window progress</span>
          <span>{progress.toFixed(1)}% to execution</span>
          <span>300 days</span>
        </div>
        <div className="h-2 w-full rounded-full bg-black/50">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${urgencyStyle.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {beneWallets.length > 0 ? (
        <div className="mb-5">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-gray-500">BENEFICIARIES</p>
          <div className="space-y-1.5">
            {beneWallets.map((wallet, i) => {
              const walletString = String(wallet);
              return (
                <div
                  key={`${walletString}-${i}`}
                  className="flex flex-col gap-2 rounded-2xl bg-black/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize text-gray-400">
                      {String(beneLabels[i] ?? "")}
                    </span>
                    <span className="font-mono text-[10px] text-gray-600">
                      {walletString.slice(0, 6)}...{walletString.slice(-4)}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${urgencyStyle.color}`}>
                    {Number(benePercentages[i]) / 100}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {!executed ? <ActivityPing /> : null}
    </div>
  );
}

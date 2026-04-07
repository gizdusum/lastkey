"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import ActivityPing from "./ActivityPing";

interface VaultStatusProps {
  address: string;
}

export default function VaultStatus({ address }: VaultStatusProps) {
  const {
    data: status,
    isLoading,
  } = useReadContract({
    address: DEADDROP_ADDRESS,
    abi: DEADDROP_ABI,
    functionName: "getVaultStatus",
    args: [address as `0x${string}`],
    query: { refetchInterval: 15000 },
  });

  const { data: beneficiaries } = useReadContract({
    address: DEADDROP_ADDRESS,
    abi: DEADDROP_ABI,
    functionName: "getBeneficiaries",
    args: [address as `0x${string}`],
    query: { enabled: !!status?.[0] },
  });

  if (isLoading) {
    return (
      <div className="blue-glow-card mb-6 animate-pulse rounded-3xl p-7">
        <div className="mb-4 h-4 w-1/3 rounded bg-white/10" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!status || !status[0]) {
    return (
      <div className="blue-glow-card mb-6 rounded-3xl p-7 text-center">
        <p className="text-sm text-[var(--text-secondary)]">No vault found for this wallet.</p>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
          Set your continuity plan below
        </p>
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
    <div className={`blue-glow-card mb-6 rounded-3xl p-7 transition-all ${urgencyStyle.bg}`}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-[-0.03em]">LastKey Status</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Locked balance: {balance} XTZ</p>
        </div>
        <div className="flex items-center gap-2">
          {warningIssued ? (
            <span className="rounded-full border border-yellow-500/30 bg-yellow-900/40 px-3 py-1 text-xs font-medium text-yellow-300">
              ⚠️ Check-in Overdue
            </span>
          ) : null}
          <span
            className={`rounded-full border px-3 py-1 font-mono text-xs ${
              executed
                ? "border-[rgba(200,169,110,0.35)] bg-[rgba(200,169,110,0.12)] text-[var(--gold-bright)]"
                : "border-[rgba(74,143,232,0.35)] bg-[rgba(74,143,232,0.12)] text-[var(--blue-primary)]"
            }`}
          >
            {executed ? "EXECUTED" : "PROTECTED"}
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-black/40 p-5 text-center">
          <p className={`text-4xl font-black ${urgencyStyle.color}`}>{days}</p>
          <p className="font-mono mt-2 text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            Days Since Check-In
          </p>
        </div>
        <div className="rounded-2xl bg-black/40 p-5 text-center">
          <p className={`text-4xl font-black ${remaining <= 30 ? "text-red-400" : "text-white"}`}>
            {remaining}
          </p>
          <p className="font-mono mt-2 text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            Days Remaining
          </p>
        </div>
        <div className="rounded-2xl bg-black/40 p-5 text-center">
          <p className="text-4xl font-black text-white">{Number(beneficiaryCount)}</p>
          <p className="font-mono mt-2 text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            Beneficiaries
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-[10px] text-[var(--text-muted)]">
          <span>Last activity</span>
          <span>{progress.toFixed(1)}% to execution</span>
          <span>300 days</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-black/60">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[#4a8fe8] to-[#c8a96e] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {beneWallets.length > 0 ? (
        <div className="mb-5">
          <p className="font-mono mb-3 text-[9px] tracking-[0.3em] text-[var(--text-muted)]">
            BENEFICIARIES
          </p>
          <div className="space-y-1.5">
            {beneWallets.map((wallet, i) => {
              const walletString = String(wallet);
              return (
                <div
                  key={`${walletString}-${i}`}
                  className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm capitalize text-[var(--text-secondary)]">
                      {String(beneLabels[i] ?? "")}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {walletString.slice(0, 6)}...{walletString.slice(-4)}
                    </span>
                  </div>
                  <span className="text-gradient-gold text-lg font-black">
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

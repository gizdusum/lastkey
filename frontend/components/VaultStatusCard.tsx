"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import ActivityPing from "./ActivityPing";

type Language = "en" | "tr";

interface VaultStatusProps {
  address: string;
  language?: Language;
}

export default function VaultStatus({ address, language = "en" }: VaultStatusProps) {
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

  const copy = {
    en: {
      noVault: "No vault found for this wallet.",
      setup: "Create your continuity plan below.",
      title: "Vault Status",
      locked: "Locked balance",
      overdue: "Check-in overdue",
      executed: "Executed",
      protected: "Protected",
      daysSince: "Days since check-in",
      daysRemaining: "Days remaining",
      beneficiaries: "Beneficiaries",
      lastActivity: "Last activity",
      execution: "to execution",
      section: "Beneficiaries",
    },
    tr: {
      noVault: "Bu cüzdan için vault bulunamadı.",
      setup: "Aşağıdan continuity plan oluştur.",
      title: "Vault Durumu",
      locked: "Kilitli bakiye",
      overdue: "Check-in gecikti",
      executed: "İcra edildi",
      protected: "Korunuyor",
      daysSince: "Check-in sonrası gün",
      daysRemaining: "Kalan gün",
      beneficiaries: "Mirasçı",
      lastActivity: "Son aktivite",
      execution: "icraya",
      section: "Mirasçılar",
    },
  }[language];

  if (isLoading) {
    return (
      <div className="panel rounded-[30px] p-7 animate-pulse">
        <div className="mb-5 h-5 w-1/3 rounded-full bg-white/10" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 rounded-[24px] bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!status || !status[0]) {
    return (
      <div className="panel rounded-[30px] p-8 text-center">
        <p className="text-base text-[var(--text-secondary)]">{copy.noVault}</p>
        <p className="eyebrow mt-3">{copy.setup}</p>
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
  const beneWallets = beneficiaries?.[0] ?? [];
  const benePercentages = beneficiaries?.[1] ?? [];
  const beneLabels = beneficiaries?.[2] ?? [];

  const urgencyTone =
    remaining <= 7 ? "text-[var(--danger)]" : remaining <= 30 ? "text-[var(--warning)]" : "text-[var(--gold-strong)]";

  return (
    <div className="panel rounded-[30px] p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="eyebrow">{copy.title}</p>
          <h3 className="card-title mt-3 text-3xl">{copy.title}</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {copy.locked}: <span className="font-mono text-[var(--text-primary)]">{balance} XTZ</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {warningIssued ? (
            <span className="rounded-full border border-yellow-500/30 bg-[rgba(229,169,74,0.12)] px-3 py-2 text-xs text-[var(--warning)]">
              {copy.overdue}
            </span>
          ) : null}
          <span
            className={`rounded-full border px-3 py-2 font-mono text-xs ${
              executed
                ? "border-[rgba(212,181,122,0.32)] bg-[rgba(212,181,122,0.12)] text-[var(--gold-strong)]"
                : "border-[rgba(93,156,244,0.28)] bg-[rgba(93,156,244,0.12)] text-[var(--blue-soft)]"
            }`}
          >
            {executed ? copy.executed : copy.protected}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="panel-soft rounded-[24px] p-5 text-center">
          <p className="font-display text-5xl font-bold text-[var(--blue-soft)]">{days}</p>
          <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {copy.daysSince}
          </p>
        </article>
        <article className="panel-soft rounded-[24px] p-5 text-center">
          <p className={`font-display text-5xl font-bold ${urgencyTone}`}>{remaining}</p>
          <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {copy.daysRemaining}
          </p>
        </article>
        <article className="panel-soft rounded-[24px] p-5 text-center">
          <p className="font-display text-5xl font-bold text-[var(--text-primary)]">{Number(beneficiaryCount)}</p>
          <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {copy.beneficiaries}
          </p>
        </article>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[11px] text-[var(--text-muted)]">
          <span>{copy.lastActivity}</span>
          <span>
            {progress.toFixed(1)}% {copy.execution}
          </span>
          <span>300 days</span>
        </div>
        <div className="h-3 w-full rounded-full bg-black/40">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[var(--blue-primary)] via-[var(--blue-soft)] to-[var(--gold-strong)] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {beneWallets.length > 0 ? (
        <div className="mt-7">
          <p className="eyebrow">{copy.section}</p>
          <div className="mt-4 space-y-3">
            {beneWallets.map((wallet, i) => {
              const walletString = String(wallet);
              return (
                <div
                  key={`${walletString}-${i}`}
                  className="panel-soft flex items-center justify-between rounded-[22px] px-4 py-4"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-[var(--text-primary)] capitalize">
                      {String(beneLabels[i] ?? "")}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)]">
                      {walletString.slice(0, 6)}...{walletString.slice(-4)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-[var(--gold-strong)]">
                      {Number(benePercentages[i]) / 100}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {!executed ? <div className="mt-7"><ActivityPing language={language} /></div> : null}
    </div>
  );
}

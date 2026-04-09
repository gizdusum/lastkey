"use client";

import { useState } from "react";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import { etherlinkTestnet } from "@/lib/wagmi-config";
import BeneficiaryPreview from "./BeneficiaryPreview";
import TransactionToast from "./TransactionToast";

type Language = "en" | "tr";
interface Beneficiary { address: string; percentage: number; label: string; }

const EXAMPLES = [
  "If I'm unreachable for 300 days, send 70% to my family at 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 and 30% to my foundation at 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "If I do not check in for 300 days, send everything to my son at 0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "Split equally between 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 and 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
];

export default function InheritanceForm({
  address,
  language = "en",
}: {
  address: string;
  language?: Language;
}) {
  const [step, setStep] = useState<"input" | "preview">("input");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [parsed, setParsed] = useState<Beneficiary[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parseErr, setParseErr] = useState("");

  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContract, data: txHash, isPending, error: txError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const copy = {
    en: {
      eyebrow: "Vault Builder",
      title: "Shape the instruction once.",
      subtitle:
        "Write the continuity rule in natural language. LastKey will structure the wallets, percentages, and threshold for your Etherlink vault.",
      sample: "Example",
      placeholder:
        "If I cannot check in for 300 days, send 70% to 0xABC... and 30% to 0xDEF...",
      email: "Alert email",
      amount: "Initial balance (XTZ)",
      parse: "Structure Plan",
      parsing: "Structuring your plan...",
      parseError: "Could not identify any addresses. Add at least one 0x... wallet.",
      networkError: "Network error. Please try again.",
      txTitleReady: "Plan anchored on Etherlink",
      txTitlePending: "Confirming on Etherlink...",
      txMessageReady: `${address.slice(0, 6)}...${address.slice(-4)} is now protected by LastKey.`,
      txMessagePending: "Your continuity plan is being recorded onchain.",
      failed: "Transaction failed",
      retry: "Try again",
    },
    tr: {
      eyebrow: "Vault Builder",
      title: "Talimatı bir kez yapılandır.",
      subtitle:
        "Continuity kuralını doğal dille yaz. LastKey, wallet adreslerini, yüzdeleri ve threshold değerini Etherlink vault'un için yapılandırsın.",
      sample: "Örnek",
      placeholder:
        "300 gün check-in yapamazsam, %70'i 0xABC... adresine ve %30'u 0xDEF... adresine gönder.",
      email: "Uyarı emaili",
      amount: "Başlangıç bakiyesi (XTZ)",
      parse: "Planı yapılandır",
      parsing: "Plan yapılandırılıyor...",
      parseError: "Adres bulunamadı. En az bir 0x... wallet adresi ekle.",
      networkError: "Ağ hatası. Lütfen tekrar dene.",
      txTitleReady: "Plan Etherlink'e kaydedildi",
      txTitlePending: "Etherlink'te onaylanıyor...",
      txMessageReady: `${address.slice(0, 6)}...${address.slice(-4)} artık LastKey ile korunuyor.`,
      txMessagePending: "Continuity planın zincire yazılıyor.",
      failed: "İşlem başarısız",
      retry: "Tekrar dene",
    },
  }[language];

  const handleParse = async () => {
    if (!text.trim() || !email.trim()) return;
    setParsing(true);
    setParseErr("");
    try {
      const r = await fetch("/api/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
      const d = await r.json();
      if (d.success && d.beneficiaries?.length > 0) {
        setParsed(d.beneficiaries);
        setStep("preview");
      } else {
        setParseErr(d.error || copy.parseError);
      }
    } catch {
      setParseErr(copy.networkError);
    } finally {
      setParsing(false);
    }
  };

  const handleCreateVault = async () => {
    if (parsed.length === 0) return;
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
      functionName: "createVault",
      chainId: etherlinkTestnet.id,
      args: [
        email,
        parsed.map((b) => b.address as `0x${string}`),
        parsed.map((b) => BigInt(b.percentage)),
        parsed.map((b) => b.label),
        text,
        BigInt(300),
      ],
      value: parseEther(amount || "0"),
    });
  };

  return (
    <div className="space-y-4">
      {(isSuccess || txHash) && (
        <TransactionToast
          title={isSuccess ? copy.txTitleReady : copy.txTitlePending}
          message={isSuccess ? copy.txMessageReady : copy.txMessagePending}
          txHash={txHash}
          tone={isSuccess ? "success" : "info"}
        />
      )}

      {step === "input" ? (
        <div className="panel rounded-[30px] p-6">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3 className="card-title mt-4 text-3xl">{copy.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            {copy.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-panel)] px-3 py-2 text-xs text-[var(--text-secondary)] transition-all hover:border-[rgba(93,156,244,0.22)] hover:text-[var(--text-primary)]"
              >
                {copy.sample} {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="field-shell p-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder={copy.placeholder}
                className="w-full resize-none rounded-[16px] bg-transparent px-4 py-4 text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="field-shell flex items-center px-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.email}
                  className="w-full bg-transparent py-4 text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="field-shell flex items-center justify-between px-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-24 bg-transparent py-4 text-sm text-[var(--text-primary)]"
                />
                <span className="text-xs text-[var(--text-muted)]">{copy.amount}</span>
              </div>
            </div>
          </div>

          {parseErr ? (
            <div className="mt-4 rounded-[20px] border border-[rgba(235,103,103,0.24)] bg-[rgba(235,103,103,0.1)] p-4">
              <p className="text-sm text-[var(--danger)]">{parseErr}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleParse}
              disabled={parsing || !text.trim() || !email.trim()}
              className="btn-primary px-6 py-4 text-sm disabled:opacity-50"
            >
              {parsing ? copy.parsing : `✦ ${copy.parse}`}
            </button>
          </div>
        </div>
      ) : (
        <>
          <BeneficiaryPreview
            beneficiaries={parsed}
            depositAmount={amount}
            onEdit={() => {
              setStep("input");
              setParseErr("");
              reset();
            }}
            onConfirm={handleCreateVault}
            isLoading={isPending || confirming}
            language={language}
          />
          {txError ? (
            <div className="rounded-[22px] border border-[rgba(235,103,103,0.24)] bg-[rgba(235,103,103,0.1)] p-4">
              <p className="text-sm font-bold text-[var(--danger)]">{copy.failed}</p>
              <p className="mt-2 break-words text-sm text-[var(--text-secondary)]">
                {txError.message.slice(0, 200)}
              </p>
              <button
                onClick={reset}
                className="mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {copy.retry}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

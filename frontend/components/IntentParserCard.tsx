"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { LASTKEY_ABI, LASTKEY_ADDRESS } from "@/lib/contract";
import BeneficiaryPreview from "./BeneficiaryPreview";
import TransactionToast from "./TransactionToast";

interface Beneficiary {
  address: string;
  percentage: number;
  label: string;
}

type Step = "input" | "preview";

export default function InheritanceForm({ address }: { address: string }) {
  const [step, setStep] = useState<Step>("input");
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [email, setEmail] = useState("");
  const [depositAmount, setDepositAmount] = useState("0.01");
  const [parsed, setParsed] = useState<Beneficiary[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleParse = async () => {
    if (!naturalLanguage.trim() || !email.trim()) return;
    setParsing(true);
    setParseError("");

    try {
      const res = await fetch("/api/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: naturalLanguage }),
      });
      const data = await res.json();

      if (data.success && data.beneficiaries?.length > 0) {
        setParsed(data.beneficiaries);
        setStep("preview");
      } else {
        setParseError(
          data.error || "Could not parse your plan. Please include wallet addresses (0x...)"
        );
      }
    } catch {
      setParseError("Network error. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  const handleCreateVault = () => {
    if (parsed.length === 0) return;

    writeContract({
      address: LASTKEY_ADDRESS,
      abi: LASTKEY_ABI,
      functionName: "createVault",
      args: [
        email,
        parsed.map((b) => b.address as `0x${string}`),
        parsed.map((b) => BigInt(b.percentage)),
        parsed.map((b) => b.label),
        naturalLanguage,
        BigInt(300),
      ],
      value: parseEther(depositAmount || "0"),
    });
  };

  return (
    <div className="space-y-4">
      {isSuccess || txHash ? (
        <TransactionToast
          title={isSuccess ? "Continuity Plan Anchored" : "Confirming on Etherlink..."}
          message={
            isSuccess
              ? `Your continuity plan for ${address.slice(0, 6)}...${address.slice(-4)} is now anchored on Etherlink.`
              : "Your transaction is being recorded on the blockchain."
          }
          txHash={txHash}
          tone={isSuccess ? "success" : "info"}
        />
      ) : null}

      {step === "input" ? (
        <div className="animate-fade-in rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-1 text-lg font-black">Set Your Continuity Plan</h3>
          <p className="mb-5 text-sm text-slate-400">
            Keep it short. AI will turn your sentence into wallet allocations and a
            300-day continuity rule.
          </p>

          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="e.g. If I'm unreachable for 300 days, send 70% to my family at 0xABC... and 30% to my foundation at 0xDEF..."
            className="min-h-[120px] w-full resize-none rounded-2xl border border-white/15 bg-black/30 p-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-amber-500/50 focus:outline-none"
          />
          <p className="mt-2 text-xs text-slate-500">
            Template: “If I cannot check in for 300 days, send 60% to 0x... and 40%
            to 0x...”
          </p>

          <div className="mt-3">
            <label className="mb-1.5 block text-[10px] tracking-[0.3em] text-gray-500">
              ALERT EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/15 bg-black/30 p-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[10px] tracking-[0.3em] text-gray-500">
              INITIAL BALANCE (XTZ)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                step="0.01"
                min="0"
                className="min-w-[140px] flex-1 rounded-2xl border border-white/15 bg-black/30 p-3 text-sm text-white transition-colors focus:border-amber-500/50 focus:outline-none"
              />
              <div className="flex gap-1">
                {["0.01", "0.1", "1.0"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setDepositAmount(value)}
                    className={`rounded-full px-3 text-xs transition-all ${
                      depositAmount === value
                        ? "border border-amber-500/40 bg-amber-500/20 text-amber-300"
                        : "border border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {parseError ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-900/20 p-3">
              <p className="text-xs text-red-400">{parseError}</p>
            </div>
          ) : null}

          {writeError ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-900/20 p-4">
              <p className="text-sm font-bold text-red-400">Transaction failed</p>
              <p className="mt-1 break-words text-xs text-gray-500">
                {writeError.message?.slice(0, 200)}
              </p>
            </div>
          ) : null}

          <button
            onClick={handleParse}
            disabled={parsing || !naturalLanguage.trim() || !email.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-4 font-black text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {parsing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-black" />
                AI is structuring your plan...
              </>
            ) : (
              "✨ Structure with AI →"
            )}
          </button>
        </div>
      ) : (
        <BeneficiaryPreview
          beneficiaries={parsed}
          depositAmount={depositAmount}
          onEdit={() => {
            setStep("input");
            setParseError("");
            resetWrite();
          }}
          onConfirm={handleCreateVault}
          isLoading={isPending || isConfirming}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import BeneficiaryPreview from "./BeneficiaryPreview";
import TransactionToast from "./TransactionToast";

interface Beneficiary {
  address: string;
  percentage: number;
  label: string;
}

type Step = "input" | "preview";

const EXAMPLE_PROMPTS = [
  "If I'm unreachable for 300 days, send 70% to my family at 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 and 30% to my foundation at 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "If I do not check in for 300 days, send everything to my son at 0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "If my continuity window expires, split everything equally between 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 and 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
];

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
      address: DEADDROP_ADDRESS,
      abi: DEADDROP_ABI,
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
        <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-1 text-lg font-black">Set Your Continuity Plan</h3>
          <p className="mb-5 text-xs text-gray-500">
            Describe your continuity plan in plain English. AI will structure wallet addresses and percentages.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setNaturalLanguage(prompt)}
                className="max-w-[220px] truncate rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-gray-500 transition-all hover:border-white/30"
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="e.g. If I'm unreachable for 300 days, send 70% to my family at 0xABC... and 30% to my foundation at 0xDEF..."
            className="min-h-[100px] w-full resize-none rounded-xl border border-white/20 bg-black/40 p-4 text-sm text-white placeholder-gray-600 transition-colors focus:border-amber-500/50 focus:outline-none"
          />

          <div className="mt-3">
            <label className="mb-1.5 block text-[10px] tracking-[0.3em] text-gray-500">
              ALERT EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/20 bg-black/40 p-3 text-sm text-white placeholder-gray-600 transition-colors focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          <div className="mt-3">
            <label className="mb-1.5 block text-[10px] tracking-[0.3em] text-gray-500">
              INITIAL BALANCE (XTZ)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                step="0.01"
                min="0"
                className="flex-1 rounded-xl border border-white/20 bg-black/40 p-3 text-sm text-white transition-colors focus:border-amber-500/50 focus:outline-none"
              />
              <div className="flex gap-1">
                {["0.01", "0.1", "1.0"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setDepositAmount(value)}
                    className={`rounded-xl px-3 text-xs transition-all ${
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
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 font-black text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
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

"use client";

import { useState } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
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
  const publicClient = usePublicClient();
  const { chainId } = useAccount();
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  });
  const [step, setStep] = useState<Step>("input");
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [email, setEmail] = useState("");
  const [depositAmount, setDepositAmount] = useState("0.01");
  const [parsed, setParsed] = useState<Beneficiary[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [actionError, setActionError] = useState("");

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
    setActionError("");

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
    setActionError("");

    void (async () => {
      const depositValue = parseEther(depositAmount || "0");
      const lowBalanceThreshold = parseEther("0.001");

      if (chainId !== 127823) {
        setActionError("Switch your wallet to Etherlink Shadownet before anchoring.");
        return;
      }

      if (!balance || balance.value < depositValue + lowBalanceThreshold) {
        setActionError(
          "Your wallet needs a little more test XTZ before this transaction can be estimated and sent. Use the faucet, then try again."
        );
        return;
      }

      const args = [
        email,
        parsed.map((b) => b.address as `0x${string}`),
        parsed.map((b) => BigInt(b.percentage)),
        parsed.map((b) => b.label),
        naturalLanguage,
        BigInt(300),
      ] as const;

      try {
        if (publicClient) {
          const simulation = await publicClient.simulateContract({
            address: LASTKEY_ADDRESS,
            abi: LASTKEY_ABI,
            functionName: "createVault",
            args,
            account: address as `0x${string}`,
            value: depositValue,
          });
          writeContract(simulation.request);
          return;
        }

        writeContract({
          address: LASTKEY_ADDRESS,
          abi: LASTKEY_ABI,
          functionName: "createVault",
          args,
          value: depositValue,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Simulation failed before wallet confirmation.";

        if (message.toLowerCase().includes("already exists")) {
          setActionError("This wallet already has a continuity vault. Open the existing vault instead of creating a new one.");
          return;
        }

        if (
          message.toLowerCase().includes("insufficient") ||
          message.toLowerCase().includes("funds") ||
          message.toLowerCase().includes("gas")
        ) {
          setActionError(
            "The wallet could not estimate gas. In most cases this means the wallet needs more test XTZ for network fees."
          );
          return;
        }

        setActionError("The transaction could not be prepared. Please check your wallet network and try again.");
      }
    })();
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

      {!isSuccess && balance ? (
        <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-slate-400">
          Wallet balance:{" "}
          <span className="font-semibold text-slate-200">
            {Number(balance.formatted).toFixed(4)} {balance.symbol}
          </span>
        </div>
      ) : null}

      {step === "input" ? (
        <div className="animate-fade-in rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="mb-5 text-center">
            <h3 className="text-xl font-black text-white">Set Your Continuity Plan</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              Write one clean instruction. AI will structure it into beneficiary wallets
              and the 300-day continuity rule behind your vault.
            </p>
          </div>

          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="e.g. If I'm unreachable for 300 days, send 70% to my family at 0x... and 30% to my foundation at 0x..."
            className="min-h-[160px] w-full resize-none rounded-[28px] border border-white/15 bg-black/30 p-5 text-sm leading-7 text-white placeholder-slate-500 transition-colors focus:border-amber-500/50 focus:outline-none"
          />
          <p className="mt-3 text-center text-xs text-slate-500">
            Example format: “If I cannot check in for 300 days, send 60% to 0x... and
            40% to 0x...”
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
              className="w-full rounded-[20px] border border-white/15 bg-black/30 p-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-amber-500/50 focus:outline-none"
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
                className="min-w-[140px] flex-1 rounded-[20px] border border-white/15 bg-black/30 p-3 text-sm text-white transition-colors focus:border-amber-500/50 focus:outline-none"
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
            <div className="mt-3 rounded-[20px] border border-red-500/30 bg-red-900/20 p-3">
              <p className="text-xs text-red-400">{parseError}</p>
            </div>
          ) : null}

          {actionError ? (
            <div className="mt-3 rounded-[20px] border border-amber-500/30 bg-amber-900/20 p-4">
              <p className="text-sm font-bold text-amber-300">Before wallet confirmation</p>
              <p className="mt-1 text-xs leading-6 text-amber-100/80">{actionError}</p>
            </div>
          ) : null}

          {writeError ? (
            <div className="mt-3 rounded-[20px] border border-red-500/30 bg-red-900/20 p-4">
              <p className="text-sm font-bold text-red-400">Transaction failed</p>
              <p className="mt-1 break-words text-xs text-gray-500">
                {writeError.message?.slice(0, 200)}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleParse}
              disabled={parsing || !naturalLanguage.trim() || !email.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-4 font-black text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[280px] sm:px-8"
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
        </div>
      ) : (
        <BeneficiaryPreview
          beneficiaries={parsed}
          depositAmount={depositAmount}
          onEdit={() => {
            setStep("input");
            setParseError("");
            setActionError("");
            resetWrite();
          }}
          onConfirm={handleCreateVault}
          isLoading={isPending || isConfirming}
        />
      )}
    </div>
  );
}

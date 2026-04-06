"use client";

import { useState } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWalletClient,
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

const CREATE_VAULT_GAS_LIMIT = 500_000n;

export default function InheritanceForm({ address }: { address: string }) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
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
  const [preparing, setPreparing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [actionError, setActionError] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

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

  const handleCreateVault = async () => {
    if (parsed.length === 0) return;

    setActionError("");
    setPreparing(true);

    try {
      const depositValue = parseEther(depositAmount || "0");
      const lowBalanceThreshold = parseEther("0.001");

      if (chainId !== 127823) {
        throw new Error("Switch your wallet to Etherlink Shadownet before anchoring.");
      }

      if (!walletClient || !publicClient) {
        throw new Error("Your wallet client is not ready yet. Reconnect and try again.");
      }

      if (!balance || balance.value < depositValue + lowBalanceThreshold) {
        throw new Error(
          "Your wallet needs a little more test XTZ before this transaction can be estimated and sent."
        );
      }

      const args = [
        email,
        parsed.map((b) => b.address as `0x${string}`),
        parsed.map((b) => BigInt(b.percentage)),
        parsed.map((b) => b.label),
        naturalLanguage,
        BigInt(300),
      ] as const;

      const simulation = await publicClient.simulateContract({
        address: LASTKEY_ADDRESS,
        abi: LASTKEY_ABI,
        functionName: "createVault",
        args,
        account: walletClient.account.address,
        value: depositValue,
        gas: CREATE_VAULT_GAS_LIMIT,
      });

      const hash = await walletClient.writeContract({
        ...simulation.request,
        gas: simulation.request.gas ?? CREATE_VAULT_GAS_LIMIT,
      });

      setTxHash(hash);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The transaction could not be prepared.";

      if (message.toLowerCase().includes("already exists")) {
        setActionError(
          "This wallet already has a continuity vault. Use the existing plan instead of creating a new one."
        );
      } else if (
        message.toLowerCase().includes("insufficient") ||
        message.toLowerCase().includes("gas")
      ) {
        setActionError(
          "The wallet could not estimate or cover gas. Top up with test XTZ from the faucet and try again."
        );
      } else {
        setActionError(message);
      }
    } finally {
      setPreparing(false);
    }
  };

  const resetFlow = () => {
    setStep("input");
    setParseError("");
    setActionError("");
    setTxHash(undefined);
  };

  return (
    <div className="space-y-4">
      {isSuccess || txHash ? (
        <TransactionToast
          title={isSuccess ? "Plan anchored on Etherlink" : "Awaiting confirmation"}
          message={
            isSuccess
              ? `Your continuity plan for ${address.slice(0, 6)}...${address.slice(-4)} is now live onchain.`
              : "Your wallet accepted the request. Etherlink is confirming the transaction."
          }
          txHash={txHash}
          tone={isSuccess ? "success" : "info"}
        />
      ) : null}

      {!isSuccess && balance ? (
        <div className="glass-panel rounded-[26px] px-4 py-3 text-center text-sm text-slate-300">
          Wallet balance:
          <span className="ml-2 font-semibold text-white">
            {Number(balance.formatted).toFixed(4)} {balance.symbol}
          </span>
        </div>
      ) : null}

      {step === "input" ? (
        <div className="glass-panel animate-fade-in rounded-[34px] p-6 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-200/80">
              CONTINUITY SETUP
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
              Define the final outcome.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-300">
              Keep it short and explicit. LastKey will transform your sentence into a
              beneficiary plan and an Etherlink-ready vault transaction.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <textarea
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              placeholder="If I become unreachable for 300 days, send 70% to my family at 0x... and 30% to my foundation at 0x..."
              className="soft-ring min-h-[170px] w-full resize-none rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5 text-sm leading-7 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
            />

            <div className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
              <div>
                <label className="mb-2 block text-[11px] font-semibold tracking-[0.28em] text-slate-500">
                  ALERT EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="soft-ring w-full rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold tracking-[0.28em] text-slate-500">
                  INITIAL BALANCE
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    className="soft-ring min-w-0 flex-1 rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    {["0.01", "0.1", "1.0"].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDepositAmount(value)}
                        className={`rounded-full px-3 py-2 text-xs transition-colors ${
                          depositAmount === value
                            ? "bg-[var(--gold)] text-slate-950"
                            : "border border-white/10 text-slate-300 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {parseError ? (
            <div className="mt-4 rounded-[20px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {parseError}
            </div>
          ) : null}

          {actionError ? (
            <div className="mt-4 rounded-[20px] border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              {actionError}
            </div>
          ) : null}

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleParse}
              disabled={parsing || !naturalLanguage.trim() || !email.trim()}
              className="inline-flex min-w-[260px] items-center justify-center rounded-full bg-[var(--gold)] px-8 py-4 text-base font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {parsing ? "Structuring..." : "Structure Plan"}
            </button>
          </div>
        </div>
      ) : (
        <BeneficiaryPreview
          beneficiaries={parsed}
          depositAmount={depositAmount}
          onEdit={resetFlow}
          onConfirm={handleCreateVault}
          isLoading={preparing || isConfirming}
        />
      )}
    </div>
  );
}

"use client";

import ExplorerLink from "./ExplorerLink";

interface TransactionToastProps {
  title: string;
  message: string;
  txHash?: string;
  tone?: "success" | "error" | "info";
}

export default function TransactionToast({
  title,
  message,
  txHash,
  tone = "info",
}: TransactionToastProps) {
  const styles = {
    success: "border-green-500/30 bg-green-900/20 text-green-300",
    error: "border-red-500/30 bg-red-900/20 text-red-300",
    info: "border-amber-500/30 bg-amber-900/20 text-amber-200",
  }[tone];

  return (
    <div className={`animate-fade-in rounded-[24px] border p-4 ${styles}`}>
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-2 text-sm leading-7 text-gray-300">{message}</p>
      {txHash ? (
        <div className="mt-2 break-all">
          <ExplorerLink type="tx" hash={txHash} label={txHash} className="text-cyan-300" />
        </div>
      ) : null}
    </div>
  );
}

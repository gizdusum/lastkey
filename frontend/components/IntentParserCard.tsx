"use client";
import { useState } from "react";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { DEADDROP_ABI, DEADDROP_ADDRESS } from "@/lib/contract";
import { etherlinkTestnet } from "@/lib/wagmi-config";
import BeneficiaryPreview from "./BeneficiaryPreview";
import TransactionToast from "./TransactionToast";

interface Beneficiary { address: string; percentage: number; label: string; }

const EXAMPLES = [
  "If I'm unreachable for 300 days, send 70% to my family at 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 and 30% to my foundation at 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "If I do not check in for 300 days, send everything to my son at 0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "Split equally between 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 and 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
];

export default function InheritanceForm({ address }: { address: string }) {
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

  const handleParse = async () => {
    if (!text.trim() || !email.trim()) return;
    setParsing(true); setParseErr("");
    try {
      const r = await fetch("/api/parse-intent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: text }) });
      const d = await r.json();
      if (d.success && d.beneficiaries?.length > 0) { setParsed(d.beneficiaries); setStep("preview"); }
      else setParseErr(d.error || "Adres bulunamadı. Lütfen 0x... formatında adres ekleyin.");
    } catch { setParseErr("Ağ hatası. Tekrar deneyin."); }
    finally { setParsing(false); }
  };

  const handleCreateVault = async () => {
    if (parsed.length === 0) return;
    if (chain?.id !== etherlinkTestnet.id) {
      try { await switchChainAsync({ chainId: etherlinkTestnet.id }); }
      catch { return; }
    }
    console.log("[LastKey] createVault called", { address: DEADDROP_ADDRESS, parsed, amount });
    writeContract({
      address: DEADDROP_ADDRESS,
      abi: DEADDROP_ABI,
      functionName: "createVault",
      chainId: etherlinkTestnet.id,
      args: [email, parsed.map(b => b.address as `0x${string}`), parsed.map(b => BigInt(b.percentage)), parsed.map(b => b.label), text, BigInt(300)],
      value: parseEther(amount || "0"),
    });
  };

  return (
    <div className="space-y-4">
      {(isSuccess || txHash) && (
        <TransactionToast
          title={isSuccess ? "Plan Etherlink'e Kaydedildi" : "Etherlink'te Onaylanıyor..."}
          message={isSuccess ? `${address.slice(0,6)}...${address.slice(-4)} için planınız kaydedildi.` : "İşlem blok zincirine işleniyor."}
          txHash={txHash} tone={isSuccess ? "success" : "info"} />
      )}

      {step === "input" ? (
        <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-1 text-lg font-black">Devam Planını Yaz</h3>
          <p className="mb-5 text-xs text-gray-500">AI, wallet adreslerini ve yüzdeleri otomatik yapılandırır.</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setText(ex)}
                className="max-w-[220px] truncate rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-gray-500 hover:border-white/30">
                Örnek {i + 1}
              </button>
            ))}
          </div>

          <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
            placeholder="Örn: 300 gün hareketsiz kalırsam, %70'i 0xABC... adresine ve %30'unu 0xDEF... adresine gönder"
            className="w-full resize-none rounded-xl border border-white/20 bg-black/40 p-4 text-sm placeholder-gray-600 focus:border-amber-500/50 focus:outline-none" />

          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="uyari@email.com"
            className="mt-3 w-full rounded-xl border border-white/20 bg-black/40 p-3 text-sm placeholder-gray-600 focus:border-amber-500/50 focus:outline-none" />

          <div className="mt-3 flex gap-2">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" min="0"
              className="flex-1 rounded-xl border border-white/20 bg-black/40 p-3 text-sm focus:border-amber-500/50 focus:outline-none" />
            {["0.01","0.1","1.0"].map(v => (
              <button key={v} onClick={() => setAmount(v)}
                className={`rounded-xl px-3 text-xs ${amount === v ? "border border-amber-500/40 bg-amber-500/20 text-amber-300" : "border border-white/10 bg-white/5 text-gray-400 hover:border-white/30"}`}>
                {v}
              </button>
            ))}
          </div>

          {parseErr && <div className="mt-3 rounded-xl border border-red-500/30 bg-red-900/20 p-3"><p className="text-xs text-red-400">{parseErr}</p></div>}

          <button onClick={handleParse} disabled={parsing || !text.trim() || !email.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 font-black text-black hover:bg-amber-400 disabled:opacity-50">
            {parsing ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-black" />AI Yapılandırıyor...</>) : "✨ AI ile Yapılandır →"}
          </button>
        </div>
      ) : (
        <>
          <BeneficiaryPreview beneficiaries={parsed} depositAmount={amount}
            onEdit={() => { setStep("input"); setParseErr(""); reset(); }}
            onConfirm={handleCreateVault} isLoading={isPending || confirming} />
          {txError && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-900/20 p-4">
              <p className="text-sm font-bold text-red-400">İşlem Başarısız</p>
              <p className="mt-1 text-xs text-gray-500 break-words">{txError.message.slice(0,200)}</p>
              <button onClick={reset} className="mt-2 text-xs text-gray-500 hover:text-white">Tekrar dene</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

interface Beneficiary {
  address: string;
  percentage: number;
  label: string;
}

interface BeneficiaryPreviewProps {
  beneficiaries: Beneficiary[];
  depositAmount: string;
  onEdit: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function BeneficiaryPreview({
  beneficiaries,
  depositAmount,
  onEdit,
  onConfirm,
  isLoading,
}: BeneficiaryPreviewProps) {
  const totalCheck = beneficiaries.reduce((sum, beneficiary) => sum + beneficiary.percentage, 0);
  const isValid = totalCheck === 10000;

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">AI Structured Your Plan</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Review before anchoring on Etherlink
          </p>
        </div>
        {isValid ? (
          <span className="rounded-full border border-green-500/20 bg-green-900/30 px-2 py-1 text-xs text-green-400">
            ✓ Valid
          </span>
        ) : (
          <span className="rounded-full border border-red-500/20 bg-red-900/30 px-2 py-1 text-xs text-red-400">
            ✗ Invalid sum
          </span>
        )}
      </div>

      <div className="mb-5 space-y-2">
        {beneficiaries.map((beneficiary, index) => (
          <div
            key={`${beneficiary.address}-${index}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <div>
              <p className="text-sm font-bold capitalize">{beneficiary.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-gray-500">
                {beneficiary.address.slice(0, 10)}...{beneficiary.address.slice(-8)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-amber-400">
                {beneficiary.percentage / 100}%
              </p>
              <p className="text-[10px] text-gray-500">
                ~
                {(
                  (parseFloat(depositAmount || "0") * beneficiary.percentage) /
                  10000
                ).toFixed(4)}{" "}
                XTZ
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5 space-y-2 rounded-xl border border-white/10 bg-black/40 p-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Initial balance</span>
          <span className="font-bold text-white">{depositAmount} XTZ</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Inactivity threshold</span>
          <span className="font-bold text-white">300 days</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Warning at</span>
          <span className="font-bold text-yellow-400">Day 293</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Auto-execute at</span>
          <span className="font-bold text-red-400">Day 300</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Network</span>
          <span className="font-bold text-cyan-400">Etherlink Shadownet</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-sm font-medium transition-all hover:bg-white/15"
        >
          ← Edit Plan
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading || !isValid}
          className="flex-[2] rounded-xl bg-amber-500 py-3 text-sm font-bold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Anchoring on Etherlink...
            </span>
          ) : (
            "🔑 Anchor on Etherlink"
          )}
        </button>
      </div>
    </div>
  );
}

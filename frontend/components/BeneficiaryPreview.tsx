"use client";

type Language = "en" | "tr";

interface Beneficiary {
  address: string;
  percentage: number;
  label: string;
}

interface BeneficiaryPreviewProps {
  beneficiaries: Beneficiary[];
  depositAmount: string;
  onEdit: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading: boolean;
  language?: Language;
}

export default function BeneficiaryPreview({
  beneficiaries,
  depositAmount,
  onEdit,
  onConfirm,
  isLoading,
  language = "en",
}: BeneficiaryPreviewProps) {
  const totalCheck = beneficiaries.reduce((sum, beneficiary) => sum + beneficiary.percentage, 0);
  const isValid = totalCheck === 10000;

  const copy = {
    en: {
      title: "AI structured your plan",
      subtitle: "Review the vault route before sending an onchain transaction.",
      valid: "Valid structure",
      invalid: "Invalid structure",
      initial: "Initial balance",
      threshold: "Protection window",
      warning: "Warning point",
      execute: "Execution point",
      network: "Network",
      edit: "Edit plan",
      anchor: "Anchor on Etherlink",
      anchoring: "Anchoring on Etherlink...",
    },
    tr: {
      title: "AI planını yapılandırdı",
      subtitle: "Onchain işlemi göndermeden önce vault rotasını gözden geçir.",
      valid: "Geçerli yapı",
      invalid: "Geçersiz yapı",
      initial: "Başlangıç bakiyesi",
      threshold: "Koruma penceresi",
      warning: "Uyarı noktası",
      execute: "İcra noktası",
      network: "Ağ",
      edit: "Planı düzenle",
      anchor: "Etherlink'e kaydet",
      anchoring: "Etherlink'e kaydediliyor...",
    },
  }[language];

  return (
    <div className="panel rounded-[30px] p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">AI Preview</p>
          <h3 className="card-title mt-3 text-3xl">{copy.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
            {copy.subtitle}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-2 text-xs font-medium ${
            isValid
              ? "border border-[rgba(75,193,132,0.24)] bg-[rgba(75,193,132,0.1)] text-[var(--success)]"
              : "border border-[rgba(235,103,103,0.24)] bg-[rgba(235,103,103,0.1)] text-[var(--danger)]"
          }`}
        >
          {isValid ? copy.valid : copy.invalid}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_320px]">
        <div className="space-y-3">
          {beneficiaries.map((beneficiary, index) => (
            <div
              key={`${beneficiary.address}-${index}`}
              className="panel-soft flex items-center justify-between rounded-[22px] px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium capitalize text-[var(--text-primary)]">
                  {beneficiary.label}
                </p>
                <p className="font-mono mt-1 text-[11px] text-[var(--text-muted)]">
                  {beneficiary.address.slice(0, 10)}...{beneficiary.address.slice(-8)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-[var(--gold-strong)]">
                  {beneficiary.percentage / 100}%
                </p>
                <p className="mt-1 text-[11px] text-[var(--text-muted)]">
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

        <div className="panel-soft rounded-[24px] p-5">
          <p className="eyebrow">Protocol</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[var(--text-secondary)]">{copy.initial}</span>
              <span className="font-mono text-[var(--text-primary)]">{depositAmount} XTZ</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--text-secondary)]">{copy.threshold}</span>
              <span className="text-[var(--text-primary)]">300 days</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--text-secondary)]">{copy.warning}</span>
              <span className="text-[var(--warning)]">Day 293</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--text-secondary)]">{copy.execute}</span>
              <span className="text-[var(--danger)]">Day 300</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--text-secondary)]">{copy.network}</span>
              <span className="font-mono text-[var(--blue-soft)]">Etherlink Shadownet</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button onClick={onEdit} disabled={isLoading} className="btn-secondary flex-1 px-5 py-4 text-sm">
          {copy.edit}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading || !isValid}
          className="btn-gold flex-[1.4] px-5 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/35 border-t-black" />
              {copy.anchoring}
            </span>
          ) : (
            copy.anchor
          )}
        </button>
      </div>
    </div>
  );
}

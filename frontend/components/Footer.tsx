import Image from "next/image";

type Language = "en" | "tr";
type Theme = "dark" | "light";

export default function Footer({
  language = "en",
  theme = "dark",
}: {
  language?: Language;
  theme?: Theme;
}) {
  const copy = {
    en: {
      builtPrefix: "Built by ",
      builtName: "Gizdusum",
      builtSuffix: " for Tezos EVM Hackathon 2026",
      contract: "Contract ↗",
      faucet: "Get Faucet XTZ ↗",
      github: "GitHub ↗",
      x: "X ↗",
      powered: "Secured by Etherlink",
    },
    tr: {
      builtPrefix: "",
      builtName: "Gizdusum",
      builtSuffix: " tarafından Tezos EVM Hackathon 2026 için geliştirildi",
      contract: "Kontrat ↗",
      faucet: "Faucet XTZ Al ↗",
      github: "GitHub ↗",
      x: "X ↗",
      powered: "Etherlink ile güvence altında",
    },
  }[language];

  const footerSurface =
    theme === "light" ? "bg-[rgba(255,255,255,0.84)]" : "bg-[rgba(4,6,15,0.82)]";

  return (
    <footer className={`border-t border-[var(--border-subtle)] px-6 py-6 backdrop-blur-xl ${footerSurface}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-[var(--text-muted)] lg:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Image src="/icon.svg" alt="LastKey mark" width={32} height={32} className="h-8 w-8 rounded-xl" />
            <div className="leading-tight">
              <div className="font-display text-sm font-bold text-[var(--text-primary)]">LastKey</div>
              <div className="text-[11px] text-[var(--text-secondary)]">Built for what comes last.</div>
            </div>
          </div>
          <span>
            {copy.builtPrefix}
            <a
              href="https://x.com/gizdusumandnode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {copy.builtName}
            </a>
            {copy.builtSuffix}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://shadownet.explorer.etherlink.com/address/0x6DF4368aAd2B3829Fe08A0763F502CB91A9B361b"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {copy.contract}
          </a>
          <a
            href="https://faucet.etherlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {copy.faucet}
          </a>
          <a
            href="https://x.com/gizdusumandnode"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {copy.x}
          </a>
          <a
            href="https://github.com/gizdusum"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {copy.github}
          </a>
        </div>

        <div className="text-center lg:text-right">{copy.powered}</div>
      </div>
    </footer>
  );
}

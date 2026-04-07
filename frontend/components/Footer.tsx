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
      built: "Built by Gizdusum for Tezos EVM AI Hackathon 2026",
      contract: "Contract ↗",
      faucet: "Get Faucet XTZ ↗",
      github: "GitHub ↗",
      x: "X ↗",
      powered: "Secured by Etherlink · Guided by GPT-4o",
    },
    tr: {
      built: "Gizdusum tarafından Tezos EVM AI Hackathon 2026 için geliştirildi",
      contract: "Kontrat ↗",
      faucet: "Faucet XTZ Al ↗",
      github: "GitHub ↗",
      x: "X ↗",
      powered: "Etherlink ile güvence altında · GPT-4o ile desteklenir",
    },
  }[language];

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[rgba(4,6,15,0.82)] px-6 py-6 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-[var(--text-muted)] lg:flex-row">
        <div className="flex items-center gap-3">
          <Image
            src={theme === "light" ? "/lastkey-logo.png" : "/lastkey-logo-white.png"}
            alt="LastKey"
            width={132}
            height={40}
            className="h-8 w-auto rounded-xl object-cover object-center"
          />
          <span>{copy.built}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://shadownet.explorer.etherlink.com/address/0x29C3B37CD735104812a8A72B9b6FeA9578e044a5"
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

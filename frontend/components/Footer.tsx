export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[#04060f] px-8 py-6 text-xs text-[var(--text-muted)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="flex items-center gap-3">
          <img
            src="/lastkey-logo-white.png"
            alt="LastKey"
            className="h-7 w-[104px] object-cover object-center [object-position:center_68%]"
          />
          <span>Built for Tezos EVM AI Hackathon 2026</span>
        </div>

        <div className="flex items-center gap-5 text-center">
          <a
            href="https://shadownet.explorer.etherlink.com/address/0x29C3B37CD735104812a8A72B9b6FeA9578e044a5"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Contract ↗
          </a>
          <a
            href="https://faucet.etherlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Get Test XTZ ↗
          </a>
          <a
            href="https://github.com/gizdusum/lastkey"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            GitHub ↗
          </a>
        </div>

        <div className="text-center lg:text-right">
          Secured by Etherlink · Powered by GPT-4o
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <span className="text-amber-500">🔑</span>
          <span>LastKey</span>
          <span className="text-slate-700">·</span>
          <span>Built for Tezos EVM AI Hackathon 2026</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-amber-400"
          >
            Contract
          </a>
          <a
            href="https://faucet.etherlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-amber-400"
          >
            Get Test XTZ
          </a>
          <a
            href="https://github.com/gizdusum/lastkey"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-amber-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

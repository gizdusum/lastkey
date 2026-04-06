export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 text-xs text-gray-600 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="text-amber-500">🔑</span>
          <span>LastKey</span>
          <span className="text-gray-700">·</span>
          <span>Built for Tezos EVM AI Hackathon 2026</span>
        </div>
        <div className="flex items-center gap-4">
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

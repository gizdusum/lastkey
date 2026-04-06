interface ExplorerLinkProps {
  type: "tx" | "address";
  hash: string;
  label?: string;
  className?: string;
}

export default function ExplorerLink({
  type,
  hash,
  label,
  className = "",
}: ExplorerLinkProps) {
  const base = "https://shadownet.explorer.etherlink.com";
  const url = `${base}/${type}/${hash}`;
  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono text-xs text-cyan-400 underline-offset-2 transition-colors hover:text-cyan-300 hover:underline ${className}`}
    >
      {label || shortHash}
    </a>
  );
}

import { createConfig, http } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

export const etherlinkTestnet = defineChain({
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: {
    decimals: 18,
    name: "Tez",
    symbol: "XTZ",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL ||
          "https://node.shadownet.etherlink.com",
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL ||
          "https://node.shadownet.etherlink.com",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Shadownet Explorer",
      url: "https://shadownet.explorer.etherlink.com",
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [etherlinkTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [etherlinkTestnet.id]: http(
      process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL ||
        "https://node.shadownet.etherlink.com"
    ),
  },
  ssr: false,
});

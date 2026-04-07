"use client";
import { useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi-config";

const qc = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={qc}>
        {ok ? children : <div className="min-h-screen bg-[#06070f]" />}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

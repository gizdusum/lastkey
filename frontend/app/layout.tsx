import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LastKey",
  description:
    "Built for what comes last.",
  keywords: ["web3", "crypto", "access continuity", "etherlink", "tezos", "inheritance", "lastkey"],
  openGraph: {
    title: "LastKey",
    description: "Built for what comes last.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="theme-surface font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

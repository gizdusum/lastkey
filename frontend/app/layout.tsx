import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LastKey — Access Continuity on Etherlink",
  description:
    "AI-powered crypto access continuity. Your keys, even when you can't hold them.",
  keywords: ["web3", "crypto", "access continuity", "etherlink", "tezos", "inheritance", "lastkey"],
  openGraph: {
    title: "LastKey",
    description: "AI-powered access continuity protocol on Etherlink",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#04060f] text-[#eef2ff] antialiased font-['Inter',sans-serif]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

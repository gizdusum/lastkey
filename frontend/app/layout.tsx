import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

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
      <body className={`${manrope.variable} bg-[#06070f] text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

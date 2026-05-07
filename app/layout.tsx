import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/providers/WalletProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "capsule | Session-Based Risk Management",
  description: "Secure your Solana interactions with session-based wallet isolation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#0A0A0F]`}>
        <SolanaWalletProvider>
          <SessionProvider>
            <Navbar />
            {children}
            <Toaster position="bottom-right" />
          </SessionProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}

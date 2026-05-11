import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaWalletProvider } from "@/components/providers/WalletProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Copy-Ghost | Zero-Latency Shadow Trading",
  description: "Follow the smart money with the speed of a bot and the security of a vault. Powered by Jupiter.",
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

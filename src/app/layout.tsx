import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Md Imran | Full Stack Blockchain Developer",
  description: "Blockchain Engineer at Petition.io specializing in Solidity, Foundry, DeFi protocols, and smart contract development. Building secure and scalable blockchain solutions.",
  keywords: ["blockchain developer", "solidity", "foundry", "smart contracts", "defi", "ethereum", "web3", "dapp developer", "chainlink", "uniswap"],
  authors: [{ name: "Md Imran" }],
  creator: "Md Imran",
  metadataBase: new URL("https://mdimran.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mdimran.dev",
    title: "Md Imran | Full Stack Blockchain Developer",
    description: "Blockchain Engineer at Petition.io specializing in Solidity, Foundry, DeFi protocols, and smart contract development.",
    siteName: "Md Imran Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Imran | Full Stack Blockchain Developer",
    description: "Blockchain Engineer specializing in Solidity, Foundry, and DeFi protocols",
    creator: "@mdimran29",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-black text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

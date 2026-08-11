import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Placeholder pairing (Cabinet Grotesk + General Sans aren't on Google Fonts
// and self-hosting them wasn't set up yet) — same distinctive grotesk display
// + neutral sans structure, swappable later without touching component code.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BOB Retail",
  description: "BOB Retail — streetwear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${spaceGrotesk.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Anton,
  Permanent_Marker,
  Bebas_Neue,
  Archivo_Black,
  Monoton,
  Righteous,
  Bungee,
} from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { Toast } from "@/components/layout/Toast";
import { CartSidebar } from "@/components/cart/CartSidebar";
import "./globals.css";

// Fixel — self-hosted (not on Google Fonts). Chosen specifically for full
// Ukrainian Cyrillic support, which the originally-discussed Cabinet Grotesk
// + General Sans pairing lacked entirely. Free/SIL Open Font License per
// https://fixel.macpaw.com/. Two purpose-built optical styles rather than
// the single variable file: Display for headlines, Text for body/UI —
// matches how the type designer intended it to be used.
const fixelDisplay = localFont({
  src: [
    {
      path: "./fonts/fixel/FixelDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/fixel/FixelDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fixel-display",
  display: "swap",
});

const fixelText = localFont({
  src: [
    {
      path: "./fonts/fixel/FixelText-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/fixel/FixelText-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-fixel-text",
  display: "swap",
});

// Logo font-cycle set (components/home/IntroSplash.tsx) — the homepage
// intro splash flickers through these before landing on Fixel Display, the
// site's actual display font. Loaded here (not in the client component
// itself) since next/font only works at the module/build level. The header
// itself now uses a looping video logo (VideoLogo.tsx) instead of this cycle.
const anton = Anton({
  weight: "400",
  variable: "--font-logo-anton",
  subsets: ["latin"],
});
const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-logo-marker",
  subsets: ["latin"],
});
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-logo-bebas",
  subsets: ["latin"],
});
const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-logo-archivo",
  subsets: ["latin"],
});
const monoton = Monoton({
  weight: "400",
  variable: "--font-logo-monoton",
  subsets: ["latin"],
});
const righteous = Righteous({
  weight: "400",
  variable: "--font-logo-righteous",
  subsets: ["latin"],
});
const bungee = Bungee({
  weight: "400",
  variable: "--font-logo-bungee",
  subsets: ["latin"],
});

const logoFontVariables = [
  anton.variable,
  permanentMarker.variable,
  bebasNeue.variable,
  archivoBlack.variable,
  monoton.variable,
  righteous.variable,
  bungee.variable,
].join(" ");

export const metadata: Metadata = {
  title: "BOB Retail",
  description: "BOB Retail — стрітвір-бренд.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${fixelDisplay.variable} ${fixelText.variable} ${logoFontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          {children}
          <Toast />
          <CartSidebar />
        </MotionProvider>
      </body>
    </html>
  );
}

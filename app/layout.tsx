import type { Metadata, Viewport } from "next";
import { Inter, Noto_Nastaliq_Urdu, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const urdu = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-urdu", display: "swap" });
const hindi = Noto_Sans_Devanagari({ subsets: ["devanagari", "latin"], variable: "--font-hindi", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://deenihisab.com"),
  title: {
    default: "Deeni Hisab | اسلامی کیلکولیٹر",
    template: "%s | Deeni Hisab"
  },
  description: "Hanafi fiqh guided Mirath and Zakat calculator interface. Educational tool, not a fatwa.",
  applicationName: "DEENI HISAB",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Deeni Hisab | دینی حساب",
    description: "Hanafi fiqh guided Mirath and Zakat calculator interface. Educational tool, not a fatwa.",
    siteName: "DEENI HISAB",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f5132"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ur" className={`${inter.variable} ${urdu.variable} ${hindi.variable}`}>
      <body>{children}</body>
    </html>
  );
}

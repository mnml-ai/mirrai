import type { Metadata } from "next";
import {
  Space_Grotesk,
  Barlow_Condensed,
  Inter,
  Inter_Tight,
  Cormorant_Garamond,
  Noto_Sans_Arabic,
} from "next/font/google";
import LocaleDocumentAttributes from "@/components/i18n/LocaleDocumentAttributes";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const interTight = Inter_Tight({
  variable: "--font-moon",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-quote",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mirrai — More Than a Mirror",
  description: "Entertainment, Hidden in Reflection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${barlowCondensed.variable} ${inter.variable} ${interTight.variable} ${cormorant.variable} ${notoSansArabic.variable}`}
    >
      <body>
        <LocaleDocumentAttributes />
        {children}
      </body>
    </html>
  );
}

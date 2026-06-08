import type { Metadata } from "next";
import {
  Space_Grotesk,
  Barlow_Condensed,
  Inter,
  Inter_Tight,
  Cormorant_Garamond,
  Noto_Kufi_Arabic,
} from "next/font/google";
import LocaleDocumentAttributes from "@/components/i18n/LocaleDocumentAttributes";
import { getSiteUrl } from "@/lib/site-url";
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

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "MIRRAI",
  title: {
    default: "Mirrai — More Than a Mirror",
    template: "%s",
  },
  description: "Entertainment, Hidden in Reflection.",
  openGraph: {
    siteName: "MIRRAI",
    type: "website",
  },
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
      className={`${spaceGrotesk.variable} ${barlowCondensed.variable} ${inter.variable} ${interTight.variable} ${cormorant.variable} ${notoKufiArabic.variable}`}
    >
      <body>
        <LocaleDocumentAttributes />
        {children}
      </body>
    </html>
  );
}

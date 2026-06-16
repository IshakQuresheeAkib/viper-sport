import type { Metadata } from "next";
import { Anybody, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  weight: ["700", "800"]
});

export const metadata: Metadata = {
  title: {
    default: "ViperSport",
    template: "%s | ViperSport"
  },
  description:
    "Fuad Abdul-Aziz portfolio and Argentina vs Austria live match show registration.",
  metadataBase: new URL("https://vipersport.com"),
  openGraph: {
    title: "ViperSport",
    description:
      "Register for the Argentina vs Austria live match show and fan engagement event in Sylhet.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <SpeedInsights />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anybody.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

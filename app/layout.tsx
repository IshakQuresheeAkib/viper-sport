import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

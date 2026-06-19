import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Baloo_Tamma_2

} from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/Toaster";


const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
  
const balooTamma2 = Baloo_Tamma_2({
  variable: "--font-baloo-tamma-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ViperSport",
    template: "%s | ViperSport",
  },
  description:
    "Fuad Abdul-Aziz portfolio and Argentina vs Austria live match show registration.",
  metadataBase: new URL("https://vipersport.com"),
  openGraph: {
    title: "ViperSport",
    description:
      "Register for the Argentina vs Austria live match show and fan engagement event in Sylhet.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <SpeedInsights />
      <body
        className={` ${plusJakarta.variable} ${balooTamma2.variable}`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

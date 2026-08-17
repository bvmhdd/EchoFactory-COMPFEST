import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoFactory — Acoustic AI & Blockchain Health Passport",
  description:
    "Industrial predictive maintenance platform powered by deep metric acoustic AI (STgram-MFN v3 ONNX) and tamper-proof machine health ledgers on Polygon Amoy blockchain.",
  keywords: [
    "Predictive Maintenance",
    "Acoustic AI",
    "Smart Manufacturing",
    "STgram-MFN",
    "MIMII Dataset",
    "Polygon Amoy",
    "COMPFEST 18",
    "Industrial IoT",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}

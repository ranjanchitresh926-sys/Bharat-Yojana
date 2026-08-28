import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SWRegister from "../components/SWRegister";
import LanguageSelector from "../components/LanguageSelector";
import { TranslationProvider } from "../components/TranslationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharat Yojana — Government Scheme Eligibility",
  description: "Find Indian government welfare schemes you're eligible for, in your own language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SWRegister />
        <TranslationProvider>
          {/* Mounted globally (not per-page) so the "अ / A" language button in
              GovHeader — which appears on every page — actually opens this
              modal everywhere, not only on the homepage. See
              MASTER_HANDOFF.md §9.3 for why this used to be broken. */}
          <LanguageSelector />
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}

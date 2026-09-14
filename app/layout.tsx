import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import SWRegister from "../components/SWRegister";
import LanguageSelector from "../components/LanguageSelector";
import { TranslationProvider } from "../components/TranslationProvider";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "devanagari", "bengali", "tamil", "telugu"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SWRegister />
        <TranslationProvider>
          {/* Mounted globally (not per-page) so the "अ / A" language button in
              GovHeader — which appears on every page — actually opens this
              modal everywhere, not only on the homepage. See
              MASTER_HANDOFF.md §9.3 for why this used to be broken. */}
          <LanguageSelector />
          {children}
        </TranslationProvider>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=f7418cfb-9b35-441c-9c67-a717d9ca034a"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { getServerI18n } from "@/lib/i18n/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "XYVORAN OS",
  description: "Your Human Optimization Operating System."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { language, copy } = await getServerI18n();
  return (
    <html lang={language}>
      <body className={`${inter.variable} ${space.variable}`}>
        <LanguageProvider initialLanguage={language}>
          <div className="min-h-screen">{children}</div>
          <footer className="border-t border-signal/10 bg-obsidian px-4 py-5 text-center text-xs text-chrome">{copy.legal.full}</footer>
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { getServerI18n } from "@/lib/i18n/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XYVORAN OS",
  description: "Your Human Optimization Operating System."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { language, copy } = await getServerI18n();
  return (
    <html lang={language}>
      <body className={inter.className}>
        <LanguageProvider initialLanguage={language}>
          <div className="min-h-screen">{children}</div>
          <footer className="border-t border-white/10 bg-black/30 px-4 py-5 text-center text-xs text-chrome">{copy.legal.full}</footer>
        </LanguageProvider>
      </body>
    </html>
  );
}

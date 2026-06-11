import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XYVORAN OS",
  description: "Your Human Optimization Operating System."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
        <footer className="border-t border-white/10 bg-black/30 px-4 py-5 text-center text-xs text-chrome">
          XYVORAN OS provides educational wellness guidance only and is not medical advice.
        </footer>
      </body>
    </html>
  );
}

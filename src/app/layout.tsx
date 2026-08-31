import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YH",
  description: "패션 디자인 포트폴리오 & 개인 어시스턴트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="flex items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-xl tracking-tight">
            YH
          </Link>
          <Link
            href="/assistant"
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            개인 비서
          </Link>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="px-6 py-8 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} YH. All designs shown are original work.
        </footer>
      </body>
    </html>
  );
}

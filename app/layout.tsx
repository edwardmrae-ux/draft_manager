import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HeaderNav } from "@/components/HeaderNav";
import { PositionColorProvider } from "@/components/PositionColorProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFL Fantasy Draft Tracker",
  description: "Track your live NFL fantasy draft and roster",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-100 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
            <span className="text-sm font-semibold tracking-tight">
              NFL Fantasy Draft Tracker
            </span>
            <HeaderNav />
          </div>
        </header>
        <PositionColorProvider>{children}</PositionColorProvider>
      </body>
    </html>
  );
}

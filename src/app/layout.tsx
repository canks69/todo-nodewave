import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import {Toaster} from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nodewave Todo App",
  description: "A simple todo app built with Next.js and Nodewave",
  keywords: ["Next.js", "Nodewave", "Todo App", "React"],
  authors: [{ name: "Nodewave", url: "https://nodewave.id" }],
  creator: "Canks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen max-h-screen flex flex-col overflow-hidden`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster duration={5000} />
      </body>
    </html>
  );
}

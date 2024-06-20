import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "検索アプリ",
  description: "検索アプリのサンプルです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-200`}>
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-100`}>
        <Header />
        <main className="items-center justify-between px-10 py-10 min-h-[calc(100vh-74px)]">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}

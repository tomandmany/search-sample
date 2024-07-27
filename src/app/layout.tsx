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
      <body className={`${inter.className}`}>
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}

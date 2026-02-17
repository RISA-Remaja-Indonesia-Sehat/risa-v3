import type { Metadata } from "next";
import { Jaro, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jaro = Jaro({
  subsets: ["latin"],
  variable: "--font-jaro",
});

export const metadata: Metadata = {
  title: "RISA",
  description: "Version 3 of RISA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${jaro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Jaro, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
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
        className={`${jakarta.className} ${jaro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

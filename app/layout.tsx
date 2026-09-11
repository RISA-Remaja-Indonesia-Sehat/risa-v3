import type { Metadata } from "next";
import {
  Jaro,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const jaro = Jaro({
  subsets: ["latin"],
  variable: "--font-jaro",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://risa-v2.vercel.app"
  ),

  title: {
    default:
      "RISA | Edukasi Kesehatan Reproduksi Remaja",
    template: "%s | RISA",
  },

  description:
    "RISA (Remaja Indonesia Sehat) adalah platform edukasi kesehatan reproduksi untuk remaja Indonesia melalui microlearning, permainan interaktif, dan materi yang mudah dipahami.",

  openGraph: {
    title:
      "RISA | Platform Edukasi Kesehatan Reproduksi",
    description:
      "Belajar kesehatan reproduksi dengan cara yang lebih mudah dan menyenangkan melalui microlearning dan permainan interaktif.",
    url: "https://risa-v2.vercel.app",
    siteName: "RISA - Remaja Indonesia Sehat",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RISA - Remaja Indonesia Sehat",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "RISA | Platform Edukasi Kesehatan Reproduksi",
    description:
      "Platform edukasi kesehatan reproduksi remaja perempuan dengan microlearning dan permainan interaktif.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${jakarta.className} ${jaro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
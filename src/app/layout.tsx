import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "India Economic Dashboard | MoSPI Data",
  description:
    "Track India's key economic indicators - GDP, CPI, WPI, IIP - with real-time data from the Ministry of Statistics and Programme Implementation.",
  keywords: [
    "India",
    "GDP",
    "CPI",
    "WPI",
    "IIP",
    "economic indicators",
    "MoSPI",
    "Indian economy",
    "inflation",
    "industrial production",
  ],
  authors: [{ name: "India Economic Dashboard" }],
  openGraph: {
    title: "India Economic Dashboard",
    description:
      "Track India's key economic indicators - GDP, CPI, WPI, IIP - with real-time data from MoSPI.",
    type: "website",
    locale: "en_IN",
    siteName: "India Economic Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Economic Dashboard",
    description:
      "Track India's key economic indicators - GDP, CPI, WPI, IIP - with real-time data from MoSPI.",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

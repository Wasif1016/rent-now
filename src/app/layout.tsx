import "./globals.css";
import type { Metadata } from "next";
import { Oranienbaum, Schibsted_Grotesk } from "next/font/google";
import { MainHeader } from "@/components/layout/main-header";
import { AuthProvider } from "@/contexts/auth-context";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { FloatingWhatsApp } from "@/components/whatsapp-float";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { SiteSchema } from "@/components/seo/site-schema";

const oranienbaum = Oranienbaum({
  variable: "--font-oranienbaum",
  subsets: ["latin"],
  weight: ["400"],
});

const schibsted_grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted_grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rentnowpk.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RentNowPK | Rent a Car in Pakistan",
    template: "%s | RentNowPK",
  },
  description:
    "Rent a car in Pakistan with RentNowPK. Comparative prices, verified vendors, and reliable service for self-drive and with-driver rentals.",
  keywords: [
    "rent a car",
    "car rental pakistan",
    "rent now pk",
    "cheap car rental",
    "luxury car rental",
  ],
  authors: [{ name: "RentNowPK" }],
  creator: "RentNowPK",
  publisher: "RentNowPK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "RentNowPK | Rent a Car in Pakistan",
    description:
      "Rent a car in Pakistan with RentNowPK. Comparative prices, verified vendors, and reliable service.",
    url: siteUrl,
    siteName: "RentNowPK",
    locale: "en_US",
    type: "website",
    images: ["/hero-desktop.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentNowPK | Rent a Car in Pakistan",
    description:
      "Rent a car in Pakistan with RentNowPK. Comparative prices, verified vendors, and reliable service.",
    creator: "@rentnowpk",
    images: ["/hero-desktop.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${schibsted_grotesk.variable} ${oranienbaum.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <MainHeader />
          {children}
          <FooterWrapper />
          <FloatingWhatsApp />
        </AuthProvider>
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S8T1R71NDE"
          strategy="afterInteractive"
        />
        <SiteSchema />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-S8T1R71NDE');
          `}
        </Script>
      </body>
    </html>
  );
}

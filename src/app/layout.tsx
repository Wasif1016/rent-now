import "./globals.css";
import type { Metadata } from "next";
import { Oranienbaum, Schibsted_Grotesk } from "next/font/google";
import { MainHeader } from "@/components/layout/main-header";
import { AuthProvider } from "@/contexts/auth-context";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { Analytics } from "@vercel/analytics/next"

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


export const metadata: Metadata = {
  title: "Rent Now",
  description: "Rent Now is a platform for renting cars",
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
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

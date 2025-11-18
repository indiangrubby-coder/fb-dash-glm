import type { Metadata } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Facebook Ads Dashboard - Monitor & Control",
  description: "Production-grade Facebook Ads monitoring and control dashboard with real-time analytics and campaign management.",
  keywords: ["Facebook Ads", "Dashboard", "Marketing", "Analytics", "Campaign Management", "Next.js"],
  authors: [{ name: "Facebook Ads Dashboard Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Facebook Ads Dashboard",
    description: "Monitor and control your Facebook advertising campaigns with real-time analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facebook Ads Dashboard",
    description: "Monitor and control your Facebook advertising campaigns",
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
        className={`${oxanium.variable} ${sourceCodePro.variable} antialiased bg-background text-foreground`}
        style={{
          fontFamily: 'var(--font-sans)',
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

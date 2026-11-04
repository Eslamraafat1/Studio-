import type { Metadata, Viewport } from "next";
import { Manrope, DM_Serif_Display, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Shell from "@/components/layout/Shell";
import { BOOT_SCRIPT } from "@/lib/theme";
import { site } from "@/data/studio";

const ui = Manrope({ subsets: ["latin"], variable: "--font-ui", display: "swap" });
const display = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const tech = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-tech", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "MONOLITH® — Architecture & Spatial Design Studio", template: "%s — MONOLITH®" },
  description: "An independent architecture and spatial design studio exploring the relationship between material, light, and human experience. A fictional studio — concept website.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MONOLITH®",
    title: "MONOLITH® — Architecture & Spatial Design Studio",
    description: "We shape what outlasts us. Architecture and spatial design between Copenhagen and Cairo.",
    images: [{ url: "/images/projects/the-observatory-1.jpg", width: 2400, height: 1350, alt: "The Observatory by MONOLITH®" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f3ee" }, { media: "(prefers-color-scheme: dark)", color: "#111310" }],
  width: "device-width",
  initialScale: 1,
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MONOLITH®",
  url: site.url,
  description: "Fictional architecture and spatial design studio (concept website).",
  email: site.email,
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-theme="light" suppressHydrationWarning className={`${ui.variable} ${display.variable} ${tech.variable} ${arabic.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

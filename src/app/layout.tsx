import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "Real Tech — Inverter Sales, Purchase & Repair in Faisalabad",
    template: "%s | Real Tech",
  },
  description: SITE.description,
  keywords: [
    "inverter repair Faisalabad",
    "buy inverter Faisalabad",
    "sell old inverter",
    "UPS repair",
    "solar hybrid inverter",
    "pure sine wave inverter",
    "Real Tech",
    "Jhang Road",
  ],
  openGraph: {
    title: "Real Tech — Power that never backs down",
    description: SITE.description,
    type: "website",
    locale: "en_PK",
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Tech — Inverter Sales, Purchase & Repair",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Near Jhang Road",
    addressLocality: SITE.city,
    addressCountry: "PK",
  },
  makesOffer: [
    "Sale of new and used inverters",
    "Purchase of old, faulty and working inverters",
    "Inverter circuit board repair",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

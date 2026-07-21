import type { Metadata } from "next";
import { Anton, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import { PaperTexture } from "@/components/layout/PaperTexture";
import { SideRail } from "@/components/layout/SideRail";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";

// Oversized narrow condensed display face — headlines only.
const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
// Monospace carries everything else: labels, metadata, captions, body, UI.
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s — ${site.name}`,
  },
  description: site.seo.description,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    ...(site.seo.image ? { images: [site.seo.image] } : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <PaperTexture />
          <SideRail />
          <div className="relative z-10 has-rail">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
        {/* Netlify Identity: handles login for the /admin content editor. */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`if (window.netlifyIdentity) { window.netlifyIdentity.on("init", (user) => { if (!user) { window.netlifyIdentity.on("login", () => { document.location.href = "/admin/"; }); } }); }`}
        </Script>
      </body>
    </html>
  );
}

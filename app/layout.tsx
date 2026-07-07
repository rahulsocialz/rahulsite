import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Texture from "@/components/layout/Texture";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

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
    <html lang="en-GB" className={`dark ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <Texture />
          <Header />
          <main>{children}</main>
          <Footer />
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

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://auberon.agency'),
  title: {
    default: "AUBERON Agency | Digital Excellence",
    template: "%s | AUBERON Agency"
  },
  description: "Transforming Ideas into Digital Excellence. We craft innovative digital experiences through creative design and cutting-edge development.",
  keywords: "digital agency, web development, design agency, creative agency, digital transformation, UI/UX design, web applications, mobile apps",
  authors: [{ name: "AUBERON Agency" }],
  creator: "AUBERON Agency",
  publisher: "AUBERON Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B0D21' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D21' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: '/meta/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/meta/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/meta/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/meta/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/meta/safari-pinned-tab.svg',
        color: '#0B0D21',
      },
    ],
  },
  manifest: '/meta/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://auberon.agency",
    siteName: "AUBERON Agency",
    title: "AUBERON Agency | Digital Excellence",
    description: "Transforming Ideas into Digital Excellence. We craft innovative digital experiences through creative design and cutting-edge development.",
    images: [
      {
        url: "/meta/og-image.png",
        width: 1200,
        height: 630,
        alt: "AUBERON Agency Preview",
        type: "image/png",
      },
      {
        url: "/meta/og-image-square.png",
        width: 600,
        height: 600,
        alt: "AUBERON Agency Square Preview",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@auberon_agency",
    creator: "@auberon_agency",
    title: "AUBERON Agency | Digital Excellence",
    description: "Transforming Ideas into Digital Excellence. We craft innovative digital experiences through creative design and cutting-edge development.",
    images: ["/meta/og-image.png"],
  },
  other: {
    // General Social Media
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:alt": "AUBERON Agency Preview",
    "og:site_name": "AUBERON Agency",
    "og:locale:alternate": ["fr_FR", "es_ES", "de_DE"],
    
    // Facebook specific
    "fb:app_id": "", // Add your Facebook App ID if you have one
    
    // LinkedIn specific
    "linkedin:card": "summary_large_image",
    "linkedin:image": "/meta/og-image.png",
    "linkedin:title": "AUBERON Agency | Digital Excellence",
    "linkedin:description": "Transforming Ideas into Digital Excellence. We craft innovative digital experiences through creative design and cutting-edge development.",
    
    // Pinterest specific
    "pinterest:image": "/meta/og-image.png",
    "pinterest:description": "Transforming Ideas into Digital Excellence. We craft innovative digital experiences through creative design and cutting-edge development.",
    
    // WhatsApp specific
    "og:whatsapp:title": "AUBERON Agency | Digital Excellence",
    "og:whatsapp:description": "Transforming Ideas into Digital Excellence",
    
    // Microsoft Tile
    "msapplication-TileColor": "#0B0D21",
    "msapplication-config": "/meta/browserconfig.xml",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
    "apple-mobile-web-app-title": "AUBERON Agency",
  },
  alternates: {
    canonical: 'https://auberon.agency',
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden relative`} >
        <Menu />
        {children}
        <Footer />
      </body>
    </html>
  );
}

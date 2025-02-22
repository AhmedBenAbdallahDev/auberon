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
        url: "/meta/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AUBERON Agency Preview",
      },
      {
        url: "/meta/og-image-square.jpg",
        width: 600,
        height: 600,
        alt: "AUBERON Agency Square Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUBERON Agency | Digital Excellence",
    description: "Transforming Ideas into Digital Excellence. We craft innovative digital experiences through creative design and cutting-edge development.",
    creator: "@auberon_agency",
    images: ["/meta/twitter-image.jpg"],
  },
  other: {
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

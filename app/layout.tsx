import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ADAN MEDIA - Innovative Webdesign & Entwicklung",
  description:
    "Wir erschaffen innovative digitale Erlebnisse für Ihr Unternehmen. Moderne Webdesigns, die Grenzen des Möglichen erweitern.",
  keywords: "Webdesign, Webentwicklung, Digitale Erlebnisse, ADAN MEDIA",
  authors: [{ name: "ADAN MEDIA Team" }],
  creator: "ADAN MEDIA",
  publisher: "ADAN MEDIA",
  openGraph: {
    title: "ADAN MEDIA - Innovative Webdesign & Entwicklung",
    description:
      "Wir erschaffen innovative digitale Erlebnisse für Ihr Unternehmen. Moderne Webdesigns, die Grenzen des Möglichen erweitern.",
    url: "https://www.adanmedia.de",
    siteName: "ADAN MEDIA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADAN MEDIA - Innovative Webdesign & Entwicklung",
    description:
      "Wir erschaffen innovative digitale Erlebnisse für Ihr Unternehmen. Moderne Webdesigns, die Grenzen des Möglichen erweitern.",
    creator: "@adanmedia",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
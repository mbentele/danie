import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    template: '%s | Danies Rezepte',
    default: 'Danies Rezepte - Die besten Rezepte für ein tolles Ergebnis'
  },
  description: 'Entdecke leckere und einfache Rezepte von Danie. Von schnellen Feierabendgerichten bis zu besonderen Wochenendprojekten - hier findest du Inspiration für jeden Anlass.',
  keywords: ['Rezepte', 'Kochen', 'Backen', 'Food Blog', 'Küche', 'Essen'],
  authors: [{ name: 'Daniela Bentele' }],
  creator: 'Daniela Bentele',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://danie.de',
    siteName: 'Danies Rezepte',
    title: 'Danies Rezepte - Die besten Rezepte für ein tolles Ergebnis',
    description: 'Entdecke leckere und einfache Rezepte von Danie.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Danies Rezepte - Die besten Rezepte für ein tolles Ergebnis'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Danies Rezepte',
    description: 'Die besten Rezepte für ein tolles Ergebnis',
    images: ['/og-image.jpg'],
    creator: '@daniesrezepte'
  },
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
  verification: {
    google: 'your-google-verification-code'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.variable} font-sans`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
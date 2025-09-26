'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Instagram, Mail, Settings } from 'lucide-react'
import { useCookieConsent } from '@/lib/cookie-consent'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { openPreferences } = useCookieConsent()

  return (
    <footer className="glass-dark mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo/logo_rund_300px.png"
                alt="Danies Rezepte Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <Image
                src="/images/logo/schriftzug-transparent.png"
                alt="Danies Rezepte"
                width={160}
                height={28}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-playwrite">
              Leckere Rezepte für jeden Tag. Von schnellen Feierabendgerichten
              bis zu besonderen Wochenendprojekten.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/daniesrezepte"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:kontakt@danie.de"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Rezepte */}
          <div className="space-y-4">
            <h4 className="text-white font-hoss font-bold">Rezepte</h4>
            <nav className="space-y-2">
              <Link href="/rezepte" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Alle Rezepte
              </Link>
              <Link href="/kategorien/hauptgerichte" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Hauptgerichte
              </Link>
              <Link href="/kategorien/desserts" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Desserts
              </Link>
              <Link href="/kategorien/vorspeisen" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Vorspeisen
              </Link>
            </nav>
          </div>

          {/* Über */}
          <div className="space-y-4">
            <h4 className="text-white font-hoss font-bold">Über</h4>
            <nav className="space-y-2">
              <Link href="/ueber-mich" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Über mich
              </Link>
              <Link href="/kontakt" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Kontakt
              </Link>
              <Link href="/impressum" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Impressum
              </Link>
              <Link href="/datenschutz" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Datenschutz
              </Link>
              <Link href="/cookies" className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Cookie-Richtlinie
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Newsletter</h4>
            <p className="text-gray-400 text-sm">
              Neue Rezepte direkt in dein Postfach.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="deine@email.de"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-pink-500 focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Anmelden
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>© {currentYear} Danies Rezepte. Gemacht mit</span>
              <Heart size={16} className="text-pink-500 fill-current" />
              <span>von Daniela Bentele</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-xs">
                &ldquo;GEGESSEN WIRD IMMER&rdquo; • Rezepte für jeden Tag
              </p>
            </div>
          </div>

          {/* Cookie Settings Button */}
          <div className="text-center">
            <button
              onClick={openPreferences}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm"
            >
              <Settings size={14} />
              <span>Cookie-Einstellungen</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
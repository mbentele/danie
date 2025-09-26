'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Rezepte', href: '/rezepte' },
    { name: 'Kategorien', href: '/kategorien' },
    { name: 'Über mich', href: '/ueber-mich' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-md border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            {/* Original Logo mit Text und rundem Symbol */}
            <Image
              src="/images/logo/logo_breit.png"
              alt="Danies Rezepte - My Daily Kitchen"
              width={280}
              height={72}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-hoss font-medium text-xl"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors duration-200">
              <Search size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-600"
            >
              <nav className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 text-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
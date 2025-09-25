'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/rezepte?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-fatfrank text-gradient mb-4">
            Was möchtest du kochen?
          </h2>
          <p className="text-lg text-gray-600 font-hoss">
            Durchsuche alle Rezepte nach Zutaten, Gerichten oder Kategorien
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suche nach Rezepten... (z.B. 'Pasta', 'Kuchen', 'vegetarisch')"
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-hoss"
            />
          </div>
          <button
            type="submit"
            className="btn-primary mt-4 w-full sm:w-auto sm:absolute sm:right-2 sm:top-2 sm:mt-0"
          >
            <span className="font-hoss font-semibold">Rezepte finden</span>
          </button>
        </form>

        {/* Quick Search Tags */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-hoss mb-4">Beliebte Suchbegriffe:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Pasta', 'Kuchen', 'Vegetarisch', 'Schnell', 'Dessert', 'Brot'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="glass px-4 py-2 rounded-full text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200 font-hoss"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState } from 'react'
import { Search, Sparkles, Camera } from 'lucide-react'
import { motion } from 'framer-motion'

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery)
  }

  const aiFeatures = [
    {
      icon: <Search size={24} />,
      title: "Intelligente Suche",
      description: "Finde Rezepte mit natürlicher Sprache"
    },
    {
      icon: <Camera size={24} />,
      title: "Zutaten-Scanner",
      description: "Fotografiere deinen Kühlschrank für Vorschläge"
    },
    {
      icon: <Sparkles size={24} />,
      title: "Smart Vorschläge",
      description: "Personalisierte Empfehlungen basierend auf Vorlieben"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-orange-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Was möchtest du heute kochen?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Durchsuche über 500 Rezepte oder lass dich von unserer KI inspirieren
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="glass rounded-2xl p-2 flex items-center">
                <div className="flex-1 flex items-center">
                  <Search size={20} className="text-gray-400 ml-4 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="z.B. 'Pasta mit Tomaten' oder 'Schnelles Abendessen'"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Suchen
                </button>
              </div>
            </form>

            {/* Quick Search Examples */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                'Vegetarische Pasta',
                'Schnelle Desserts',
                'Comfort Food',
                'Unter 30 Minuten'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setSearchQuery(example)}
                  className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* AI Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white mx-auto">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
                <button className="text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors duration-200">
                  Bald verfügbar →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
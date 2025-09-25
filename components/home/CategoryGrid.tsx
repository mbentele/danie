'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Users, Leaf, Heart, Calendar, ChefHat } from 'lucide-react'

// Neue, moderne Kategorisierung basierend auf unserem Gespräch
const modernCategories = [
  {
    id: 1,
    name: 'Nach Hauptzutat',
    description: 'Finde Rezepte nach Lieblingszutaten',
    icon: <ChefHat size={32} />,
    color: 'from-green-400 to-green-600',
    subcategories: [
      { name: 'Pasta', slug: 'pasta', count: 45 },
      { name: 'Fleisch', slug: 'fleisch', count: 38 },
      { name: 'Fisch', slug: 'fisch', count: 22 },
      { name: 'Gemüse', slug: 'gemuese', count: 56 }
    ]
  },
  {
    id: 2,
    name: 'Nach Diät',
    description: 'Passende Rezepte für deinen Ernährungsstil',
    icon: <Leaf size={32} />,
    color: 'from-emerald-400 to-emerald-600',
    subcategories: [
      { name: 'Vegetarisch', slug: 'vegetarisch', count: 89 },
      { name: 'Vegan', slug: 'vegan', count: 34 },
      { name: 'Glutenfrei', slug: 'glutenfrei', count: 28 },
      { name: 'Low Carb', slug: 'low-carb', count: 19 }
    ]
  },
  {
    id: 3,
    name: 'Nach Zeit',
    description: 'Perfekt für deinen Zeitplan',
    icon: <Clock size={32} />,
    color: 'from-blue-400 to-blue-600',
    subcategories: [
      { name: 'Unter 15 Min', slug: 'unter-15-min', count: 42 },
      { name: 'Unter 30 Min', slug: 'unter-30-min', count: 78 },
      { name: 'Bis 1 Stunde', slug: 'bis-1-stunde', count: 56 },
      { name: 'Über 1 Stunde', slug: 'ueber-1-stunde', count: 23 }
    ]
  },
  {
    id: 4,
    name: 'Nach Anlass',
    description: 'Für jeden besonderen Moment',
    icon: <Calendar size={32} />,
    color: 'from-purple-400 to-purple-600',
    subcategories: [
      { name: 'Feierabend', slug: 'feierabend', count: 67 },
      { name: 'Wochenende', slug: 'wochenende', count: 45 },
      { name: 'Gäste', slug: 'gaeste', count: 38 },
      { name: 'Meal Prep', slug: 'meal-prep', count: 29 }
    ]
  },
  {
    id: 5,
    name: 'Nach Portionen',
    description: 'Für die richtige Anzahl an Personen',
    icon: <Users size={32} />,
    color: 'from-orange-400 to-orange-600',
    subcategories: [
      { name: '1-2 Personen', slug: '1-2-personen', count: 94 },
      { name: '3-4 Personen', slug: '3-4-personen', count: 156 },
      { name: '5-8 Personen', slug: '5-8-personen', count: 67 },
      { name: 'Große Runde', slug: 'grosse-runde', count: 23 }
    ]
  },
  {
    id: 6,
    name: 'Comfort Food',
    description: 'Seelenwärmer für gemütliche Momente',
    icon: <Heart size={32} />,
    color: 'from-pink-400 to-pink-600',
    subcategories: [
      { name: 'Eintöpfe', slug: 'eintoepfe', count: 31 },
      { name: 'Aufläufe', slug: 'auflaeufe', count: 28 },
      { name: 'Süße Sachen', slug: 'suesse-sachen', count: 87 },
      { name: 'Warme Getränke', slug: 'warme-getraenke', count: 18 }
    ]
  }
]

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Entdecke Rezepte nach deinen Wünschen
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Intelligente Kategorisierung hilft dir dabei, genau das richtige Rezept für jeden Anlass zu finden
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modernCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="recipe-card group cursor-pointer"
            >
              <Link href={`/kategorien/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="grid grid-cols-2 gap-3">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.slug}
                        className="glass rounded-lg p-3 hover:bg-white/80 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {sub.name}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {sub.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-end">
                    <div className="text-pink-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Alle ansehen →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Oder lass dich von unserer KI inspirieren
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            ✨ Überrasche mich mit einem Rezept
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
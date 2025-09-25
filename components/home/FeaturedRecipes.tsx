'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Star } from 'lucide-react'

// Mock data - wird später durch echte Datenbank-Abfrage ersetzt
const featuredRecipes = [
  {
    id: 1,
    title: 'Schoko-Zimt-Schnecken',
    slug: 'schoko-zimt-schnecken',
    description: 'Fluffige Hefeschnecken mit Schokolade und Zimt - perfekt für gemütliche Nachmittage',
    image: '/images/recipes/schoko-zimt-schnecken.jpg',
    category: 'Desserts',
    categorySlug: 'desserts',
    prepTime: 30,
    totalTime: 120,
    servings: 8,
    difficulty: 'Mittel',
    rating: 4.8,
    featured: true
  },
  {
    id: 2,
    title: 'Schnelle Gnocchi-Pfanne',
    slug: 'schnelle-gnocchi-pfanne',
    description: 'Cremige Gnocchi mit Gemüse - in nur 20 Minuten auf dem Tisch',
    image: '/images/recipes/gnocchi-pfanne.jpg',
    category: 'Hauptgerichte',
    categorySlug: 'hauptgerichte',
    prepTime: 10,
    totalTime: 20,
    servings: 4,
    difficulty: 'Einfach',
    rating: 4.6,
    featured: true
  },
  {
    id: 3,
    title: 'Mini-Donuts',
    slug: 'mini-donuts',
    description: 'Kleine gebackene Donuts mit verschiedenen Glasuren - perfekt für Kinder',
    image: '/images/recipes/mini-donuts.jpg',
    category: 'Desserts',
    categorySlug: 'desserts',
    prepTime: 20,
    totalTime: 45,
    servings: 12,
    difficulty: 'Einfach',
    rating: 4.9,
    featured: true
  }
]

export function FeaturedRecipes() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Beliebte Rezepte
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Diese Rezepte sind besonders beliebt bei unseren Lesern
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/rezepte/${recipe.categorySlug}/${recipe.slug}`}>
                <div className="recipe-card group cursor-pointer h-full">
                  {/* Image */}
                  <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="glass text-sm px-3 py-1 rounded-full text-gray-600">
                        {recipe.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="glass w-10 h-10 rounded-full flex items-center justify-center">
                        <Star size={16} className="text-yellow-500 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    {/* Recipe Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{recipe.totalTime}min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>{recipe.servings}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="font-medium">{recipe.rating}</span>
                      </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        recipe.difficulty === 'Einfach'
                          ? 'bg-green-100 text-green-800'
                          : recipe.difficulty === 'Mittel'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {recipe.difficulty}
                      </span>
                      <motion.div
                        className="text-pink-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        Rezept ansehen →
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Recipes Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/rezepte">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Alle Rezepte entdecken
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
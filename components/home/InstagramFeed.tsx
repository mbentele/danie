<<<<<<< HEAD
'use client'

import { motion } from 'framer-motion'
import { Instagram, ExternalLink } from 'lucide-react'

// Mock Instagram-Daten - später durch echte Instagram API ersetzen
const instagramPosts = [
  {
    id: 1,
    image: '/images/recipes/schoko-zimt-schnecken.jpg',
    caption: 'Heute gibt es fluffige Pancakes zum Frühstück! 🥞',
    likes: 234,
    url: 'https://instagram.com/daniesrezepte'
  },
  {
    id: 2,
    image: '/images/recipes/gnocchi-pfanne.jpg',
    caption: 'Comfort Food für den Herbst: Kürbissuppe 🎃',
    likes: 189,
    url: 'https://instagram.com/daniesrezepte'
  },
  {
    id: 3,
    image: '/images/recipes/mini-donuts.jpg',
    caption: 'King Cat hilft beim Backen 🐱👩‍🍳',
    likes: 312,
    url: 'https://instagram.com/daniesrezepte'
  },
  {
    id: 4,
    image: '/images/recipes/schoko-zimt-schnecken.jpg',
    caption: 'Meal Prep Sunday! Diese Woche wird gesund ✨',
    likes: 156,
    url: 'https://instagram.com/daniesrezepte'
  }
]

=======
>>>>>>> 53122b335e8391d7bd0eb0c4b41a5c19d36d8759
export function InstagramFeed() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-fatfrank text-gradient mb-4">
            Folge mir auf Instagram
          </h2>
          <p className="text-lg text-gray-600 font-hoss max-w-2xl mx-auto">
            Entdecke täglich neue Rezepte, Tipps und Inspiration aus meiner Küche
          </p>
        </div>

        <div className="max-w-md mx-auto text-center">
          <a
            href="https://instagram.com/danie"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span className="font-hoss font-semibold">@danie auf Instagram folgen</span>
          </a>
          <p className="text-sm text-gray-500 mt-4 font-hoss">
            17.7k Follower • Täglich neue Rezepte
          </p>
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Instagram, ExternalLink } from 'lucide-react'

// Mock Instagram-Daten - später durch echte Instagram API ersetzen
const instagramPosts = [
  {
    id: 1,
    image: '/images/instagram/post1.jpg',
    caption: 'Heute gibt es fluffige Pancakes zum Frühstück! 🥞',
    likes: 234,
    url: 'https://instagram.com/daniesrezepte'
  },
  {
    id: 2,
    image: '/images/instagram/post2.jpg',
    caption: 'Comfort Food für den Herbst: Kürbissuppe 🎃',
    likes: 189,
    url: 'https://instagram.com/daniesrezepte'
  },
  {
    id: 3,
    image: '/images/instagram/post3.jpg',
    caption: 'King Cat hilft beim Backen 🐱👩‍🍳',
    likes: 312,
    url: 'https://instagram.com/daniesrezepte'
  },
  {
    id: 4,
    image: '/images/instagram/post4.jpg',
    caption: 'Meal Prep Sunday! Diese Woche wird gesund ✨',
    likes: 156,
    url: 'https://instagram.com/daniesrezepte'
  }
]

export function InstagramFeed() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="flex items-center justify-center space-x-3">
            <Instagram size={32} className="text-pink-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              @daniesrezepte
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Folge mir auf Instagram für tägliche Inspiration und Behind-the-Scenes
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>17.7k Follower</span>
            <span>•</span>
            <span>GEGESSEN WIRD IMMER</span>
            <span>•</span>
            <span>Rezepte für jeden Tag</span>
          </div>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-20" />
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                {/* Placeholder for actual Instagram images */}
                <Instagram size={32} />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white space-y-2">
                  <ExternalLink size={24} />
                  <p className="text-sm">❤️ {post.likes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center space-y-6"
        >
          <p className="text-gray-600">
            Verpasse keine neuen Rezepte und erhalte exklusive Tipps!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://instagram.com/daniesrezepte"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <Instagram size={20} />
              <span>Auf Instagram folgen</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              Instagram Stories ansehen
            </motion.button>
          </div>

          {/* Story Highlights Preview */}
          <div className="flex justify-center space-x-4 mt-8">
            {['Story-Rezepte', 'King Cat', 'Wandern', 'Little doglady', 'Tipps/Infos'].map((highlight, index) => (
              <motion.div
                key={highlight}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white text-xs font-medium">
                    {highlight.charAt(0)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 max-w-16 truncate">
                  {highlight}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { Instagram } from 'lucide-react'
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
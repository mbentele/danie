'use client'

import { motion } from 'framer-motion'
import { Search, Clock, Users, ChefHat } from 'lucide-react'
import { useState, useEffect } from 'react'

export function HeroSection() {
  const [dynamicContent, setDynamicContent] = useState({
    title: "Willkommen in Danies Küche! 👋",
    subtitle: "Die besten Rezepte für ein tolles Ergebnis",
    suggestion: "Was soll heute gekocht werden?"
  })

  useEffect(() => {
    const currentTime = new Date().getHours()
    const currentMonth = new Date().getMonth()

    // Dynamic content based on time and season
    const getDynamicContent = () => {
      // Morning suggestions
      if (currentTime >= 6 && currentTime < 11) {
        return {
          title: "Guten Morgen!",
          subtitle: "Starte den Tag mit einem leckeren Frühstück",
          suggestion: "Pancakes oder Overnight Oats?"
        }
      }

      // Lunch suggestions
      if (currentTime >= 11 && currentTime < 15) {
        return {
          title: "Mittagszeit!",
          subtitle: "Schnelle und leckere Gerichte für deine Pause",
          suggestion: "15-Minuten Rezepte entdecken"
        }
      }

      // Evening suggestions
      if (currentTime >= 17 && currentTime < 21) {
        return {
          title: "Feierabend-Küche!",
          subtitle: "Entspannte Rezepte für nach der Arbeit",
          suggestion: "Comfort Food für heute"
        }
      }

      // Winter/Christmas season (Nov-Jan)
      if (currentMonth >= 10 || currentMonth <= 1) {
        return {
          title: "Winterküche!",
          subtitle: "Wärmende Rezepte für kalte Tage",
          suggestion: "Eintöpfe und heiße Getränke"
        }
      }

      // Default
      return {
        title: "Willkommen in Danies Küche!",
        subtitle: "Die besten Rezepte für ein tolles Ergebnis",
        suggestion: "Was soll heute gekocht werden?"
      }
    }

    setDynamicContent(getDynamicContent())
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-orange-50" />

      {/* Floating food icons */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 text-6xl opacity-20"
        >
        </motion.div>
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-32 right-32 text-4xl opacity-20"
        >
        </motion.div>
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-40 left-32 text-5xl opacity-20"
        >
        </motion.div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Dynamic Greeting */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-fatfrank text-gradient">
              {dynamicContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-hoss">
              {dynamicContent.subtitle}
            </p>
            <p className="text-lg text-gray-500 font-hoss">
              {dynamicContent.suggestion}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <ChefHat size={20} className="text-pink-500" />
              <span>500+ Rezepte</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-pink-500" />
              <span>17.7k Follower</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-pink-500" />
              <span>Täglich neue Ideen</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2"
            >
              <Search size={20} />
              <span>Rezepte entdecken</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Zufälliges Rezept</span>
            </motion.button>
          </div>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Vegetarisch', 'Unter 30 Min', 'Comfort Food', 'Desserts', 'Feierabend'].map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="glass px-4 py-2 rounded-full text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
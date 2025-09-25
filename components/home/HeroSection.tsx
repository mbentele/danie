'use client'

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
          title: "Guten Morgen! 🌅",
          subtitle: "Starte den Tag mit einem leckeren Frühstück",
          suggestion: "Pancakes oder Overnight Oats?"
        }
      }

      // Lunch suggestions
      if (currentTime >= 11 && currentTime < 15) {
        return {
          title: "Mittagszeit! 🍽️",
          subtitle: "Schnelle und leckere Gerichte für deine Pause",
          suggestion: "15-Minuten Rezepte entdecken"
        }
      }

      // Evening suggestions
      if (currentTime >= 17 && currentTime < 21) {
        return {
          title: "Feierabend-Küche! 👨‍🍳",
          subtitle: "Entspannte Rezepte für nach der Arbeit",
          suggestion: "Comfort Food für heute"
        }
      }

      // Winter/Christmas season (Nov-Jan)
      if (currentMonth >= 10 || currentMonth <= 1) {
        return {
          title: "Winterküche! ❄️",
          subtitle: "Wärmende Rezepte für kalte Tage",
          suggestion: "Eintöpfe und heiße Getränke"
        }
      }

      // Default
      return {
<<<<<<< HEAD
        title: "Willkommen in Danies Küche! 👋",
        subtitle: "Die besten Rezepte für ein tolles Ergebnis",
        suggestion: "Was soll heute gekocht werden?"
      }
    }

    setDynamicContent(getDynamicContent())
  }, [])
=======
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

  const dynamicContent = getDynamicContent()
>>>>>>> 53122b335e8391d7bd0eb0c4b41a5c19d36d8759

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-orange-50" />


      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="space-y-8">
          {/* Dynamic Greeting */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-fatfrank text-gradient">
              {dynamicContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-hoss">
              {dynamicContent.subtitle}
            </p>
            <p className="text-lg text-gray-500 font-playwrite">
              {dynamicContent.suggestion}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <ChefHat size={20} className="text-pink-500" />
              <span className="font-hoss font-medium">500+ Rezepte</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-pink-500" />
              <span className="font-hoss font-medium">17.7k Follower</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-pink-500" />
              <span className="font-hoss font-medium">Täglich neue Ideen</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/rezepte" className="btn-primary flex items-center space-x-2">
              <Search size={20} />
              <span className="font-hoss font-semibold">Rezepte entdecken</span>
            </a>
          </div>

          {/* Quick Search Tags */}
          <div className="space-y-3">
            <p className="text-gray-400 font-playwrite text-sm">
              Beliebte Kategorien:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Vegetarisch', 'Unter 30 Min', 'Comfort Food', 'Desserts', 'Feierabend'].map((tag) => (
                <button
                  key={tag}
                  className="glass px-4 py-2 rounded-full text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200 font-hoss"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
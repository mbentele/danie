import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kategorien',
  description: 'Durchsuche Rezepte nach Kategorien - Vegetarisch, Desserts, Hauptgerichte und mehr.'
}

export default function KategorienPage() {
  const categories = [
    { name: 'Hauptgerichte', icon: '🍽️', count: 120, color: 'from-blue-400 to-blue-600' },
    { name: 'Desserts', icon: '🍰', count: 85, color: 'from-pink-400 to-pink-600' },
    { name: 'Vegetarisch', icon: '🥗', count: 95, color: 'from-green-400 to-green-600' },
    { name: 'Vegan', icon: '🌱', count: 45, color: 'from-emerald-400 to-emerald-600' },
    { name: 'Schnelle Küche', icon: '⚡', count: 78, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Comfort Food', icon: '🥘', count: 65, color: 'from-orange-400 to-orange-600' },
    { name: 'Festtagsessen', icon: '🎉', count: 35, color: 'from-purple-400 to-purple-600' },
    { name: 'Getränke', icon: '🥤', count: 25, color: 'from-cyan-400 to-cyan-600' }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Kategorien 📂
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finde das perfekte Rezept für jeden Anlass
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} mx-auto mb-4 flex items-center justify-center text-2xl`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {category.count} Rezepte
              </p>
              <button className="btn-secondary w-full">
                Entdecken
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
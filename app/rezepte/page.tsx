import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rezepte',
  description: 'Entdecke alle Rezepte von Danies Küche - von schnellen Gerichten bis zu besonderen Wochenendprojekten.'
}

export default function RezeptePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Alle Rezepte 🍳
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Entdecke leckere und einfache Rezepte für jeden Anlass
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder Rezepte */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="recipe-card">
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-orange-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-6xl">🍝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rezept {i}</h3>
              <p className="text-gray-600 mb-4">
                Eine kurze Beschreibung des leckeren Rezepts...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>⏱️ 30 Min</span>
                <span>👥 4 Portionen</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
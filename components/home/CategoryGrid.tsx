import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import Link from 'next/link'

async function getCategories() {
  try {
    const allCategories = await db.select().from(categories)
    return allCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function CategoryGrid() {
  const categoryList = await getCategories()

  if (categoryList.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-fatfrank text-gradient mb-4">
            Kategorien entdecken
          </h2>
          <p className="text-lg text-gray-600 font-hoss max-w-2xl mx-auto">
            Von herzhaften Hauptgerichten bis zu süßen Desserts - hier findest du alles
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/rezepte?category=${category.slug}`}
              className="group block"
            >
              <div className="glass rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                {/* Category Icon/Color */}
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="text-2xl text-white font-fatfrank">
                    {category.name.charAt(0)}
                  </span>
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-fatfrank text-gray-800 group-hover:text-pink-600 transition-colors mb-2">
                  {category.name}
                </h3>

                {/* Category Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 font-hoss line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/rezepte"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span className="font-hoss font-semibold">Alle Rezepte durchsuchen</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
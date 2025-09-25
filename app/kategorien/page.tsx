import Link from 'next/link'
import { db } from '@/lib/db'
import { categories, recipeCategories } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import { ChefHat } from 'lucide-react'

async function getCategories() {
  try {
    const categoryStats = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        color: categories.color,
        recipeCount: count(recipeCategories.recipeId)
      })
      .from(categories)
      .leftJoin(recipeCategories, eq(categories.id, recipeCategories.categoryId))
      .groupBy(categories.id, categories.name, categories.slug, categories.description, categories.color)
      .orderBy(count(recipeCategories.recipeId))

    return categoryStats.reverse() // Reverse to show categories with most recipes first
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categoryStats = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass rounded-3xl p-8 mb-8 text-center">
          <h1 className="text-4xl font-fatfrank text-gradient mb-4">
            Kategorien
          </h1>
          <p className="text-xl text-gray-600 font-hoss">
            Entdecke unsere Rezept-Sammlungen nach deinen Lieblings-Themen
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryStats.map((category) => (
            <Link
              key={category.id}
              href={`/kategorien/${category.slug}`}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-fatfrank text-gray-800">
                      {category.recipeCount}
                    </span>
                    <p className="text-sm text-gray-500 font-hoss">
                      {category.recipeCount === 1 ? 'Rezept' : 'Rezepte'}
                    </p>
                  </div>
                </div>

                {/* Category Info */}
                <h2 className="text-xl font-fatfrank text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="text-gray-600 font-hoss text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Action Indicator */}
                <div className="flex items-center text-pink-600 font-hoss text-sm font-semibold group-hover:text-pink-700">
                  Rezepte entdecken
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Total Stats */}
        <div className="glass rounded-2xl p-6 mt-8 text-center">
          <h3 className="text-lg font-fatfrank text-gray-800 mb-2">
            Gesamt-Übersicht
          </h3>
          <p className="text-gray-600 font-hoss">
            {categoryStats.reduce((total, cat) => total + cat.recipeCount, 0)} Rezepte
            in {categoryStats.length} Kategorien
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Kategorien - Danies Küche',
  description: 'Entdecke alle Rezept-Kategorien von Danies Küche. Von Alltagsgerichten über süße Leckereien bis hin zu besonderen Anlässen.',
}
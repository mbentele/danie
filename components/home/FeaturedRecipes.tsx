import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Star } from 'lucide-react'

async function getFeaturedRecipes() {
  try {
    const featuredRecipes = await db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.published, true))
      .orderBy(desc(recipes.updatedAt))
      .limit(6)

    return featuredRecipes
  } catch (error) {
    console.error('Error fetching featured recipes:', error)
    return []
  }
}

export async function FeaturedRecipes() {
  const featuredRecipes = await getFeaturedRecipes()

  if (featuredRecipes.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-fatfrank text-gradient mb-4">
            Beliebte Rezepte
          </h2>
          <p className="text-lg text-gray-600 font-hoss max-w-2xl mx-auto">
            Diese Rezepte werden von der Community besonders geliebt
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map(({ recipe, category }) => (
            <Link
              key={recipe.id}
              href={`/rezepte/${recipe.slug}`}
              className="group block"
            >
              <article className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-orange-100">
                  {recipe.featuredImage ? (
                    <Image
                      src={recipe.featuredImage}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-lg text-gray-500 font-hoss">Kein Bild</div>
                    </div>
                  )}

                  {/* Category Badge */}
                  {category && (
                    <div className="absolute top-3 right-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-hoss font-semibold text-white"
                        style={{ backgroundColor: category.color || '#ec4899' }}
                      >
                        {category.name}
                      </span>
                    </div>
                  )}

                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-hoss font-semibold flex items-center space-x-1">
                      <Star size={12} fill="currentColor" />
                      <span>Beliebt</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-fatfrank text-gray-800 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>

                  {recipe.description && (
                    <p className="text-gray-600 font-hoss text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 font-hoss">
                    <div className="flex items-center space-x-4">
                      {recipe.totalTime && (
                        <span className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{recipe.totalTime}min</span>
                        </span>
                      )}
                      {recipe.servings && (
                        <span className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{recipe.servings}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/rezepte"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <span className="font-hoss font-semibold">Alle Rezepte ansehen</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
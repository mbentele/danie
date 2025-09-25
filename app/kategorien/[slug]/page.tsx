import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq, limit, offset, count, and } from 'drizzle-orm'
import { ArrowLeft, ChefHat } from 'lucide-react'
import { RecipeCard } from '@/components/recipes/RecipeCard'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

const RECIPES_PER_PAGE = 30

async function getCategory(slug: string) {
  try {
    const categoryData = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    return categoryData[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getCategoryRecipes(categoryId: string, page: number = 1) {
  try {
    const offsetValue = (page - 1) * RECIPES_PER_PAGE

    // Get recipes for this category with pagination
    const recipeData = await db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .innerJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .innerJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(and(
        eq(categories.id, categoryId),
        eq(recipes.published, true)
      ))
      .orderBy(recipes.createdAt)
      .limit(RECIPES_PER_PAGE)
      .offset(offsetValue)

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(recipes)
      .innerJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .where(and(
        eq(recipeCategories.categoryId, categoryId),
        eq(recipes.published, true)
      ))

    const totalRecipes = totalCountResult[0]?.count || 0
    const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE)

    return {
      recipes: recipeData,
      totalRecipes,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching category recipes:', error)
    return {
      recipes: [],
      totalRecipes: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const page = parseInt(searchParams.page || '1', 10)
  const { recipes: categoryRecipes, totalRecipes, totalPages, currentPage } = await getCategoryRecipes(category.id, page)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/kategorien" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-hoss font-medium">
            <ArrowLeft size={20} className="mr-2" />
            Zurück zu allen Kategorien
          </Link>
        </div>

        {/* Category Header */}
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: category.color }}
            >
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-fatfrank text-gradient">
                {category.name}
              </h1>
              <p className="text-lg text-gray-500 font-hoss">
                {totalRecipes} {totalRecipes === 1 ? 'Rezept' : 'Rezepte'}
              </p>
            </div>
          </div>

          {category.description && (
            <p className="text-xl text-gray-600 font-hoss">
              {category.description}
            </p>
          )}
        </div>

        {/* Recipes Grid */}
        {categoryRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categoryRecipes.map(({ recipe, category }) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  category={category}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 font-hoss">
                    Seite {currentPage} von {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Previous Page */}
                    {currentPage > 1 && (
                      <Link
                        href={`/kategorien/${params.slug}?page=${currentPage - 1}`}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg font-hoss font-semibold hover:bg-pink-600 transition-colors"
                      >
                        Vorherige
                      </Link>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number

                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Link
                            key={pageNum}
                            href={`/kategorien/${params.slug}?page=${pageNum}`}
                            className={`px-3 py-2 rounded-lg font-hoss font-semibold transition-colors ${
                              pageNum === currentPage
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-pink-100'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        )
                      })}
                    </div>

                    {/* Next Page */}
                    {currentPage < totalPages && (
                      <Link
                        href={`/kategorien/${params.slug}?page=${currentPage + 1}`}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg font-hoss font-semibold hover:bg-pink-600 transition-colors"
                      >
                        Nächste
                      </Link>
                    )}
                  </div>

                  <div className="text-gray-600 font-hoss">
                    {((currentPage - 1) * RECIPES_PER_PAGE) + 1} - {Math.min(currentPage * RECIPES_PER_PAGE, totalRecipes)} von {totalRecipes}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <h3 className="text-xl font-fatfrank text-gray-800 mb-4">
              Keine Rezepte gefunden
            </h3>
            <p className="text-gray-600 font-hoss">
              In dieser Kategorie sind noch keine Rezepte verfügbar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug)

  if (!category) {
    return {
      title: 'Kategorie nicht gefunden - Danies Küche'
    }
  }

  return {
    title: `${category.name} - Danies Küche`,
    description: category.description || `Alle Rezepte aus der Kategorie ${category.name}`,
  }
}
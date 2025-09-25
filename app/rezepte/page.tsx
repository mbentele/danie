import { Suspense } from 'react'
import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { RecipeSearch } from '@/components/recipes/RecipeSearch'
import { RecipesSkeleton } from '@/components/recipes/RecipesSkeleton'
import { Grid, Filter, Search } from 'lucide-react'

// Metadata for the page
export const metadata = {
  title: 'Alle Rezepte',
  description: 'Entdecke alle 500+ leckeren Rezepte von Danie. Von schnellen Feierabendgerichten bis zu besonderen Wochenendprojekten.',
}

async function getRecipes() {
  try {
    // Get all published recipes with their categories
    const recipesWithCategories = await db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.published, true))
      .orderBy(desc(recipes.updatedAt))
      // Load all recipes for correct category counts

    return recipesWithCategories
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

async function getCategories() {
  try {
    const allCategories = await db.select().from(categories)
    return allCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getRecipeStats() {
  try {
    // Get total counts
    const recipeResult = await db
      .select()
      .from(recipes)
      .where(eq(recipes.published, true))

    const categoryCount = await db.select().from(categories)

    return {
      recipeCount: recipeResult.length,
      categoryCount: categoryCount.length || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      recipeCount: 0,
      categoryCount: 0
    }
  }
}

export default async function RecipesPage() {
  const [recipesData, categoriesData, stats] = await Promise.all([
    getRecipes(),
    getCategories(),
    getRecipeStats()
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-fatfrank text-gradient mb-4">
            Alle Rezepte
          </h1>
          <p className="text-xl text-gray-600 font-hoss mb-6">
            Entdecke {stats.recipeCount} leckere Rezepte aus {stats.categoryCount} Kategorien
          </p>
          <p className="text-xl md:text-2xl text-gray-500 font-playwrite mb-8 font-medium">
            Jedes Rezept mit Liebe getestet & für perfekte Ergebnisse optimiert
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <Grid size={20} className="text-pink-500" />
              <span className="font-hoss font-medium">{stats.recipeCount} Rezepte</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-pink-500" />
              <span className="font-hoss font-medium">{stats.categoryCount} Kategorien</span>
            </div>
            <div className="flex items-center space-x-2">
              <Search size={20} className="text-pink-500" />
              <span className="font-hoss font-medium">Intelligente Suche</span>
            </div>
          </div>
        </div>

        {/* Interactive Recipe Search & Grid */}
        <Suspense fallback={<RecipesSkeleton />}>
          <RecipeSearch
            initialRecipes={recipesData}
            categories={categoriesData}
          />
        </Suspense>

      </div>
    </div>
  )
}
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { RecipeSearch } from '@/components/recipes/RecipeSearch'
import { RecipesSkeleton } from '@/components/recipes/RecipesSkeleton'

async function getRecipesWithCategories() {
  try {
    const recipesData = await db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.published, true))

    return recipesData
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

async function getCategories() {
  try {
    return await db.select().from(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const metadata = {
  title: 'Alle Rezepte',
  description: 'Entdecke alle leckeren Rezepte von Danie - von schnellen Alltagsgerichten bis zu besonderen Köstlichkeiten.',
}

export default async function RezeptePage() {
  const [recipesData, categoriesData] = await Promise.all([
    getRecipesWithCategories(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-fatfrank text-gradient mb-4">
            Alle Rezepte
          </h1>
          <p className="text-xl text-gray-600 font-hoss max-w-2xl mx-auto">
            Entdecke alle leckeren Rezepte - von schnellen Alltagsgerichten bis zu besonderen Köstlichkeiten.
          </p>
        </div>

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
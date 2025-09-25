import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq, ne, limit } from 'drizzle-orm'
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { RecipeCard } from '@/components/recipes/RecipeCard'
import { RecipeImages } from '@/components/recipes/RecipeImages'
import { cleanWordPressShortcodes, cleanArrayFromShortcodes, extractNutritionFacts } from '@/lib/utils'

interface RecipePageProps {
  params: {
    slug: string
  }
}

async function getRecipe(slug: string) {
  try {
    const recipeData = await db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.slug, slug))
      .limit(1)

    return recipeData[0] || null
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

async function getSimilarRecipes(currentRecipeSlug: string, categoryId?: string) {
  try {
    // Get current recipe to find its ID and category
    const currentRecipe = await db
      .select({
        id: recipes.id,
        categoryId: categories.id
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.slug, currentRecipeSlug))
      .limit(1)

    if (!currentRecipe[0]) return []

    // Get 3 similar recipes, preferring same category
    const similarRecipes = await db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.published, true))
      .where(ne(recipes.id, currentRecipe[0].id))
      .limit(3)

    return similarRecipes
  } catch (error) {
    console.error('Error fetching similar recipes:', error)
    return []
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const data = await getRecipe(params.slug)
  // Temporarily disable similar recipes to avoid UUID errors
  const similarRecipesData: any[] = []

  if (!data || !data.recipe.published) {
    notFound()
  }

  const { recipe, category } = data
  const totalTime = recipe.totalTime || (recipe.cookTime || 0) + (recipe.prepTime || 0)

  // Parse ingredients, instructions, and additional images
  let ingredients: string[] = []
  let instructions: string[] = []
  let additionalImages: string[] = []
  let nutrition = {}

  try {
    const rawIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : JSON.parse(recipe.ingredients as string)
    const rawInstructions = Array.isArray(recipe.instructions) ? recipe.instructions : JSON.parse(recipe.instructions as string)

    ingredients = cleanArrayFromShortcodes(rawIngredients)
    const cleanedInstructions = cleanArrayFromShortcodes(rawInstructions)

    // Extract nutrition facts from instructions
    const { cleanInstructions, nutrition: extractedNutrition } = extractNutritionFacts(cleanedInstructions)
    instructions = cleanInstructions
    nutrition = extractedNutrition

    additionalImages = Array.isArray(recipe.images) ? recipe.images : JSON.parse(recipe.images as string || '[]')
  } catch (e) {
    console.error('Error parsing recipe data:', e)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/rezepte" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-hoss font-medium">
            <ArrowLeft size={20} className="mr-2" />
            Zurück zu allen Rezepten
          </Link>
        </div>
        {/* Header */}
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <RecipeImages
              featuredImage={recipe.featuredImage}
              additionalImages={additionalImages}
              title={recipe.title}
            />

            {/* Recipe Info */}
            <div>
              <h1 className="text-4xl font-fatfrank text-gradient mb-4">
                {recipe.title}
              </h1>

              {recipe.description && (
                <p className="text-xl text-gray-600 font-hoss mb-6">
                  {cleanWordPressShortcodes(recipe.description)}
                </p>
              )}

              {/* Recipe Meta */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {totalTime > 0 && (
                  <div className="glass p-4 rounded-xl text-center">
                    <Clock className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-hoss">Zeit</p>
                    <p className="font-fatfrank text-gray-800">{totalTime}min</p>
                  </div>
                )}

                {recipe.servings && recipe.servings !== 4 && (
                  <div className="glass p-4 rounded-xl text-center">
                    <Users className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-hoss">Portionen</p>
                    <p className="font-fatfrank text-gray-800">{recipe.servings}</p>
                  </div>
                )}

                <div className="glass p-4 rounded-xl text-center">
                  <ChefHat className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-hoss">Schritte</p>
                  <p className="font-fatfrank text-gray-800">{instructions.length}</p>
                </div>
              </div>

              {/* Category */}
              {category && (
                <div className="mb-6">
                  <span
                    className="px-4 py-2 rounded-full text-sm font-hoss font-semibold text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Ingredients */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-6">
              Zutaten ({ingredients.length})
            </h2>
            <ul className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-hoss text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-6">
              Zubereitung
            </h2>
{(() => {
              // Filter out empty or &nbsp; only instructions
              const validInstructions = instructions.filter(instruction => {
                const cleaned = instruction.replace(/&nbsp;/g, '').trim()
                return cleaned.length > 0
              })

              return validInstructions.length === 1 ? (
                // Single valid instruction - no numbering
                <div className="p-4 rounded-lg bg-white/50">
                  <p className="font-hoss text-gray-700 leading-relaxed">
                    {validInstructions[0]}
                  </p>
                </div>
              ) : (
                // Multiple instructions - with numbering
                <ol className="space-y-4">
                  {validInstructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-fatfrank flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="font-hoss text-gray-700 leading-relaxed">
                        {instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              )
            })()}
          </div>
        </div>

        {/* Nutrition Facts */}
        {(nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fat) && (
          <div className="glass rounded-2xl p-6 mb-12">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-6">
              Nährwerte {nutrition.servingNote && `(${nutrition.servingNote})`}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nutrition.calories && (
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl font-fatfrank text-orange-600 mb-1">
                    {nutrition.calories}
                  </div>
                  <div className="text-sm font-hoss text-gray-600">kcal</div>
                </div>
              )}
              {nutrition.protein && (
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl font-fatfrank text-pink-600 mb-1">
                    {nutrition.protein}g
                  </div>
                  <div className="text-sm font-hoss text-gray-600">Eiweiß</div>
                </div>
              )}
              {nutrition.carbs && (
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl font-fatfrank text-purple-600 mb-1">
                    {nutrition.carbs}g
                  </div>
                  <div className="text-sm font-hoss text-gray-600">Kohlenhydrate</div>
                </div>
              )}
              {nutrition.fat && (
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl font-fatfrank text-yellow-600 mb-1">
                    {nutrition.fat}g
                  </div>
                  <div className="text-sm font-hoss text-gray-600">Fett</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similar Recipes */}
        {similarRecipesData.length > 0 && (
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-6">
              Ähnliche Rezepte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarRecipesData.map(({ recipe: similarRecipe, category: similarCategory }) => (
                <RecipeCard
                  key={similarRecipe.id}
                  recipe={similarRecipe}
                  category={similarCategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
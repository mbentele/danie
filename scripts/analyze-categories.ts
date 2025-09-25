import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function analyzeWordPressCategories() {
  console.log('Analyzing WordPress URLs for category patterns...')

  // Get all recipes with WordPress URLs
  const recipesWithUrls = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      wpUrl: recipes.wpUrl
    })
    .from(recipes)
    .where(eq(recipes.published, true))
    .limit(100)

  console.log(`Found ${recipesWithUrls.length} recipes with data`)

  // First show some example URLs
  console.log('\nExample WordPress URLs:')
  for (const recipe of recipesWithUrls.slice(0, 10)) {
    if (recipe.wpUrl) {
      console.log(`${recipe.title}: ${recipe.wpUrl}`)
    }
  }

  // Check existing categories
  const existingCategories = await db.select().from(categories)
  console.log(`\nExisting categories: ${existingCategories.length}`)
  for (const cat of existingCategories) {
    console.log(`- ${cat.name} (${cat.slug})`)
  }

  // Analyze URL patterns
  const categoryPatterns = new Map<string, string[]>()

  for (const recipe of recipesWithUrls) {
    if (recipe.wpUrl) {
      // Extract category from WordPress URL pattern
      // Expected patterns like: https://www.danie.de/rezepte/kategorie/rezept-name/
      const urlParts = recipe.wpUrl.split('/')
      const rezepteIndex = urlParts.indexOf('rezepte')

      if (rezepteIndex !== -1 && urlParts[rezepteIndex + 1] && urlParts[rezepteIndex + 1] !== recipe.slug) {
        const categorySlug = urlParts[rezepteIndex + 1]
        if (!categoryPatterns.has(categorySlug)) {
          categoryPatterns.set(categorySlug, [])
        }
        categoryPatterns.get(categorySlug)?.push(recipe.title)
      }
    }
  }

  console.log('\nCategory patterns found in URLs:')
  for (const [categorySlug, recipeNames] of categoryPatterns.entries()) {
    console.log(`${categorySlug}: ${recipeNames.length} recipes`)
    console.log(`  Examples: ${recipeNames.slice(0, 3).join(', ')}`)
  }

  return { recipesWithUrls, categoryPatterns, existingCategories }
}

// Run analysis
analyzeWordPressCategories().catch(console.error)
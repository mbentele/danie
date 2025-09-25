import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// WordPress category mapping with colors
const wpCategories = [
  {
    slug: 'alltagskueche',
    name: 'Alltagsküche',
    description: 'Einfache und leckere Rezepte für jeden Tag',
    color: '#10b981'
  },
  {
    slug: 'fruehstueck',
    name: 'Frühstück',
    description: 'Süße und herzhafte Frühstücksideen',
    color: '#f59e0b'
  },
  {
    slug: 'kuchen-suesses',
    name: 'Kuchen & Süßes',
    description: 'Kuchen, Torten, Desserts und süße Leckereien',
    color: '#ec4899'
  },
  {
    slug: 'kuechen-basics',
    name: 'Küchen-Basics',
    description: 'Grundrezepte, Saucen und Basiswissen',
    color: '#6366f1'
  },
  {
    slug: 'kuechengeschenke',
    name: 'Küchengeschenke',
    description: 'Selbstgemachte Geschenke aus der Küche',
    color: '#ef4444'
  },
  {
    slug: 'rezepte-fuer-besondere-anlaesse',
    name: 'Besondere Anlässe',
    description: 'Festliche Rezepte für besondere Momente',
    color: '#8b5cf6'
  },
  {
    slug: 'ohne-brot-nix-los',
    name: 'Ohne Brot nix los',
    description: 'Brot, Brötchen, Foccacia und alles rund ums Backen',
    color: '#d97706'
  }
]

async function createCategories() {
  console.log('Creating categories...')

  for (const category of wpCategories) {
    try {
      // Check if category exists
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category.slug))
        .limit(1)

      if (existing.length === 0) {
        await db.insert(categories).values(category)
        console.log(`Created category: ${category.name}`)
      } else {
        console.log(`Category already exists: ${category.name}`)
      }
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error)
    }
  }
}

async function categorizeRecipes() {
  console.log('Categorizing recipes based on WordPress URLs...')

  // Get all recipes with WordPress URLs
  const allRecipes = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      wpUrl: recipes.wpUrl
    })
    .from(recipes)

  console.log(`Found ${allRecipes.length} recipes to process`)

  let categorized = 0
  let skipped = 0

  for (const recipe of allRecipes) {
    if (!recipe.wpUrl) {
      skipped++
      continue
    }

    // Extract category slug from WordPress URL
    // Expected pattern: https://www.danie.de/meine-kueche/CATEGORY_SLUG/recipe-name/
    const urlParts = recipe.wpUrl.split('/')
    const meineKuecheIndex = urlParts.findIndex(part => part === 'meine-kueche')

    if (meineKuecheIndex !== -1 && urlParts[meineKuecheIndex + 1]) {
      const categorySlug = urlParts[meineKuecheIndex + 1]

      // Find matching category
      const matchingWpCategory = wpCategories.find(cat => cat.slug === categorySlug)

      if (matchingWpCategory) {
        try {
          // Get category from database
          const categoryInDb = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, matchingWpCategory.slug))
            .limit(1)

          if (categoryInDb.length > 0) {
            // Delete existing relationships for this recipe
            await db.delete(recipeCategories).where(eq(recipeCategories.recipeId, recipe.id))

            // Create new relationship based on WordPress URL
            await db.insert(recipeCategories).values({
              recipeId: recipe.id,
              categoryId: categoryInDb[0].id
            })

            console.log(`Recategorized "${recipe.title}" as "${matchingWpCategory.name}"`)
            categorized++
          }
        } catch (error) {
          console.error(`Error categorizing recipe ${recipe.title}:`, error)
        }
      } else {
        console.log(`Unknown category slug: ${categorySlug} for recipe: ${recipe.title}`)
      }
    } else {
      skipped++
    }
  }

  console.log(`\nCategorization complete!`)
  console.log(`- Categorized: ${categorized} recipes`)
  console.log(`- Skipped: ${skipped} recipes`)
}

async function main() {
  try {
    await createCategories()
    await categorizeRecipes()

    // Show summary
    const categoryStats = await db
      .select({
        categoryName: categories.name,
        categorySlug: categories.slug,
        recipeCount: db.$count(recipeCategories, eq(recipeCategories.categoryId, categories.id))
      })
      .from(categories)
      .leftJoin(recipeCategories, eq(categories.id, recipeCategories.categoryId))
      .groupBy(categories.id, categories.name, categories.slug)

    console.log('\nCategory Statistics:')
    for (const stat of categoryStats) {
      console.log(`${stat.categoryName} (${stat.categorySlug}): ${stat.recipeCount || 0} recipes`)
    }

  } catch (error) {
    console.error('Error in main process:', error)
  }
}

main().catch(console.error)
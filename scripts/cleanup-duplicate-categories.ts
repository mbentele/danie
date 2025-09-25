import { db } from '@/lib/db'
import { categories, recipeCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function cleanupDuplicateCategories() {
  console.log('Cleaning up duplicate categories...')

  try {
    // Get both categories
    const besondereAnlaesse = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'besondereanlaesse'))
      .limit(1)

    const festlicheRezepte = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'rezepte-fuer-besondere-anlaesse'))
      .limit(1)

    if (besondereAnlaesse.length > 0 && festlicheRezepte.length > 0) {
      console.log('Found duplicate categories:')
      console.log('- Besondere Anlässe:', besondereAnlaesse[0].id)
      console.log('- Festliche Rezepte:', festlicheRezepte[0].id)

      // Move all recipes from "Festliche Rezepte" to "Besondere Anlässe"
      await db
        .update(recipeCategories)
        .set({ categoryId: besondereAnlaesse[0].id })
        .where(eq(recipeCategories.categoryId, festlicheRezepte[0].id))

      console.log('Moved recipes to Besondere Anlässe')

      // Delete the "Festliche Rezepte" category
      await db
        .delete(categories)
        .where(eq(categories.id, festlicheRezepte[0].id))

      console.log('Deleted duplicate "Festliche Rezepte" category')

      // Update the remaining category name
      await db
        .update(categories)
        .set({
          name: 'Besondere Anlässe',
          slug: 'besondere-anlaesse',
          description: 'Festliche Rezepte für besondere Momente'
        })
        .where(eq(categories.id, besondereAnlaesse[0].id))

      console.log('Updated category name and slug')
    }

    // Show final stats
    const stats = await db
      .select({
        categoryName: categories.name,
        categorySlug: categories.slug,
        recipeCount: db.$count(recipeCategories, eq(recipeCategories.categoryId, categories.id))
      })
      .from(categories)
      .leftJoin(recipeCategories, eq(categories.id, recipeCategories.categoryId))
      .groupBy(categories.id, categories.name, categories.slug)

    console.log('\nFinal category stats:')
    for (const stat of stats) {
      console.log(`${stat.categoryName} (${stat.categorySlug}): ${stat.recipeCount || 0} recipes`)
    }

  } catch (error) {
    console.error('Error cleaning up categories:', error)
  }
}

cleanupDuplicateCategories().catch(console.error)
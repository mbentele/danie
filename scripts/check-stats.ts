import { db } from '@/lib/db'
import { categories, recipeCategories } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

async function getCategoryStats() {
  const stats = await db
    .select({
      categoryName: categories.name,
      categorySlug: categories.slug,
      recipeCount: count(recipeCategories.recipeId)
    })
    .from(categories)
    .leftJoin(recipeCategories, eq(categories.id, recipeCategories.categoryId))
    .groupBy(categories.id, categories.name, categories.slug)
    .orderBy(count(recipeCategories.recipeId))

  console.log('Category Statistics:')
  let total = 0
  for (const stat of stats.reverse()) {
    console.log(`${stat.categoryName} (${stat.categorySlug}): ${stat.recipeCount || 0} recipes`)
    total += stat.recipeCount || 0
  }
  console.log(`\nTotal: ${total} recipes`)
}

getCategoryStats().catch(console.error)
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function fixCategoryName() {
  console.log('Fixing category name...')

  try {
    // Update the category name from "Brot & Gebäck" to "Ohne Brot nix los"
    const result = await db
      .update(categories)
      .set({
        name: 'Ohne Brot nix los',
        description: 'Brot, Brötchen, Foccacia und alles rund ums Backen'
      })
      .where(eq(categories.slug, 'ohne-brot-nix-los'))

    console.log('Category name updated successfully!')

    // Show all categories to verify
    const allCategories = await db.select().from(categories)
    console.log('\nAll categories:')
    for (const cat of allCategories) {
      console.log(`- ${cat.name} (${cat.slug})`)
    }

  } catch (error) {
    console.error('Error updating category:', error)
  }
}

fixCategoryName().catch(console.error)
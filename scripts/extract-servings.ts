import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function extractServingsFromText(text: string): number | null {
  if (!text) return null

  // Common German patterns for servings
  const patterns = [
    /(?:für|ergibt|reicht für|portionen?:?\s*)(\d+)(?:\s*(?:personen?|portionen?|stücke?))?/gi,
    /(\d+)\s*(?:personen?|portionen?|stücke?)/gi,
    /(\d+)er?\s*form/gi, // "20er Form" = 20 Stücke
    /(\d+)\s*(?:–|-)\s*(\d+)\s*(?:personen?|portionen?)/gi, // "4-6 Personen"
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const numbers = match[0].match(/\d+/g)
      if (numbers) {
        const num = parseInt(numbers[0])
        if (num > 0 && num <= 50) { // Reasonable range
          return num
        }
      }
    }
  }

  return null
}

async function extractServingsFromRecipes() {
  console.log('Extracting servings from recipe content...')

  try {
    const allRecipes = await db.select().from(recipes)
    console.log(`Found ${allRecipes.length} recipes`)

    let updated = 0

    for (const recipe of allRecipes) {
      // Try to extract from title first (most common location)
      let servings = extractServingsFromText(recipe.title)

      // If not found in title, try description
      if (!servings && recipe.description) {
        servings = extractServingsFromText(recipe.description)
      }

      // If not found in description, try instructions
      if (!servings && recipe.instructions) {
        let instructionsText = ''
        try {
          const instructions = Array.isArray(recipe.instructions)
            ? recipe.instructions
            : JSON.parse(recipe.instructions as string)
          instructionsText = instructions.join(' ')
          servings = extractServingsFromText(instructionsText)
        } catch (e) {
          // Skip if can't parse
        }
      }

      // If not found anywhere, try ingredients
      if (!servings && recipe.ingredients) {
        let ingredientsText = ''
        try {
          const ingredients = Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : JSON.parse(recipe.ingredients as string)
          ingredientsText = ingredients.join(' ')
          servings = extractServingsFromText(ingredientsText)
        } catch (e) {
          // Skip if can't parse
        }
      }

      // Update if we found a serving size different from the default 4
      if (servings && servings !== 4) {
        await db
          .update(recipes)
          .set({ servings })
          .where(eq(recipes.id, recipe.id))

        console.log(`Updated "${recipe.title}" to ${servings} servings`)
        updated++
      }
    }

    console.log(`Updated ${updated} recipes with extracted serving sizes`)

  } catch (error) {
    console.error('Error extracting servings:', error)
  }
}

extractServingsFromRecipes().catch(console.error)
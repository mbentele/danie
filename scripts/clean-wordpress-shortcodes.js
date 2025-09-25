#!/usr/bin/env node

/**
 * Clean WordPress shortcodes from recipe descriptions and content
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

function cleanWordPressShortcodes(text) {
  if (!text || typeof text !== 'string') return text

  let cleaned = text

  // Remove et_pb shortcodes (Divi builder)
  cleaned = cleaned.replace(/\[et_pb_[^\]]*\]/g, '')
  cleaned = cleaned.replace(/\[\/et_pb_[^\]]*\]/g, '')

  // Remove other common shortcodes
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '')

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '')

  // Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.replace(/\n\s*\n/g, '\n')
  cleaned = cleaned.trim()

  // Remove empty parentheses and brackets that might be left
  cleaned = cleaned.replace(/\(\s*\)/g, '')
  cleaned = cleaned.replace(/\[\s*\]/g, '')

  return cleaned
}

async function cleanAllRecipeDescriptions() {
  console.log('🧹 Cleaning WordPress shortcodes from all recipe descriptions...')

  try {
    // Get all recipes with descriptions that might contain shortcodes
    const recipes = await sql`
      SELECT id, title, description
      FROM recipes
      WHERE description IS NOT NULL
        AND description != ''
        AND (description LIKE '%[et_pb_%' OR description LIKE '%[/%' OR description LIKE '%<%')
      ORDER BY title
    `

    console.log(`📊 Found ${recipes.length} recipes with potentially dirty descriptions`)

    let cleanedCount = 0

    for (const recipe of recipes) {
      const originalDescription = recipe.description
      const cleanedDescription = cleanWordPressShortcodes(originalDescription)

      // Only update if there's a change
      if (cleanedDescription !== originalDescription && cleanedDescription.length > 0) {
        await sql`
          UPDATE recipes
          SET description = ${cleanedDescription}
          WHERE id = ${recipe.id}
        `

        cleanedCount++
        console.log(`✅ Cleaned: ${recipe.title}`)
        console.log(`   Before: ${originalDescription.substring(0, 100)}...`)
        console.log(`   After:  ${cleanedDescription.substring(0, 100)}...`)
        console.log('---')
      } else if (cleanedDescription.length === 0) {
        // If cleaning results in empty string, set to NULL
        await sql`
          UPDATE recipes
          SET description = NULL
          WHERE id = ${recipe.id}
        `
        console.log(`🗑️  Removed empty description: ${recipe.title}`)
      }

      // Small delay to not overwhelm database
      if (cleanedCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`\n📊 Results:`)
    console.log(`✅ Cleaned descriptions: ${cleanedCount} recipes`)
    console.log(`📈 Total processed: ${recipes.length} recipes`)

    return cleanedCount

  } catch (error) {
    console.error('❌ Error cleaning descriptions:', error)
    return 0
  }
}

async function main() {
  console.log('🧹 WordPress Shortcode Cleanup')
  console.log('==============================')

  try {
    const cleanedCount = await cleanAllRecipeDescriptions()

    console.log(`\n🎉 Cleanup completed!`)
    console.log(`📊 ${cleanedCount} recipe descriptions cleaned`)

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
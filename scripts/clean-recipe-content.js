#!/usr/bin/env node

/**
 * Clean WordPress shortcodes from recipe content
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

function cleanWordPressContent(content) {
  if (!content || typeof content !== 'string') return content

  let cleaned = content

  // Remove WordPress shortcodes
  cleaned = cleaned.replace(/\[et_pb_[^\]]*\]/g, '')
  cleaned = cleaned.replace(/\[\/et_pb_[^\]]*\]/g, '')

  // Remove other common shortcodes
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '')

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '')

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.trim()

  // Remove empty lines
  cleaned = cleaned.replace(/\n\s*\n/g, '\n')

  return cleaned
}

async function cleanAllRecipeContent() {
  console.log('🧹 Cleaning WordPress shortcodes from recipe content...')

  try {
    // Get all recipes with content that might need cleaning
    const recipes = await sql`
      SELECT id, title, description, content
      FROM recipes
      WHERE content LIKE '%[et_pb_%' OR content LIKE '%[/%' OR description LIKE '%[%'
    `

    console.log(`📊 Found ${recipes.length} recipes with shortcodes to clean`)

    let cleanedCount = 0

    for (const recipe of recipes) {
      let needsUpdate = false
      const updates = {}

      // Clean description
      if (recipe.description && recipe.description.includes('[')) {
        const cleanedDescription = cleanWordPressContent(recipe.description)
        if (cleanedDescription !== recipe.description) {
          updates.description = cleanedDescription
          needsUpdate = true
        }
      }

      // Clean content
      if (recipe.content && recipe.content.includes('[')) {
        const cleanedContent = cleanWordPressContent(recipe.content)
        if (cleanedContent !== recipe.content) {
          updates.content = cleanedContent
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        const updateQuery = []
        const params = [recipe.id]

        if (updates.description !== undefined) {
          updateQuery.push('description = $2')
          params.push(updates.description)
        }

        if (updates.content !== undefined) {
          const contentIndex = params.length + 1
          updateQuery.push(`content = $${contentIndex}`)
          params.push(updates.content)
        }

        await sql`
          UPDATE recipes
          SET ${sql(updateQuery.join(', '))}
          WHERE id = ${recipe.id}
        `

        cleanedCount++
        console.log(`✅ Cleaned: ${recipe.title}`)

        // Show what was cleaned
        if (updates.description) {
          console.log(`   Description: ${recipe.description.substring(0, 100)}... → ${updates.description.substring(0, 100)}...`)
        }
        if (updates.content) {
          console.log(`   Content: ${recipe.content.substring(0, 100)}... → ${updates.content.substring(0, 100)}...`)
        }
      }
    }

    console.log(`\n📊 Results:`)
    console.log(`✅ Cleaned content: ${cleanedCount} recipes`)
    console.log(`📈 Total processed: ${recipes.length} recipes`)

    return cleanedCount

  } catch (error) {
    console.error('❌ Error cleaning content:', error)
    return 0
  }
}

async function main() {
  console.log('🧹 WordPress Content Cleanup')
  console.log('============================')

  try {
    const cleanedCount = await cleanAllRecipeContent()

    console.log(`\n🎉 Content cleanup completed!`)
    console.log(`📊 ${cleanedCount} recipes cleaned of WordPress shortcodes`)

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
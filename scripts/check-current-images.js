#!/usr/bin/env node

/**
 * Check current image URLs in database
 */

require('dotenv').config({ path: '.env.local' })

const { drizzle } = require('drizzle-orm/neon-http')
const { neon } = require('@neondatabase/serverless')
const { recipes } = require('../lib/db/schema')

// Initialize database connection
const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function checkCurrentImages() {
  try {
    console.log('🔍 Checking current image URLs in database...')

    const recipesWithImages = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        image: recipes.image,
        gallery: recipes.gallery
      })
      .from(recipes)
      .limit(10)

    console.log(`\\n📊 Sample of ${recipesWithImages.length} recipes:`)
    console.log('=====================================')

    recipesWithImages.forEach(recipe => {
      console.log(`\\n📖 ${recipe.title}:`)
      console.log(`   Main image: ${recipe.image || 'None'}`)

      if (recipe.gallery && Array.isArray(recipe.gallery)) {
        console.log(`   Gallery (${recipe.gallery.length} images):`)
        recipe.gallery.slice(0, 3).forEach((img, index) => {
          console.log(`     ${index + 1}. ${img}`)
        })
        if (recipe.gallery.length > 3) {
          console.log(`     ... and ${recipe.gallery.length - 3} more`)
        }
      }
    })

    // Check URL patterns
    const allRecipes = await db.select().from(recipes)

    const urlPatterns = {
      local: 0,
      placeholder: 0,
      wordpress: 0,
      external: 0,
      empty: 0
    }

    allRecipes.forEach(recipe => {
      if (!recipe.image) {
        urlPatterns.empty++
      } else if (recipe.image.includes('/images/')) {
        urlPatterns.local++
      } else if (recipe.image.includes('placeholder')) {
        urlPatterns.placeholder++
      } else if (recipe.image.includes('wp-content') || recipe.image.includes('danie.de')) {
        urlPatterns.wordpress++
      } else {
        urlPatterns.external++
      }
    })

    console.log(`\\n📊 URL Pattern Analysis (${allRecipes.length} recipes):`)
    console.log('========================================')
    console.log(`   Local (/images/): ${urlPatterns.local}`)
    console.log(`   Placeholder: ${urlPatterns.placeholder}`)
    console.log(`   WordPress/SiteGround: ${urlPatterns.wordpress}`)
    console.log(`   External: ${urlPatterns.external}`)
    console.log(`   Empty: ${urlPatterns.empty}`)

    return urlPatterns

  } catch (error) {
    console.error('❌ Error checking images:', error)
    throw error
  }
}

async function main() {
  console.log('📊 Database Image URL Analyzer')
  console.log('================================')

  await checkCurrentImages()
}

if (require.main === module) {
  main()
}

module.exports = { checkCurrentImages }
#!/usr/bin/env node

/**
 * Simple database image check
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function checkImages() {
  console.log('🔍 Checking current image URLs in database...')

  try {
    // Get sample recipes with images
    const recipes = await sql`
      SELECT id, title, featured_image, images
      FROM recipes
      WHERE featured_image IS NOT NULL OR images IS NOT NULL
      LIMIT 10
    `

    console.log(`\\n📊 Found ${recipes.length} recipes with images:`)
    console.log('==========================================')

    recipes.forEach((recipe, index) => {
      console.log(`\\n${index + 1}. ${recipe.title}`)
      console.log(`   Featured: ${recipe.featured_image || 'None'}`)

      if (recipe.images) {
        try {
          const images = JSON.parse(recipe.images)
          if (Array.isArray(images) && images.length > 0) {
            console.log(`   Gallery: ${images.length} images`)
            images.slice(0, 2).forEach((img, i) => {
              console.log(`     ${i + 1}. ${img}`)
            })
            if (images.length > 2) {
              console.log(`     ... and ${images.length - 2} more`)
            }
          }
        } catch (e) {
          console.log(`   Gallery: Invalid JSON`)
        }
      }
    })

    // Count URL patterns
    const allRecipes = await sql`
      SELECT featured_image, images
      FROM recipes
      WHERE featured_image IS NOT NULL OR images IS NOT NULL
    `

    const patterns = {
      local: 0,
      placeholder: 0,
      wordpress: 0,
      external: 0,
      empty: 0
    }

    allRecipes.forEach(recipe => {
      // Check featured image
      if (recipe.featured_image) {
        const img = recipe.featured_image
        if (img.includes('/images/')) patterns.local++
        else if (img.includes('placeholder')) patterns.placeholder++
        else if (img.includes('wp-content') || img.includes('danie.de')) patterns.wordpress++
        else patterns.external++
      }

      // Check gallery images
      if (recipe.images) {
        try {
          const images = JSON.parse(recipe.images)
          if (Array.isArray(images)) {
            images.forEach(img => {
              if (img.includes('/images/')) patterns.local++
              else if (img.includes('placeholder')) patterns.placeholder++
              else if (img.includes('wp-content') || img.includes('danie.de')) patterns.wordpress++
              else patterns.external++
            })
          }
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    })

    console.log(`\\n📊 URL Patterns (${allRecipes.length} recipes with images):`)
    console.log('================================================')
    console.log(`   Local (/images/): ${patterns.local}`)
    console.log(`   WordPress/SiteGround: ${patterns.wordpress}`)
    console.log(`   Placeholder: ${patterns.placeholder}`)
    console.log(`   External: ${patterns.external}`)

    return patterns

  } catch (error) {
    console.error('❌ Database error:', error)
  }
}

async function main() {
  console.log('📊 Database Image URL Analysis')
  console.log('================================')

  await checkImages()
}

if (require.main === module) {
  main()
}
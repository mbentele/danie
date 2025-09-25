#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function checkRawImages() {
  console.log('🔍 Checking raw image data...')

  try {
    // Get raw images data
    const recipes = await sql`
      SELECT id, title, featured_image, images
      FROM recipes
      WHERE images IS NOT NULL OR featured_image IS NOT NULL
      LIMIT 5
    `

    console.log(`\\n📊 Raw image data (first 5 recipes):`)
    console.log('=====================================')

    recipes.forEach((recipe, index) => {
      console.log(`\\n${index + 1}. ${recipe.title}`)
      console.log(`   featured_image: ${recipe.featured_image}`)
      console.log(`   images (raw): ${recipe.images}`)
      console.log(`   images (length): ${recipe.images ? recipe.images.length : 0} characters`)

      if (recipe.images) {
        console.log(`   images (first 200 chars): ${recipe.images.substring(0, 200)}${recipe.images.length > 200 ? '...' : ''}`)
      }
    })

    // Check what data type the images field actually contains
    const sampleWithImages = await sql`
      SELECT images
      FROM recipes
      WHERE images IS NOT NULL AND LENGTH(images) > 0
      LIMIT 1
    `

    if (sampleWithImages.length > 0) {
      const imageData = sampleWithImages[0].images
      console.log(`\\n🔍 Sample images field analysis:`)
      console.log(`   Type: ${typeof imageData}`)
      console.log(`   Length: ${imageData ? imageData.length : 0}`)
      console.log(`   First char: ${imageData ? imageData.charAt(0) : 'none'}`)
      console.log(`   Last char: ${imageData ? imageData.charAt(imageData.length - 1) : 'none'}`)

      // Try different parsing approaches
      try {
        const parsed = JSON.parse(imageData)
        console.log(`   ✅ Valid JSON: ${Array.isArray(parsed) ? 'array' : typeof parsed}`)
      } catch (e) {
        console.log(`   ❌ Invalid JSON: ${e.message}`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkRawImages()
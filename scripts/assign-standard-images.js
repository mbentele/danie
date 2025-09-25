#!/usr/bin/env node

/**
 * Assign standard images to recipes based on WordPress pattern
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)
const SITEGROUND_BASE = 'https://www.danie.de/wp-content/uploads'

async function assignStandardImages() {
  console.log('📸 Assigning standard images to recipes...')

  try {
    // Get recipes without images
    const recipes = await sql`
      SELECT id, title, slug, wp_url, created_at
      FROM recipes
      WHERE (featured_image IS NULL OR featured_image = '')
      AND published = true
      ORDER BY created_at DESC
      LIMIT 100
    `

    console.log(`📊 Found ${recipes.length} recipes without images`)

    let updatedCount = 0

    for (const recipe of recipes) {
      // Generate standard image URL based on common WordPress patterns
      const imageUrls = generateStandardImageUrls(recipe)

      if (imageUrls.length > 0) {
        // Use first image as featured, rest as gallery (max 3 total)
        const featuredImage = imageUrls[0]
        const galleryImages = imageUrls.slice(1, 3) // Max 2 additional images

        await sql`
          UPDATE recipes
          SET
            featured_image = ${featuredImage},
            images = ${JSON.stringify(galleryImages)}
          WHERE id = ${recipe.id}
        `

        updatedCount++
        console.log(`✅ ${recipe.title}: ${imageUrls.length} images assigned`)
        console.log(`   Featured: ${featuredImage}`)
        if (galleryImages.length > 0) {
          console.log(`   Gallery: ${galleryImages.length} images`)
        }
      }
    }

    console.log(`\\n📊 Assigned images to ${updatedCount} recipes`)
    return updatedCount

  } catch (error) {
    console.error('❌ Error assigning images:', error)
    return 0
  }
}

function generateStandardImageUrls(recipe) {
  const images = []

  // Get year and month from creation date
  const createdDate = new Date(recipe.created_at)
  const year = createdDate.getFullYear()
  const month = String(createdDate.getMonth() + 1).padStart(2, '0')

  // Clean recipe title for filename
  const cleanTitle = recipe.title.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Use slug if available, otherwise cleaned title
  const baseFilename = recipe.slug || cleanTitle

  // Standard WordPress image patterns
  const patterns = [
    `${baseFilename}.jpg`,
    `${baseFilename}-scaled.jpeg`,
    `IMG_${baseFilename}.jpg`,
    `recipe-${baseFilename}.jpg`,
    `${baseFilename}-1.jpg`,
    `${baseFilename}-hero.jpg`
  ]

  // Generate URLs for the recipe's creation date
  patterns.forEach(pattern => {
    images.push(`${SITEGROUND_BASE}/${year}/${month}/${pattern}`)
  })

  // Also try current year (2025/05 where we know images exist)
  if (year !== 2025 || month !== '05') {
    patterns.slice(0, 3).forEach(pattern => {
      images.push(`${SITEGROUND_BASE}/2025/05/${pattern}`)
    })
  }

  // Remove duplicates and return max 3 images
  return [...new Set(images)].slice(0, 3)
}

async function testSampleUrls() {
  console.log('🧪 Testing sample image URLs...')

  // Get one recipe for testing
  const sample = await sql`
    SELECT id, title, slug, created_at
    FROM recipes
    WHERE published = true
    LIMIT 1
  `

  if (sample.length > 0) {
    const recipe = sample[0]
    const urls = generateStandardImageUrls(recipe)

    console.log(`\\n📝 Sample recipe: ${recipe.title}`)
    console.log('Generated URLs:')
    urls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`)
    })
  }
}

async function main() {
  console.log('🖼️  Standard Image Assignment')
  console.log('==============================')

  const operation = process.argv[2] || 'assign'

  if (operation === 'test') {
    await testSampleUrls()
  } else {
    const updatedCount = await assignStandardImages()

    if (updatedCount > 0) {
      console.log('\\n✅ Standard images assigned!')
      console.log(`📊 ${updatedCount} recipes now have image URLs`)
      console.log('🌐 All images point to SiteGround uploads')
    } else {
      console.log('\\n📊 No recipes needed image assignment')
    }
  }
}

if (require.main === module) {
  main()
}

module.exports = { assignStandardImages, generateStandardImageUrls }
#!/usr/bin/env node

/**
 * Find recipe images by scraping WordPress URLs
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)
const SITEGROUND_BASE = 'https://www.danie.de/wp-content/uploads'

async function findRecipeImages() {
  console.log('🔍 Finding recipe images from WordPress URLs...')

  try {
    // Get recipes with WordPress URLs
    const recipes = await sql`
      SELECT id, title, wp_url, wp_post_id
      FROM recipes
      WHERE wp_url IS NOT NULL
      AND (featured_image IS NULL OR images IS NULL OR images = '[]' OR images = '')
      ORDER BY created_at DESC
      LIMIT 50
    `

    console.log(`📊 Found ${recipes.length} recipes to process`)

    let updatedCount = 0

    for (const recipe of recipes) {
      console.log(`\\n🔄 Processing: ${recipe.title}`)

      // Generate likely image URLs based on recipe slug/title
      const slug = recipe.wp_url.split('/').filter(part => part && part !== 'meine-kueche' && part !== 'alltagskueche').pop()

      if (slug) {
        // Generate possible image URLs (common WordPress patterns)
        const possibleImages = generatePossibleImageUrls(slug, recipe.title)

        console.log(`   Checking ${possibleImages.length} possible images...`)

        // Test which images actually exist
        const existingImages = []

        for (const imageUrl of possibleImages) {
          try {
            const response = await fetch(imageUrl, { method: 'HEAD' })
            if (response.ok) {
              existingImages.push(imageUrl)
              console.log(`   ✅ Found: ${imageUrl}`)

              // Limit to 3 images per recipe
              if (existingImages.length >= 3) break
            }
          } catch (error) {
            // Image doesn't exist, continue
          }
        }

        if (existingImages.length > 0) {
          // Update recipe with found images
          const featuredImage = existingImages[0]
          const galleryImages = existingImages.slice(1)

          await sql`
            UPDATE recipes
            SET
              featured_image = ${featuredImage},
              images = ${JSON.stringify(galleryImages)}
            WHERE id = ${recipe.id}
          `

          updatedCount++
          console.log(`   🎯 Updated with ${existingImages.length} images`)
        } else {
          console.log(`   ⚠️  No images found`)
        }
      }

      // Add small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`\\n📊 Updated ${updatedCount} recipes with images`)
    return updatedCount

  } catch (error) {
    console.error('❌ Error finding images:', error)
    return 0
  }
}

function generatePossibleImageUrls(slug, title) {
  const images = []

  // Common years for WordPress uploads
  const years = ['2023', '2024', '2025', '2022', '2021', '2020']
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  // Clean slug and title for image names
  const cleanSlug = slug.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const cleanTitle = title.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Common WordPress image patterns
  const baseNames = [
    cleanSlug,
    cleanTitle,
    cleanSlug.replace(/_/g, '-'),
    cleanTitle.substring(0, 20), // Truncated version
    `img_${cleanSlug}`,
    `recipe-${cleanSlug}`,
    cleanSlug.split('-')[0] // First word
  ]

  // Common WordPress image suffixes
  const suffixes = ['', '-scaled', '-1024x768', '-medium', '-large', '-1', '-2', '-3']
  const extensions = ['jpg', 'jpeg', 'png', 'webp']

  // Generate URLs for recent years first (more likely)
  for (const year of years) {
    for (const month of months) {
      for (const baseName of baseNames) {
        for (const suffix of suffixes) {
          for (const ext of extensions) {
            if (baseName && baseName.length > 2) {
              images.push(`${SITEGROUND_BASE}/${year}/${month}/${baseName}${suffix}.${ext}`)
            }
          }
        }
      }
    }
  }

  // Remove duplicates and return first 30 possibilities
  return [...new Set(images)].slice(0, 30)
}

async function main() {
  console.log('🖼️  Recipe Image Finder')
  console.log('========================')

  const updatedCount = await findRecipeImages()

  if (updatedCount > 0) {
    console.log('\\n✅ Images found and updated!')
    console.log(`📊 ${updatedCount} recipes now have images`)
  } else {
    console.log('\\n📊 No new images found')
  }
}

if (require.main === module) {
  main()
}

module.exports = { findRecipeImages, generatePossibleImageUrls }
#!/usr/bin/env node

/**
 * Scrape real image URLs from WordPress posts
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function scrapeRealImages() {
  console.log('🔍 Scraping real image URLs from WordPress posts...')

  try {
    // Get recipes with WordPress URLs
    const recipes = await sql`
      SELECT id, title, wp_url
      FROM recipes
      WHERE wp_url IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 10
    `

    console.log(`📊 Processing ${recipes.length} recipes`)

    let updatedCount = 0

    for (const recipe of recipes) {
      console.log(`\\n🔄 Scraping: ${recipe.title}`)
      console.log(`   URL: ${recipe.wp_url}`)

      try {
        // Fetch the WordPress post page
        const response = await fetch(recipe.wp_url)

        if (!response.ok) {
          console.log(`   ❌ Failed to fetch: ${response.status}`)
          continue
        }

        const html = await response.text()

        // Extract image URLs from the HTML
        const imageUrls = extractImagesFromHtml(html)

        if (imageUrls.length > 0) {
          // Limit to 3 images per recipe
          const limitedImages = imageUrls.slice(0, 3)
          const featuredImage = limitedImages[0]
          const galleryImages = limitedImages.slice(1)

          // Update database
          await sql`
            UPDATE recipes
            SET
              featured_image = ${featuredImage},
              images = ${JSON.stringify(galleryImages)}
            WHERE id = ${recipe.id}
          `

          updatedCount++
          console.log(`   ✅ Found ${limitedImages.length} images:`)
          limitedImages.forEach((img, i) => {
            console.log(`     ${i + 1}. ${img}`)
          })
        } else {
          console.log(`   ⚠️  No images found in HTML`)
        }

      } catch (error) {
        console.log(`   ❌ Error scraping: ${error.message}`)
      }

      // Be nice to the server
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\\n📊 Successfully scraped ${updatedCount} recipes`)
    return updatedCount

  } catch (error) {
    console.error('❌ Error scraping images:', error)
    return 0
  }
}

function extractImagesFromHtml(html) {
  const images = []

  // Common WordPress image patterns
  const patterns = [
    // WordPress attachment images
    /src=["'](https?:\\/\\/[^"']*wp-content\\/uploads\\/[^"']*\\.(jpg|jpeg|png|gif|webp))["']/gi,
    // CDN images
    /src=["'](https?:\\/\\/[^"']*danie\\.de[^"']*\\.(jpg|jpeg|png|gif|webp))["']/gi,
    // WordPress media URLs
    /https?:\\/\\/[^\\s"'<>]*wp-content\\/uploads\\/[^\\s"'<>]*\\.(jpg|jpeg|png|gif|webp)/gi
  ]

  patterns.forEach(pattern => {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      const imageUrl = match[1] || match[0]

      // Skip thumbnails, icons, and logos
      if (!imageUrl.includes('-150x150') &&
          !imageUrl.includes('-300x300') &&
          !imageUrl.includes('logo') &&
          !imageUrl.includes('icon') &&
          !images.includes(imageUrl)) {
        images.push(imageUrl)
      }
    }
  })

  return images
}

async function testSingleRecipe() {
  console.log('🧪 Testing single recipe scraping...')

  const recipe = await sql`
    SELECT id, title, wp_url
    FROM recipes
    WHERE wp_url IS NOT NULL
    LIMIT 1
  `

  if (recipe.length > 0) {
    const testRecipe = recipe[0]
    console.log(`\\nTesting: ${testRecipe.title}`)
    console.log(`URL: ${testRecipe.wp_url}`)

    try {
      const response = await fetch(testRecipe.wp_url)
      const html = await response.text()
      const images = extractImagesFromHtml(html)

      console.log(`\\nFound ${images.length} images:`)
      images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img}`)
      })

      // Test if first image is accessible
      if (images.length > 0) {
        const testResponse = await fetch(images[0], { method: 'HEAD' })
        console.log(`\\nFirst image test: ${testResponse.ok ? '✅ Accessible' : '❌ Not accessible'}`)
      }

    } catch (error) {
      console.error('Test error:', error.message)
    }
  }
}

async function main() {
  console.log('🖼️  Real WordPress Image Scraper')
  console.log('=================================')

  const operation = process.argv[2] || 'scrape'

  if (operation === 'test') {
    await testSingleRecipe()
  } else {
    const updatedCount = await scrapeRealImages()

    if (updatedCount > 0) {
      console.log('\\n🎉 Real images successfully scraped!')
      console.log(`📊 ${updatedCount} recipes updated with actual WordPress images`)
    } else {
      console.log('\\n📊 No images could be scraped')
    }
  }
}

if (require.main === module) {
  main()
}

module.exports = { scrapeRealImages, extractImagesFromHtml }
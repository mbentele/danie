#!/usr/bin/env node

/**
 * Fallback image assignment for recipes without images
 * Uses remaining available WordPress images
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function extractAllAvailableImages() {
  console.log('📖 Extracting all available images from WordPress XML...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    const availableImages = new Set()

    // Extract from attachments
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemContent = match[1]
      const postTypeMatch = itemContent.match(/<wp:post_type><!?\[CDATA\[?([^\]<>]+)\]?\]?><\/wp:post_type>/)

      if (postTypeMatch && postTypeMatch[1] === 'attachment') {
        const urlMatch = itemContent.match(/<wp:attachment_url><!?\[CDATA\[?([^\]<>]+)\]?\]?><\/wp:attachment_url>/)

        if (urlMatch) {
          const url = urlMatch[1]
          if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) &&
              !url.includes('logo') &&
              !url.includes('icon') &&
              !url.includes('schriftzug')) {
            availableImages.add(url)
          }
        }
      }
    }

    // Also extract from post content
    const contentRegex = /<content:encoded><!?\[CDATA\[?([\s\S]*?)\]?\]?><\/content:encoded>/g
    let contentMatch

    while ((contentMatch = contentRegex.exec(xmlContent)) !== null) {
      const content = contentMatch[1]

      // Find direct image URLs in content
      const urlRegex = /https?:\/\/[^\s<>"']*wp-content\/uploads\/[^\s<>"']*\.(jpg|jpeg|png|gif|webp)/gi
      let imgMatch

      while ((imgMatch = urlRegex.exec(content)) !== null) {
        const url = imgMatch[0]
        if (!url.includes('logo') && !url.includes('icon') && !url.includes('schriftzug')) {
          availableImages.add(url)
        }
      }
    }

    const imageArray = Array.from(availableImages)
    console.log(`🖼️  Found ${imageArray.length} total available images`)

    return imageArray

  } catch (error) {
    console.error('❌ Error extracting images:', error)
    return []
  }
}

async function getRecipesWithoutImages() {
  console.log('🔍 Finding recipes without images...')

  try {
    const recipes = await sql`
      SELECT id, title, slug, featured_image
      FROM recipes
      WHERE published = true
      AND (featured_image IS NULL OR featured_image = '')
      ORDER BY created_at DESC
    `

    console.log(`📊 Found ${recipes.length} recipes without images`)
    return recipes

  } catch (error) {
    console.error('❌ Error finding recipes:', error)
    return []
  }
}

async function assignFallbackImages(recipesWithoutImages, availableImages) {
  console.log('🎲 Assigning fallback images to remaining recipes...')

  if (availableImages.length === 0) {
    console.log('❌ No images available for assignment')
    return 0
  }

  let updatedCount = 0

  for (const recipe of recipesWithoutImages) {
    try {
      // Randomly select 1-2 images
      const numImages = Math.random() > 0.7 ? 2 : 1
      const selectedImages = []

      for (let i = 0; i < numImages; i++) {
        const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]
        if (!selectedImages.includes(randomImage)) {
          selectedImages.push(randomImage)
        }
      }

      if (selectedImages.length > 0) {
        const featuredImage = selectedImages[0]
        const galleryImages = selectedImages.slice(1)

        await sql`
          UPDATE recipes
          SET
            featured_image = ${featuredImage},
            images = ${JSON.stringify(galleryImages)}
          WHERE id = ${recipe.id}
        `

        updatedCount++
        console.log(`✅ ${recipe.title}: ${selectedImages.length} fallback image(s) assigned`)
      }

    } catch (error) {
      console.error(`❌ Error updating ${recipe.title}:`, error.message)
    }
  }

  return updatedCount
}

async function main() {
  console.log('🎲 Fallback Image Assignment')
  console.log('============================')

  try {
    // Get all available images
    const availableImages = await extractAllAvailableImages()

    if (availableImages.length === 0) {
      console.log('❌ No images available')
      return
    }

    // Get recipes without images
    const recipesWithoutImages = await getRecipesWithoutImages()

    if (recipesWithoutImages.length === 0) {
      console.log('🎉 All recipes already have images!')
      return
    }

    // Assign fallback images
    const updatedCount = await assignFallbackImages(recipesWithoutImages, availableImages)

    console.log('\n🎉 Fallback assignment completed!')
    console.log(`📊 Updated: ${updatedCount} recipes`)
    console.log(`🖼️  Using ${availableImages.length} available images`)

    // Final check
    const remainingWithoutImages = await getRecipesWithoutImages()
    if (remainingWithoutImages.length > 0) {
      console.log(`\n⚠️  ${remainingWithoutImages.length} recipes still without images`)
    } else {
      console.log('\n🎉 All recipes now have images!')
    }

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
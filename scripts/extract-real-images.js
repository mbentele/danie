#!/usr/bin/env node

/**
 * Extract REAL image URLs from WordPress XML
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function extractRealImagesFromXML() {
  console.log('📖 Reading WordPress XML export...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    console.log(`✅ Loaded XML file (${Math.round(xmlContent.length / 1024)}KB)`)

    // Extract all WordPress posts with images
    const posts = []

    // Simple regex to find posts with content
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemContent = match[1]

      // Extract post metadata
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const postIdMatch = itemContent.match(/<wp:post_id>(\d+)<\/wp:post_id>/)
      const postTypeMatch = itemContent.match(/<wp:post_type>([^<]+)<\/wp:post_type>/)

      if (postTypeMatch && postTypeMatch[1] === 'post' && titleMatch && postIdMatch) {
        const title = titleMatch[1]
        const postId = parseInt(postIdMatch[1])

        // Extract content with images
        const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)

        if (contentMatch) {
          const content = contentMatch[1]

          // Find all image URLs in the content
          const imageUrls = []

          // Pattern 1: src="..." attributes
          const srcRegex = /src=["']([^"']*wp-content\/uploads\/[^"']*\.(jpg|jpeg|png|gif|webp))["']/gi
          let imgMatch
          while ((imgMatch = srcRegex.exec(content)) !== null) {
            imageUrls.push(imgMatch[1])
          }

          // Pattern 2: Direct URLs
          const urlRegex = /https?:\/\/[^\s<>"']*wp-content\/uploads\/[^\s<>"']*\.(jpg|jpeg|png|gif|webp)/gi
          while ((imgMatch = urlRegex.exec(content)) !== null) {
            imageUrls.push(imgMatch[0])
          }

          // Remove duplicates and limit to 3 images
          const uniqueImages = [...new Set(imageUrls)].slice(0, 3)

          if (uniqueImages.length > 0) {
            posts.push({
              title,
              postId,
              images: uniqueImages
            })
          }
        }
      }
    }

    console.log(`🖼️  Found ${posts.length} posts with images`)

    // Show some examples
    posts.slice(0, 5).forEach((post, index) => {
      console.log(`\\n${index + 1}. ${post.title} (ID: ${post.postId})`)
      post.images.forEach((img, i) => {
        console.log(`   ${i + 1}. ${img}`)
      })
    })

    return posts

  } catch (error) {
    console.error('❌ Error reading XML:', error)
    return []
  }
}

async function updateDatabaseWithRealImages(posts) {
  console.log('🔄 Updating database with real images...')

  let updatedCount = 0

  for (const post of posts) {
    try {
      // Find recipe by WordPress post ID
      const recipes = await sql`
        SELECT id, title, wp_post_id
        FROM recipes
        WHERE wp_post_id = ${post.postId}
        LIMIT 1
      `

      if (recipes.length === 0) {
        console.log(`⚠️  No recipe found for post ID ${post.postId}: ${post.title}`)
        continue
      }

      const recipe = recipes[0]

      // Update with real images
      const featuredImage = post.images[0]
      const galleryImages = post.images.slice(1)

      await sql`
        UPDATE recipes
        SET
          featured_image = ${featuredImage},
          images = ${JSON.stringify(galleryImages)}
        WHERE id = ${recipe.id}
      `

      updatedCount++
      console.log(`✅ ${recipe.title}: ${post.images.length} REAL images`)

    } catch (error) {
      console.error(`❌ Error updating ${post.title}:`, error.message)
    }
  }

  console.log(`\\n📊 Updated ${updatedCount} recipes with REAL WordPress images`)
  return updatedCount
}

async function main() {
  console.log('🖼️  REAL WordPress Image Extraction')
  console.log('===================================')

  try {
    // Extract real images from WordPress XML
    const posts = await extractRealImagesFromXML()

    if (posts.length === 0) {
      console.log('❌ No posts with images found in XML')
      return
    }

    // Update database with real images
    const updatedCount = await updateDatabaseWithRealImages(posts)

    console.log('\\n🎉 REAL image extraction completed!')
    console.log(`📊 Processed: ${posts.length} posts`)
    console.log(`📊 Updated: ${updatedCount} recipes`)
    console.log(`🌐 All images are REAL WordPress URLs!`)

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
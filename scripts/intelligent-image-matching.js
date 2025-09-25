#!/usr/bin/env node

/**
 * Intelligent WordPress image to recipe matching
 * Extracts proper post-image relationships from WordPress XML
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function extractPostImageRelationships() {
  console.log('📖 Extracting post-image relationships from WordPress XML...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    console.log(`✅ Loaded XML file (${Math.round(xmlContent.length / 1024)}KB)`)

    const postImageMap = new Map()
    const attachmentParentMap = new Map()

    // First pass: Extract all attachments and their parent relationships
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemContent = match[1]

      // Extract post type
      const postTypeMatch = itemContent.match(/<wp:post_type><!?\[CDATA\[?([^\]<>]+)\]?\]?><\/wp:post_type>/)

      if (postTypeMatch && postTypeMatch[1] === 'attachment') {
        // This is an attachment
        const postIdMatch = itemContent.match(/<wp:post_id>(\d+)<\/wp:post_id>/)
        const parentIdMatch = itemContent.match(/<wp:post_parent>(\d+)<\/wp:post_parent>/)
        const urlMatch = itemContent.match(/<wp:attachment_url><!?\[CDATA\[?([^\]<>]+)\]?\]?><\/wp:attachment_url>/)
        const titleMatch = itemContent.match(/<title><!?\[CDATA\[?([^\]<>]*?)\]?\]?><\/title>/)

        if (postIdMatch && urlMatch && titleMatch) {
          const attachmentId = parseInt(postIdMatch[1])
          const parentId = parentIdMatch ? parseInt(parentIdMatch[1]) : null
          const url = urlMatch[1]
          const title = titleMatch[1]

          // Only include actual recipe images
          if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) &&
              !url.includes('logo') &&
              !url.includes('icon') &&
              !url.includes('schriftzug')) {

            attachmentParentMap.set(attachmentId, {
              url,
              title,
              parentId
            })

            // If it has a parent, add to that post's images
            if (parentId && parentId > 0) {
              if (!postImageMap.has(parentId)) {
                postImageMap.set(parentId, [])
              }
              postImageMap.get(parentId).push({
                url,
                title,
                attachmentId
              })
            }
          }
        }
      } else if (postTypeMatch && postTypeMatch[1] === 'post') {
        // This is a post - extract embedded images from content
        const postIdMatch = itemContent.match(/<wp:post_id>(\d+)<\/wp:post_id>/)
        const titleMatch = itemContent.match(/<title><!?\[CDATA\[?([^\]<>]*?)\]?\]?><\/title>/)
        const contentMatch = itemContent.match(/<content:encoded><!?\[CDATA\[?([\s\S]*?)\]?\]?><\/content:encoded>/)

        if (postIdMatch && titleMatch && contentMatch) {
          const postId = parseInt(postIdMatch[1])
          const postTitle = titleMatch[1]
          const content = contentMatch[1]

          // Extract images from content
          const contentImages = []

          // Find WordPress attachment IDs in content
          const wpImageRegex = /wp-image-(\d+)/g
          let imgMatch
          while ((imgMatch = wpImageRegex.exec(content)) !== null) {
            const attachmentId = parseInt(imgMatch[1])
            if (attachmentParentMap.has(attachmentId)) {
              const attachment = attachmentParentMap.get(attachmentId)
              contentImages.push({
                url: attachment.url,
                title: attachment.title,
                attachmentId
              })
            }
          }

          // Also find direct image URLs in content
          const urlRegex = /https?:\/\/[^\s<>"']*wp-content\/uploads\/[^\s<>"']*\.(jpg|jpeg|png|gif|webp)/gi
          while ((imgMatch = urlRegex.exec(content)) !== null) {
            const url = imgMatch[0]
            if (!contentImages.some(img => img.url === url)) {
              contentImages.push({
                url,
                title: `Image from ${postTitle}`,
                attachmentId: null
              })
            }
          }

          if (contentImages.length > 0) {
            if (!postImageMap.has(postId)) {
              postImageMap.set(postId, [])
            }
            postImageMap.get(postId).push(...contentImages)
          }
        }
      }
    }

    console.log(`🖼️  Found ${postImageMap.size} posts with images`)
    console.log(`📎 Found ${attachmentParentMap.size} total attachments`)

    // Show examples
    let exampleCount = 0
    for (const [postId, images] of postImageMap.entries()) {
      if (exampleCount >= 5) break
      console.log(`\nPost ID ${postId}: ${images.length} images`)
      images.slice(0, 2).forEach((img, i) => {
        console.log(`   ${i + 1}. ${img.url}`)
      })
      exampleCount++
    }

    return postImageMap

  } catch (error) {
    console.error('❌ Error extracting relationships:', error)
    return new Map()
  }
}

async function matchImagesToRecipes(postImageMap) {
  console.log('🔗 Matching images to recipes using WordPress post IDs...')

  try {
    // Get all recipes with their WordPress post IDs
    const recipes = await sql`
      SELECT id, title, slug, wp_post_id, featured_image, images
      FROM recipes
      WHERE published = true
      ORDER BY created_at DESC
    `

    console.log(`📊 Processing ${recipes.length} recipes`)

    let updatedCount = 0
    let skippedCount = 0

    for (const recipe of recipes) {
      try {
        if (recipe.wp_post_id && postImageMap.has(recipe.wp_post_id)) {
          // Direct match via WordPress post ID
          const images = postImageMap.get(recipe.wp_post_id)

          // Limit to 3 images per recipe
          const limitedImages = images.slice(0, 3)
          const featuredImage = limitedImages[0]?.url
          const galleryImages = limitedImages.slice(1).map(img => img.url)

          await sql`
            UPDATE recipes
            SET
              featured_image = ${featuredImage},
              images = ${JSON.stringify(galleryImages)}
            WHERE id = ${recipe.id}
          `

          updatedCount++
          console.log(`✅ ${recipe.title}: ${limitedImages.length} matched images`)

        } else if (!recipe.featured_image) {
          // Try fuzzy matching for recipes without images
          const recipeWords = recipe.title.toLowerCase()
            .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
            .split(/[^a-z0-9]+/)
            .filter(word => word.length > 3)

          let bestMatch = null
          let bestScore = 0

          for (const [postId, images] of postImageMap.entries()) {
            for (const image of images) {
              const imageText = (image.title + ' ' + image.url).toLowerCase()
              const matchedWords = recipeWords.filter(word => imageText.includes(word))
              const score = matchedWords.length / recipeWords.length

              if (score > bestScore && score > 0.3) {
                bestScore = score
                bestMatch = images
              }
            }
          }

          if (bestMatch) {
            const featuredImage = bestMatch[0]?.url
            const galleryImages = bestMatch.slice(1, 3).map(img => img.url)

            await sql`
              UPDATE recipes
              SET
                featured_image = ${featuredImage},
                images = ${JSON.stringify(galleryImages)}
              WHERE id = ${recipe.id}
            `

            updatedCount++
            console.log(`🎯 ${recipe.title}: fuzzy matched (score: ${(bestScore * 100).toFixed(1)}%)`)
          } else {
            skippedCount++
            console.log(`⚠️  ${recipe.title}: no suitable images found`)
          }
        } else {
          console.log(`ℹ️  ${recipe.title}: already has images`)
        }

      } catch (error) {
        console.error(`❌ Error processing ${recipe.title}:`, error.message)
        skippedCount++
      }
    }

    console.log(`\n📊 Results:`)
    console.log(`✅ Updated: ${updatedCount} recipes`)
    console.log(`⚠️  Skipped: ${skippedCount} recipes`)
    console.log(`📊 Total: ${recipes.length} recipes`)

    return { updatedCount, skippedCount, totalCount: recipes.length }

  } catch (error) {
    console.error('❌ Error matching images to recipes:', error)
    return { updatedCount: 0, skippedCount: 0, totalCount: 0 }
  }
}

async function main() {
  console.log('🧠 Intelligent WordPress Image to Recipe Matching')
  console.log('=================================================')

  try {
    // Extract post-image relationships
    const postImageMap = await extractPostImageRelationships()

    if (postImageMap.size === 0) {
      console.log('❌ No image relationships found')
      return
    }

    // Match to recipes
    const results = await matchImagesToRecipes(postImageMap)

    console.log('\n🎉 Intelligent image matching completed!')
    console.log(`📊 Success rate: ${((results.updatedCount / results.totalCount) * 100).toFixed(1)}%`)

    if (results.skippedCount > 0) {
      console.log(`\n💡 ${results.skippedCount} recipes still need images`)
      console.log('Consider running the fallback random assignment for remaining recipes')
    }

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
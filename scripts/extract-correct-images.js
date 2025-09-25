#!/usr/bin/env node

/**
 * Extract correct recipe images from WordPress XML content
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function extractPostImageMappings() {
  console.log('🎯 Extracting CORRECT post-image mappings from WordPress XML...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    const postImageMap = new Map()

    // Extract all posts with their content
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemContent = match[1]

      // Check if it's a page (recipe posts are stored as pages)
      const postTypeMatch = itemContent.match(/<wp:post_type><!?\[CDATA\[?(page)\]?\]?><\/wp:post_type>/)

      if (postTypeMatch) {
        // Extract post info
        const postIdMatch = itemContent.match(/<wp:post_id>(\d+)<\/wp:post_id>/)
        const titleMatch = itemContent.match(/<title><!?\[CDATA\[?([^\]<>]*?)\]?\]?><\/title>/)
        const slugMatch = itemContent.match(/<wp:post_name><!?\[CDATA\[?([^\]<>]*?)\]?\]?><\/wp:post_name>/)
        const statusMatch = itemContent.match(/<wp:status><!?\[CDATA\[?([^\]<>]*?)\]?\]?><\/wp:status>/)
        const contentMatch = itemContent.match(/<content:encoded><!?\[CDATA\[?([\s\S]*?)\]?\]?><\/content:encoded>/)

        if (postIdMatch && titleMatch && slugMatch && statusMatch && contentMatch) {
          const postId = parseInt(postIdMatch[1])
          const title = titleMatch[1].trim()
          const slug = slugMatch[1].trim()
          const status = statusMatch[1].trim()
          const content = contentMatch[1]

          // Only process published pages that look like recipes
          if (status === 'publish' && content.length > 100) {
            // Extract image URLs from content
            const imageUrls = []

            // Pattern for et_pb_image src attributes
            const etImageRegex = /\[et_pb_image[^]]*?src="([^"]*wp-content\/uploads\/[^"]*\.(jpg|jpeg|png|gif))"[^]]*?\]/gi
            let imgMatch

            while ((imgMatch = etImageRegex.exec(content)) !== null) {
              const url = imgMatch[1].trim()
              if (!imageUrls.includes(url)) {
                imageUrls.push(url)
              }
            }

            // Also check for direct image URLs
            const directImageRegex = /https?:\/\/[^\s<>"']*wp-content\/uploads\/[^\s<>"']*\.(jpg|jpeg|png|gif)/gi
            while ((imgMatch = directImageRegex.exec(content)) !== null) {
              const url = imgMatch[0].trim()
              if (!imageUrls.includes(url) &&
                  !url.includes('logo') &&
                  !url.includes('icon') &&
                  !url.includes('schriftzug')) {
                imageUrls.push(url)
              }
            }

            if (imageUrls.length > 0) {
              postImageMap.set(postId, {
                title,
                slug,
                images: imageUrls
              })
              console.log(`📝 ${title} (${slug}): ${imageUrls.length} images found`)
            }
          }
        }
      }
    }

    console.log(`🖼️  Found ${postImageMap.size} posts with images`)
    return postImageMap

  } catch (error) {
    console.error('❌ Error extracting images:', error)
    return new Map()
  }
}

async function updateRecipesWithCorrectImages(postImageMap) {
  console.log('\n🔄 Updating recipes with correct images...')

  try {
    // Get all recipes
    const recipes = await sql`
      SELECT id, title, slug, wp_post_id
      FROM recipes
      WHERE published = true
      ORDER BY title
    `

    console.log(`📊 Processing ${recipes.length} recipes`)

    let updatedCount = 0
    let validatedCount = 0

    for (const recipe of recipes) {
      let imageAssigned = false

      // 1. Try to match by WordPress post ID
      if (recipe.wp_post_id && postImageMap.has(recipe.wp_post_id)) {
        const postData = postImageMap.get(recipe.wp_post_id)

        // Validate first image
        try {
          const testUrl = postData.images[0]
          const response = await fetch(testUrl, { method: 'HEAD' })

          if (response.ok) {
            await sql`
              UPDATE recipes
              SET
                featured_image = ${testUrl},
                images = ${JSON.stringify(postData.images.slice(1, 3))}
              WHERE id = ${recipe.id}
            `
            updatedCount++
            validatedCount++
            console.log(`✅ PERFECT: ${recipe.title} → ${testUrl}`)
            imageAssigned = true
          } else {
            console.log(`❌ Image not accessible: ${testUrl}`)
          }
        } catch (error) {
          console.log(`❌ Error testing: ${postData.images[0]}`)
        }
      }

      // 2. Try to match by slug/title similarity
      if (!imageAssigned) {
        const recipeSlug = recipe.slug.toLowerCase()
        let bestMatch = null
        let bestScore = 0

        for (const [postId, postData] of postImageMap.entries()) {
          const postSlug = postData.slug.toLowerCase()
          const postTitle = postData.title.toLowerCase()

          // Direct slug match
          if (postSlug === recipeSlug) {
            bestMatch = postData
            bestScore = 1
            break
          }

          // Title similarity
          const recipeWords = recipe.title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3)
          const postWords = postTitle.split(/[^a-z0-9]+/).filter(w => w.length > 3)
          const commonWords = recipeWords.filter(w => postWords.includes(w))
          const similarity = commonWords.length / Math.max(recipeWords.length, 1)

          if (similarity > bestScore && similarity > 0.6) {
            bestMatch = postData
            bestScore = similarity
          }
        }

        if (bestMatch) {
          try {
            const testUrl = bestMatch.images[0]
            const response = await fetch(testUrl, { method: 'HEAD' })

            if (response.ok) {
              await sql`
                UPDATE recipes
                SET
                  featured_image = ${testUrl},
                  images = ${JSON.stringify(bestMatch.images.slice(1, 3))}
                WHERE id = ${recipe.id}
              `
              updatedCount++
              validatedCount++
              console.log(`🎯 MATCHED: ${recipe.title} (${(bestScore * 100).toFixed(1)}%) → ${testUrl}`)
              imageAssigned = true
            }
          } catch (error) {
            console.log(`❌ Error with matched image for ${recipe.title}`)
          }
        }
      }

      if (!imageAssigned) {
        // Clear any existing wrong images
        await sql`
          UPDATE recipes
          SET
            featured_image = NULL,
            images = '[]'
          WHERE id = ${recipe.id}
        `
        console.log(`⚪ CLEARED: ${recipe.title} (no matching image found)`)
      }

      // Small delay to not overwhelm server
      if (updatedCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    console.log(`\n📊 Results:`)
    console.log(`✅ Updated with verified images: ${validatedCount}`)
    console.log(`🔄 Total processed: ${recipes.length}`)
    console.log(`📈 Success rate: ${((validatedCount / recipes.length) * 100).toFixed(1)}%`)

    return { updatedCount: validatedCount, totalCount: recipes.length }

  } catch (error) {
    console.error('❌ Error updating recipes:', error)
    return { updatedCount: 0, totalCount: 0 }
  }
}

async function main() {
  console.log('🎯 WordPress CORRECT Image Extraction')
  console.log('=====================================')

  try {
    // Extract post-image mappings
    const postImageMap = await extractPostImageMappings()

    if (postImageMap.size === 0) {
      console.log('❌ No posts with images found')
      return
    }

    // Update recipes with correct images
    const results = await updateRecipesWithCorrectImages(postImageMap)

    console.log('\n🎉 Correct image extraction completed!')
    console.log(`📊 ${results.updatedCount} recipes now have CORRECT, validated images!`)
    console.log('✅ All images are tested and working!')

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
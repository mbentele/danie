#!/usr/bin/env node

/**
 * Extract WordPress image URLs and update database
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

const SITEGROUND_BASE = 'https://www.danie.de/wp-content/uploads'

async function extractImagesFromXML() {
  console.log('📖 Reading WordPress XML export...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    console.log(`✅ Loaded XML file (${Math.round(xmlContent.length / 1024)}KB)`)

    // Extract image URLs from the XML
    const imageMatches = [
      // WordPress upload URLs
      ...xmlContent.matchAll(/https?:\/\/[^\s"'<>]*wp-content\/uploads\/[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi),
      // Local upload paths
      ...xmlContent.matchAll(/\/wp-content\/uploads\/[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi),
      // Year/month paths
      ...xmlContent.matchAll(/\/(\d{4})\/(\d{2})\/[^\s\/]*\.(jpg|jpeg|png|gif|webp)/gi)
    ]

    const uniqueImages = [...new Set(imageMatches.map(match => match[0]))]

    console.log(`🖼️  Found ${uniqueImages.length} unique image URLs`)

    // Group images by post (if possible)
    const posts = []
    const postMatches = xmlContent.matchAll(/<item>([\s\S]*?)<\/item>/g)

    for (const postMatch of postMatches) {
      const postContent = postMatch[1]

      // Extract post metadata
      const titleMatch = postContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const postIdMatch = postContent.match(/<wp:post_id>(\d+)<\/wp:post_id>/)
      const postTypeMatch = postContent.match(/<wp:post_type>(.*?)<\/wp:post_type>/)

      if (postTypeMatch && postTypeMatch[1] === 'post' && titleMatch && postIdMatch) {
        const title = titleMatch[1]
        const postId = parseInt(postIdMatch[1])

        // Find images in this post
        const postImages = []

        // Extract from content
        const contentMatch = postContent.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s)
        if (contentMatch) {
          const content = contentMatch[1]

          // Find image URLs in content
          const imgMatches = [
            ...content.matchAll(/src=["'](.*?wp-content\/uploads\/.*?\.(jpg|jpeg|png|gif|webp))["']/gi),
            ...content.matchAll(/https?:\/\/[^\s"']*wp-content\/uploads\/[^\s"']*\.(jpg|jpeg|png|gif|webp)/gi)
          ]

          imgMatches.forEach(match => {
            const imgUrl = match[1] || match[0]
            if (imgUrl && !postImages.includes(imgUrl)) {
              postImages.push(imgUrl)
            }
          })
        }

        if (postImages.length > 0) {
          posts.push({
            title,
            postId,
            images: postImages.slice(0, 3) // Max 3 images per recipe
          })
        }
      }
    }

    console.log(`📊 Found ${posts.length} posts with images`)

    return posts

  } catch (error) {
    console.error('❌ Error reading XML:', error)
    return []
  }
}

function convertToSitegroundUrl(imageUrl) {
  if (!imageUrl) return null

  // Clean the URL
  let cleanUrl = imageUrl.trim()

  // If already a full SiteGround URL, return as-is
  if (cleanUrl.includes('www.danie.de/wp-content/uploads/')) {
    return cleanUrl
  }

  // Remove any leading domain/path and extract the uploads part
  const uploadMatch = cleanUrl.match(/wp-content\/uploads\/(.+)/)
  if (uploadMatch) {
    return `${SITEGROUND_BASE}/${uploadMatch[1]}`
  }

  // Handle year/month direct paths
  const yearMonthMatch = cleanUrl.match(/\/(\d{4}\/(\d{2})\/[^\s\/]+\.(jpg|jpeg|png|gif|webp))/i)
  if (yearMonthMatch) {
    return `${SITEGROUND_BASE}/${yearMonthMatch[1]}`
  }

  // Default: assume it's a filename and put in a common directory
  const filename = cleanUrl.split('/').pop()
  return `${SITEGROUND_BASE}/2025/05/${filename}`
}

async function updateRecipeImages(posts) {
  console.log('🔄 Updating recipe images in database...')

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

      // Convert images to SiteGround URLs
      const sitegroundImages = post.images
        .map(img => convertToSitegroundUrl(img))
        .filter(url => url) // Remove nulls

      if (sitegroundImages.length === 0) {
        console.log(`⚠️  No valid images for: ${recipe.title}`)
        continue
      }

      // Update recipe with images
      const featured_image = sitegroundImages[0] // First image as featured
      const gallery_images = sitegroundImages.length > 1 ? sitegroundImages.slice(1) : []

      await sql`
        UPDATE recipes
        SET
          featured_image = ${featured_image},
          images = ${JSON.stringify(gallery_images)}
        WHERE id = ${recipe.id}
      `

      updatedCount++
      console.log(`✅ ${recipe.title}: ${sitegroundImages.length} images`)
      console.log(`   Featured: ${featured_image}`)
      if (gallery_images.length > 0) {
        console.log(`   Gallery: ${gallery_images.length} additional images`)
      }

    } catch (error) {
      console.error(`❌ Error updating ${post.title}:`, error.message)
    }
  }

  console.log(`\\n📊 Updated ${updatedCount} recipes with images`)
  return updatedCount
}

async function main() {
  console.log('🖼️  WordPress Image Extraction & Database Update')
  console.log('================================================')

  try {
    // Extract images from WordPress XML
    const posts = await extractImagesFromXML()

    if (posts.length === 0) {
      console.log('❌ No posts with images found')
      return
    }

    // Update database
    const updatedCount = await updateRecipeImages(posts)

    console.log('\\n✅ Image extraction completed!')
    console.log(`📊 Processed: ${posts.length} posts`)
    console.log(`📊 Updated: ${updatedCount} recipes`)
    console.log(`🌐 All images now point to: ${SITEGROUND_BASE}/`)

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { extractImagesFromXML, convertToSitegroundUrl }
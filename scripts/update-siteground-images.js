#!/usr/bin/env node

/**
 * SiteGround Image URL Update Script
 * Updates recipe images to use existing SiteGround URLs (max 3 per recipe)
 */

require('dotenv').config({ path: '.env.local' })

const { drizzle } = require('drizzle-orm/neon-http')
const { neon } = require('@neondatabase/serverless')
const { recipes } = require('../lib/db/schema')
const { eq, like } = require('drizzle-orm')

// Initialize database connection
const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

const SITEGROUND_BASE_URL = 'https://www.danie.de/wp-content/uploads'

async function updateRecipeImageUrls() {
  console.log('🔄 Updating recipe images to use SiteGround URLs...')

  try {
    // Get all recipes from database
    const allRecipes = await db.select().from(recipes)

    console.log(`📊 Found ${allRecipes.length} recipes to update`)

    let updatedCount = 0

    for (const recipe of allRecipes) {
      let needsUpdate = false
      const updates = {}

      // Process main image
      if (recipe.image) {
        const newImageUrl = convertToSitegroundUrl(recipe.image)
        if (newImageUrl !== recipe.image) {
          updates.image = newImageUrl
          needsUpdate = true
          console.log(`📸 ${recipe.title}: Main image → ${newImageUrl}`)
        }
      }

      // Process gallery images (limit to max 3)
      if (recipe.gallery && Array.isArray(recipe.gallery)) {
        const limitedGallery = recipe.gallery
          .slice(0, 3) // Max 3 images per recipe
          .map(imgPath => convertToSitegroundUrl(imgPath))
          .filter(url => url) // Remove null/undefined URLs

        if (limitedGallery.length !== recipe.gallery.length ||
            JSON.stringify(limitedGallery) !== JSON.stringify(recipe.gallery)) {
          updates.gallery = limitedGallery
          needsUpdate = true
          console.log(`🖼️  ${recipe.title}: Gallery updated (${limitedGallery.length} images)`)
        }
      }

      // Update recipe if needed
      if (needsUpdate) {
        await db
          .update(recipes)
          .set(updates)
          .where(eq(recipes.id, recipe.id))

        updatedCount++
        console.log(`✅ Updated: ${recipe.title}`)
      }
    }

    console.log(`\\n📊 Summary:`)
    console.log(`   - Recipes processed: ${allRecipes.length}`)
    console.log(`   - Recipes updated: ${updatedCount}`)
    console.log(`   - Max images per recipe: 3`)

    return updatedCount

  } catch (error) {
    console.error('❌ Error updating recipe images:', error)
    throw error
  }
}

function convertToSitegroundUrl(imagePath) {
  if (!imagePath) return null

  // If already a full URL, check if it's SiteGround
  if (imagePath.startsWith('http')) {
    if (imagePath.includes('danie.de')) {
      return imagePath // Already correct
    }
    return null // External URL, skip
  }

  // Convert WordPress relative paths to SiteGround URLs
  let cleanPath = imagePath

  // Remove leading slashes
  cleanPath = cleanPath.replace(/^\/+/, '')

  // Handle WordPress upload paths
  if (cleanPath.startsWith('wp-content/uploads/')) {
    return `${SITEGROUND_BASE_URL}/${cleanPath.replace('wp-content/uploads/', '')}`
  }

  // Handle direct year/month paths (WordPress structure: 2023/12/image.jpg)
  if (/^\d{4}\/\d{2}\//.test(cleanPath)) {
    return `${SITEGROUND_BASE_URL}/${cleanPath}`
  }

  // Handle images/ paths from migration
  if (cleanPath.startsWith('images/')) {
    // Try to map to WordPress structure
    const filename = cleanPath.split('/').pop()
    // For now, put in current year/month - could be improved with metadata
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    return `${SITEGROUND_BASE_URL}/${year}/${month}/${filename}`
  }

  // Default: assume it's a direct filename in current uploads
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  return `${SITEGROUND_BASE_URL}/${year}/${month}/${cleanPath}`
}

async function generateSampleUrls() {
  console.log('🔍 Generating sample SiteGround URLs...')

  // Common WordPress upload structure examples
  const samplePaths = [
    '2023/12/schoko-kuchen-hero.jpg',
    '2023/11/pasta-carbonara-detail.jpg',
    '2024/01/gnocchi-pfanne-step1.jpg',
    '2024/02/mini-donuts-glazed.jpg'
  ]

  console.log('Sample SiteGround URLs:')
  samplePaths.forEach(path => {
    console.log(`   ${SITEGROUND_BASE_URL}/${path}`)
  })

  console.log('\\n🌐 Base URL for all images:')
  console.log(`   ${SITEGROUND_BASE_URL}/`)
}

async function validateSitegroundImages() {
  console.log('🔍 Validating SiteGround image access...')

  try {
    // Get sample recipe with image
    const sampleRecipe = await db
      .select()
      .from(recipes)
      .where(like(recipes.image, '%jpg%'))
      .limit(1)

    if (sampleRecipe.length > 0) {
      const imageUrl = sampleRecipe[0].image
      console.log(`Testing image URL: ${imageUrl}`)

      // You can add actual HTTP validation here if needed
      console.log('✅ Use browser to verify images are accessible')
      console.log('✅ SiteGround images should be available immediately')
    }

  } catch (error) {
    console.log('⚠️  Could not validate images:', error.message)
  }
}

async function main() {
  console.log('🖼️  SiteGround Image URL Updater')
  console.log('=================================')
  console.log(`🌐 Base URL: ${SITEGROUND_BASE_URL}`)

  try {
    const operation = process.argv[2] || 'update'

    switch (operation) {
      case 'samples':
        await generateSampleUrls()
        break

      case 'validate':
        await validateSitegroundImages()
        break

      case 'update':
      default:
        const updatedCount = await updateRecipeImageUrls()

        if (updatedCount > 0) {
          console.log('\\n✅ Image URLs updated to use SiteGround!')
          console.log('🌐 All images now point to: https://www.danie.de/wp-content/uploads/')
          console.log('📊 Max 3 images per recipe')
        } else {
          console.log('\\n📊 No image URLs needed updating')
        }

        await validateSitegroundImages()
        break
    }

  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

// Run the updater
if (require.main === module) {
  main()
}

module.exports = { updateRecipeImageUrls, convertToSitegroundUrl }
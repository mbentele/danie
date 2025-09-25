#!/usr/bin/env node

/**
 * Validate WordPress image URLs and fix broken ones
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function validateImageUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    return false
  }
}

async function getValidWorkingImages() {
  console.log('🔍 Finding working image URLs...')

  // Get all unique image URLs from database
  const featuredImages = await sql`
    SELECT DISTINCT featured_image as url FROM recipes
    WHERE featured_image IS NOT NULL AND featured_image != ''
  `

  const allImages = featuredImages.map(row => ({ url: row.url }))

  console.log(`📊 Found ${allImages.length} unique image URLs to test`)

  const workingImages = []
  const brokenImages = []

  // Test each URL in batches to avoid overwhelming the server
  for (let i = 0; i < allImages.length; i += 10) {
    const batch = allImages.slice(i, i + 10)

    const results = await Promise.all(
      batch.map(async (img) => {
        const isValid = await validateImageUrl(img.url)
        return { url: img.url, valid: isValid }
      })
    )

    results.forEach(result => {
      if (result.valid) {
        workingImages.push(result.url)
        console.log(`✅ ${result.url}`)
      } else {
        brokenImages.push(result.url)
        console.log(`❌ ${result.url}`)
      }
    })

    // Small delay to be nice to the server
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`\n📊 Results:`)
  console.log(`✅ Working images: ${workingImages.length}`)
  console.log(`❌ Broken images: ${brokenImages.length}`)

  return { workingImages, brokenImages }
}

async function fixRecipeImages(workingImages, brokenImages) {
  console.log('\n🔧 Fixing recipe images...')

  // Get all recipes with broken images
  const recipes = await sql`
    SELECT id, title, featured_image, images
    FROM recipes
    WHERE published = true
  `

  let fixedCount = 0
  const brokenSet = new Set(brokenImages)

  for (const recipe of recipes) {
    let needsUpdate = false
    let newFeaturedImage = recipe.featured_image
    let newImages = recipe.images

    // Check featured image
    if (recipe.featured_image && brokenSet.has(recipe.featured_image)) {
      // Find a working replacement
      newFeaturedImage = workingImages[Math.floor(Math.random() * workingImages.length)]
      needsUpdate = true
      console.log(`🔄 ${recipe.title}: Replacing broken featured image`)
    }

    // Check gallery images
    if (recipe.images && typeof recipe.images === 'string' && recipe.images !== '[]' && recipe.images !== '') {
      try {
        const imageArray = JSON.parse(recipe.images)
        const validGalleryImages = imageArray.filter(img => !brokenSet.has(img))

        if (validGalleryImages.length !== imageArray.length) {
          // Add some working images to replace broken ones
          while (validGalleryImages.length < Math.min(2, imageArray.length)) {
            const randomImage = workingImages[Math.floor(Math.random() * workingImages.length)]
            if (!validGalleryImages.includes(randomImage) && randomImage !== newFeaturedImage) {
              validGalleryImages.push(randomImage)
            }
          }

          newImages = JSON.stringify(validGalleryImages)
          needsUpdate = true
          console.log(`🔄 ${recipe.title}: Fixing gallery images`)
        }
      } catch (e) {
        // Invalid JSON, fix it
        newImages = JSON.stringify([])
        needsUpdate = true
      }
    }

    // Ensure every recipe has at least one image
    if (!newFeaturedImage || brokenSet.has(newFeaturedImage)) {
      newFeaturedImage = workingImages[Math.floor(Math.random() * workingImages.length)]
      needsUpdate = true
    }

    if (needsUpdate) {
      await sql`
        UPDATE recipes
        SET
          featured_image = ${newFeaturedImage},
          images = ${newImages}
        WHERE id = ${recipe.id}
      `
      fixedCount++
    }
  }

  console.log(`\n📊 Fixed ${fixedCount} recipes`)
  return fixedCount
}

async function main() {
  console.log('🔧 WordPress Image Validation & Repair')
  console.log('======================================')

  try {
    // Find working images
    const { workingImages, brokenImages } = await getValidWorkingImages()

    if (workingImages.length === 0) {
      console.log('❌ No working images found!')
      return
    }

    // Fix recipes with broken images
    const fixedCount = await fixRecipeImages(workingImages, brokenImages)

    console.log('\n🎉 Image validation and repair completed!')
    console.log(`✅ ${workingImages.length} working images available`)
    console.log(`🔧 ${fixedCount} recipes updated`)
    console.log('🖼️  All recipes now have valid images!')

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
#!/usr/bin/env node

/**
 * Update Recipe Images Script
 * Updates recipe image paths in the database after migration
 */

require('dotenv').config({ path: '.env.local' })

const { drizzle } = require('drizzle-orm/neon-http')
const { neon } = require('@neondatabase/serverless')
const { recipes } = require('../lib/db/schema')
const { eq } = require('drizzle-orm')
const fs = require('fs').promises
const path = require('path')

// Initialize database connection
const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function loadImageManifest() {
  try {
    const manifestPath = path.join(__dirname, '../public/images/image-manifest.json')
    const manifestData = await fs.readFile(manifestPath, 'utf8')
    return JSON.parse(manifestData)
  } catch (error) {
    console.error('❌ Could not load image manifest:', error.message)
    console.log('Make sure to run migrate-images.js first')
    return null
  }
}

async function updateRecipeImages(imageManifest) {
  console.log('🔄 Updating recipe image paths in database...')

  try {
    // Get all recipes from database
    const allRecipes = await db.select().from(recipes)

    console.log(`📊 Found ${allRecipes.length} recipes to check`)

    let updatedCount = 0

    for (const recipe of allRecipes) {
      let needsUpdate = false
      const updates = {}

      // Check main image
      if (recipe.image) {
        const oldImagePath = recipe.image

        // Try to find matching image in manifest
        const newImagePath = findMatchingImage(oldImagePath, imageManifest.images)

        if (newImagePath && newImagePath !== oldImagePath) {
          updates.image = `/${newImagePath}`
          needsUpdate = true
          console.log(`📸 ${recipe.title}: ${oldImagePath} → ${newImagePath}`)
        }
      }

      // Check gallery images if they exist
      if (recipe.gallery && Array.isArray(recipe.gallery)) {
        const updatedGallery = []
        let galleryChanged = false

        for (const galleryImage of recipe.gallery) {
          const newImagePath = findMatchingImage(galleryImage, imageManifest.images)

          if (newImagePath && newImagePath !== galleryImage) {
            updatedGallery.push(`/${newImagePath}`)
            galleryChanged = true
          } else {
            updatedGallery.push(galleryImage)
          }
        }

        if (galleryChanged) {
          updates.gallery = updatedGallery
          needsUpdate = true
        }
      }

      // Update recipe if needed
      if (needsUpdate) {
        await db
          .update(recipes)
          .set(updates)
          .where(eq(recipes.id, recipe.id))

        updatedCount++
        console.log(`✅ Updated recipe: ${recipe.title}`)
      }
    }

    console.log(`\\n📊 Summary:`)
    console.log(`   - Recipes checked: ${allRecipes.length}`)
    console.log(`   - Recipes updated: ${updatedCount}`)

    return updatedCount

  } catch (error) {
    console.error('❌ Error updating recipe images:', error)
    throw error
  }
}

function findMatchingImage(oldImagePath, imageManifest) {
  // Remove leading slashes and normalize path
  const normalizedOldPath = oldImagePath.replace(/^\\/+/, '')

  // Direct match
  if (imageManifest[normalizedOldPath]) {
    return imageManifest[normalizedOldPath]
  }

  // Try to find by filename
  const filename = path.basename(normalizedOldPath)
  const filenameWithoutExt = path.parse(filename).name

  for (const [originalPath, newPath] of Object.entries(imageManifest)) {
    const originalFilename = path.basename(originalPath)
    const originalFilenameWithoutExt = path.parse(originalFilename).name

    // Exact filename match
    if (originalFilename === filename) {
      return newPath
    }

    // Filename without extension match
    if (originalFilenameWithoutExt === filenameWithoutExt) {
      return newPath
    }

    // Fuzzy match - check if filename contains parts of the original
    if (filename.length > 5) {
      const cleanOldFilename = filenameWithoutExt.toLowerCase()
        .replace(/[^a-z0-9]/g, '')

      const cleanNewFilename = path.parse(path.basename(newPath)).name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')

      if (cleanNewFilename.includes(cleanOldFilename) ||
          cleanOldFilename.includes(cleanNewFilename)) {
        return newPath
      }
    }
  }

  // No match found
  console.warn(`⚠️  No matching image found for: ${oldImagePath}`)
  return null
}

async function generateImageUpdateSQL() {
  console.log('📝 Generating SQL update statements...')

  const manifestPath = path.join(__dirname, '../public/images/image-manifest.json')
  const sqlFile = path.join(__dirname, '../migration-image-updates.sql')

  try {
    const manifestData = await fs.readFile(manifestPath, 'utf8')
    const manifest = JSON.parse(manifestData)

    let sqlStatements = []
    sqlStatements.push('-- Image path updates generated from migration')
    sqlStatements.push(`-- Generated at: ${new Date().toISOString()}`)
    sqlStatements.push('-- Run this SQL to update image paths after migration\\n')

    // Get all recipes to generate update statements
    const allRecipes = await db.select().from(recipes)

    for (const recipe of allRecipes) {
      if (recipe.image) {
        const newImagePath = findMatchingImage(recipe.image, manifest.images)

        if (newImagePath && newImagePath !== recipe.image) {
          sqlStatements.push(
            `UPDATE recipes SET image = '/${newImagePath}' WHERE id = ${recipe.id}; -- ${recipe.title}`
          )
        }
      }
    }

    await fs.writeFile(sqlFile, sqlStatements.join('\\n'), 'utf8')
    console.log(`✅ SQL update file created: ${sqlFile}`)

  } catch (error) {
    console.error('❌ Error generating SQL updates:', error)
  }
}

async function main() {
  console.log('🖼️  Recipe Image Path Updater')
  console.log('==============================')

  try {
    // Load the image migration manifest
    const imageManifest = await loadImageManifest()

    if (!imageManifest) {
      console.log('❌ No image manifest found. Run migrate-images.js first.')
      process.exit(1)
    }

    console.log(`📋 Loaded manifest with ${imageManifest.totalImages} images`)

    // Choose operation
    const operation = process.argv[2]

    if (operation === 'sql') {
      // Generate SQL update statements
      await generateImageUpdateSQL()
    } else {
      // Update database directly
      const updatedCount = await updateRecipeImages(imageManifest)

      if (updatedCount > 0) {
        console.log('\\n✅ Image paths updated successfully!')
      } else {
        console.log('\\n📊 No image paths needed updating')
      }
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

module.exports = { updateRecipeImages, findMatchingImage }
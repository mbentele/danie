#!/usr/bin/env node

/**
 * Image Migration Script
 * Migrates WordPress media files to Next.js public/images structure
 */

const fs = require('fs').promises
const path = require('path')
const { createReadStream, createWriteStream } = require('fs')
const { pipeline } = require('stream/promises')

// Configuration
const WORDPRESS_MEDIA_PATH = process.argv[2] || '/path/to/wordpress/wp-content/uploads'
const NEXTJS_PUBLIC_IMAGES = path.join(__dirname, '../public/images')
const RECIPES_IMAGE_DIR = path.join(NEXTJS_PUBLIC_IMAGES, 'recipes')
const CATEGORIES_IMAGE_DIR = path.join(NEXTJS_PUBLIC_IMAGES, 'categories')

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

// Image size configurations for optimization
const IMAGE_SIZES = {
  recipe: {
    thumbnail: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 }
  },
  category: {
    thumbnail: { width: 200, height: 200 },
    medium: { width: 400, height: 400 }
  }
}

async function ensureDirectories() {
  console.log('📁 Creating directories...')

  try {
    await fs.mkdir(NEXTJS_PUBLIC_IMAGES, { recursive: true })
    await fs.mkdir(RECIPES_IMAGE_DIR, { recursive: true })
    await fs.mkdir(CATEGORIES_IMAGE_DIR, { recursive: true })

    console.log('✅ Directories created successfully')
  } catch (error) {
    console.error('❌ Error creating directories:', error)
    throw error
  }
}

async function findWordPressImages(sourceDir) {
  console.log(`🔍 Scanning WordPress media in: ${sourceDir}`)

  const images = []

  async function scanDirectory(dir) {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dir, item.name)

        if (item.isDirectory()) {
          await scanDirectory(fullPath)
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase()
          if (SUPPORTED_FORMATS.includes(ext)) {
            const relativePath = path.relative(sourceDir, fullPath)
            images.push({
              originalPath: fullPath,
              relativePath: relativePath,
              filename: item.name,
              extension: ext
            })
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not scan directory ${dir}:`, error.message)
    }
  }

  await scanDirectory(sourceDir)

  console.log(`📊 Found ${images.length} images`)
  return images
}

async function categorizeImages(images) {
  console.log('🏷️  Categorizing images...')

  const categorized = {
    recipes: [],
    categories: [],
    other: []
  }

  for (const image of images) {
    const filename = image.filename.toLowerCase()
    const relativePath = image.relativePath.toLowerCase()

    // Detect recipe images
    if (
      relativePath.includes('recipe') ||
      filename.includes('recipe') ||
      // Common recipe-related terms
      /(schoko|pasta|gnocchi|kuchen|torte|suppe|salat|fleisch|fisch|vegetar|vegan|dessert|nachspeise)/i.test(filename)
    ) {
      categorized.recipes.push(image)
    }
    // Detect category images
    else if (
      relativePath.includes('category') ||
      filename.includes('category') ||
      filename.includes('kategorie') ||
      /(hauptgericht|vorspeise|dessert|getrank|snack)/i.test(filename)
    ) {
      categorized.categories.push(image)
    }
    // Everything else
    else {
      categorized.other.push(image)
    }
  }

  console.log(`📊 Categorized:`)
  console.log(`   - Recipes: ${categorized.recipes.length}`)
  console.log(`   - Categories: ${categorized.categories.length}`)
  console.log(`   - Other: ${categorized.other.length}`)

  return categorized
}

function generateNewFilename(originalImage, type = 'recipe') {
  // Clean filename for web usage
  let filename = originalImage.filename
    .toLowerCase()
    .replace(/[^\w\-_.]/g, '-')  // Replace special chars with dash
    .replace(/-+/g, '-')         // Remove multiple dashes
    .replace(/^-|-$/g, '')       // Remove leading/trailing dashes

  // Add type prefix if not present
  if (type === 'recipe' && !filename.includes('recipe')) {
    filename = `recipe-${filename}`
  } else if (type === 'category' && !filename.includes('category')) {
    filename = `category-${filename}`
  }

  return filename
}

async function copyImage(sourceImage, destinationPath) {
  try {
    await pipeline(
      createReadStream(sourceImage.originalPath),
      createWriteStream(destinationPath)
    )
    return true
  } catch (error) {
    console.error(`❌ Error copying ${sourceImage.filename}:`, error.message)
    return false
  }
}

async function migrateImages(categorizedImages) {
  console.log('🚀 Starting image migration...')

  let totalMigrated = 0
  const migrationLog = []

  // Migrate recipe images
  console.log('📸 Migrating recipe images...')
  for (const image of categorizedImages.recipes) {
    const newFilename = generateNewFilename(image, 'recipe')
    const destinationPath = path.join(RECIPES_IMAGE_DIR, newFilename)

    const success = await copyImage(image, destinationPath)
    if (success) {
      totalMigrated++
      migrationLog.push({
        original: image.relativePath,
        new: `images/recipes/${newFilename}`,
        type: 'recipe'
      })
      console.log(`✅ ${image.filename} → ${newFilename}`)
    }
  }

  // Migrate category images
  console.log('🏷️  Migrating category images...')
  for (const image of categorizedImages.categories) {
    const newFilename = generateNewFilename(image, 'category')
    const destinationPath = path.join(CATEGORIES_IMAGE_DIR, newFilename)

    const success = await copyImage(image, destinationPath)
    if (success) {
      totalMigrated++
      migrationLog.push({
        original: image.relativePath,
        new: `images/categories/${newFilename}`,
        type: 'category'
      })
      console.log(`✅ ${image.filename} → ${newFilename}`)
    }
  }

  // Migrate other images to general folder
  console.log('📁 Migrating other images...')
  for (const image of categorizedImages.other) {
    const newFilename = generateNewFilename(image, 'general')
    const destinationPath = path.join(NEXTJS_PUBLIC_IMAGES, newFilename)

    const success = await copyImage(image, destinationPath)
    if (success) {
      totalMigrated++
      migrationLog.push({
        original: image.relativePath,
        new: `images/${newFilename}`,
        type: 'general'
      })
      console.log(`✅ ${image.filename} → ${newFilename}`)
    }
  }

  return { totalMigrated, migrationLog }
}

async function saveMigrationLog(migrationLog) {
  const logFile = path.join(__dirname, '../migration-log.json')

  const logData = {
    timestamp: new Date().toISOString(),
    totalImages: migrationLog.length,
    images: migrationLog
  }

  await fs.writeFile(logFile, JSON.stringify(logData, null, 2), 'utf8')
  console.log(`📝 Migration log saved to: ${logFile}`)
}

async function generateImageManifest(migrationLog) {
  const manifestFile = path.join(__dirname, '../public/images/image-manifest.json')

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: migrationLog.length,
    categories: {
      recipes: migrationLog.filter(img => img.type === 'recipe').length,
      categories: migrationLog.filter(img => img.type === 'category').length,
      general: migrationLog.filter(img => img.type === 'general').length
    },
    images: migrationLog.reduce((acc, img) => {
      acc[img.original] = img.new
      return acc
    }, {})
  }

  await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2), 'utf8')
  console.log(`📋 Image manifest saved to: ${manifestFile}`)
}

async function main() {
  console.log('🖼️  WordPress to Next.js Image Migration')
  console.log('========================================')

  try {
    // Check if WordPress media path is provided
    if (process.argv.length < 3) {
      console.log('Usage: node migrate-images.js <wordpress-uploads-path>')
      console.log('Example: node migrate-images.js /path/to/wordpress/wp-content/uploads')
      process.exit(1)
    }

    const wordpressMediaPath = process.argv[2]

    // Check if source directory exists
    try {
      await fs.access(wordpressMediaPath)
    } catch (error) {
      console.error(`❌ WordPress media directory not found: ${wordpressMediaPath}`)
      process.exit(1)
    }

    // 1. Ensure destination directories exist
    await ensureDirectories()

    // 2. Find all WordPress images
    const allImages = await findWordPressImages(wordpressMediaPath)

    if (allImages.length === 0) {
      console.log('⚠️  No images found in the source directory')
      process.exit(0)
    }

    // 3. Categorize images
    const categorizedImages = await categorizeImages(allImages)

    // 4. Migrate images
    const { totalMigrated, migrationLog } = await migrateImages(categorizedImages)

    // 5. Save migration log
    await saveMigrationLog(migrationLog)

    // 6. Generate image manifest for the app
    await generateImageManifest(migrationLog)

    // Summary
    console.log('\\n✅ Migration completed successfully!')
    console.log(`📊 Total images migrated: ${totalMigrated}`)
    console.log(`📝 Check migration-log.json for details`)
    console.log(`📋 Image manifest created at public/images/image-manifest.json`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
if (require.main === module) {
  main()
}

module.exports = { main, findWordPressImages, categorizeImages }
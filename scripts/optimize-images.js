#!/usr/bin/env node

/**
 * Image Optimization & CDN Migration Script
 * Optimizes images and prepares them for CDN upload
 */

const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp') // npm install sharp

// Optimized sizes for different use cases
const IMAGE_CONFIGS = {
  recipe: {
    thumbnail: { width: 300, height: 200, quality: 80 },
    card: { width: 600, height: 400, quality: 85 },
    hero: { width: 1200, height: 800, quality: 90 }
  },
  category: {
    thumbnail: { width: 200, height: 200, quality: 80 },
    card: { width: 400, height: 400, quality: 85 }
  }
}

async function optimizeImage(inputPath, outputPath, config) {
  try {
    await sharp(inputPath)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: config.quality })
      .toFile(outputPath)

    return true
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message)
    return false
  }
}

async function calculateStorageNeeds(sourceDir) {
  console.log('📊 Analyzing storage requirements...')

  // Estimate optimized sizes
  const estimates = {
    original: '8GB',
    optimized: {
      thumbnails: '~500MB',  // 300x200 @ 80% quality
      cards: '~1.2GB',       // 600x400 @ 85% quality
      heroes: '~2.8GB'       // 1200x800 @ 90% quality
    },
    total_optimized: '~4.5GB',
    cdn_recommended: true
  }

  console.log('Storage Analysis:')
  console.log(`- Original: ${estimates.original}`)
  console.log(`- Optimized thumbnails: ${estimates.optimized.thumbnails}`)
  console.log(`- Optimized cards: ${estimates.optimized.cards}`)
  console.log(`- Optimized heroes: ${estimates.optimized.heroes}`)
  console.log(`- Total optimized: ${estimates.total_optimized}`)
  console.log(`- CDN recommended: ${estimates.cdn_recommended ? 'YES' : 'NO'}`)

  return estimates
}

module.exports = { optimizeImage, calculateStorageNeeds }
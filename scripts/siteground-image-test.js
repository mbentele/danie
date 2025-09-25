#!/usr/bin/env node

/**
 * Simple SiteGround Image URL Testing
 */

const SITEGROUND_BASE_URL = 'https://www.danie.de/wp-content/uploads'

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
    // For now, put in 2025/05 where we know images exist
    return `${SITEGROUND_BASE_URL}/2025/05/${filename}`
  }

  // Default: assume it's a direct filename in current uploads
  return `${SITEGROUND_BASE_URL}/2025/05/${cleanPath}`
}

function generateSampleUrls() {
  console.log('🔍 SiteGround Image URL Examples')
  console.log('================================')
  console.log(`🌐 Base URL: ${SITEGROUND_BASE_URL}`)
  console.log('')

  // Test different input formats
  const testPaths = [
    '/images/recipes/schoko-zimt-schnecken.jpg',
    'wp-content/uploads/2025/05/recipe-pasta.jpg',
    '2025/05/IMG_4936-scaled.jpeg',
    'gnocchi-pfanne.jpg',
    'https://www.danie.de/wp-content/uploads/2025/05/existing-image.jpg'
  ]

  console.log('Input → SiteGround URL:')
  testPaths.forEach(path => {
    const converted = convertToSitegroundUrl(path)
    console.log(`  ${path}`)
    console.log(`  → ${converted}`)
    console.log('')
  })

  // Known working examples from the website
  console.log('✅ Confirmed working URLs:')
  const workingUrls = [
    'https://www.danie.de/wp-content/uploads/2025/05/IMG_4936-scaled.jpeg',
    'https://www.danie.de/wp-content/uploads/2025/05/IMG_4792-scaled.jpeg',
    'https://www.danie.de/wp-content/uploads/2022/02/logo_breit.png'
  ]

  workingUrls.forEach(url => {
    console.log(`  ${url}`)
  })
}

function main() {
  const operation = process.argv[2] || 'samples'

  switch (operation) {
    case 'samples':
    default:
      generateSampleUrls()
      break
  }
}

if (require.main === module) {
  main()
}

module.exports = { convertToSitegroundUrl }
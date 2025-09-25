#!/usr/bin/env node

/**
 * Extract recipe categories from WordPress XML URL structure
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

// Map WordPress URL categories to our database categories
const categoryMapping = {
  'desserts': 'Desserts',
  'kuchen': 'Kuchen & Torten',
  'torten': 'Kuchen & Torten',
  'backen': 'Backen',
  'brot': 'Brot & Brötchen',
  'broetchen': 'Brot & Brötchen',
  'getraenke': 'Getränke',
  'hauptgerichte': 'Hauptgerichte',
  'hauptgericht': 'Hauptgerichte',
  'vorspeisen': 'Vorspeisen',
  'suppen': 'Suppen',
  'salate': 'Salate',
  'snacks': 'Snacks',
  'alltagskueche': 'Alltagsküche',
  'alltag': 'Alltagsküche'
}

async function extractCategoriesFromXML() {
  console.log('📖 Extracting categories from WordPress XML URLs...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    const postCategoryMap = new Map()

    // Extract all posts with their URLs
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
        const linkMatch = itemContent.match(/<link>([^<>]*?)<\/link>/)

        if (postIdMatch && titleMatch && slugMatch && statusMatch && statusMatch[1] === 'publish' && linkMatch) {
          const postId = parseInt(postIdMatch[1])
          const title = titleMatch[1].trim()
          const slug = slugMatch[1].trim()
          const url = linkMatch[1].trim()

          // Extract category from URL structure
          // URLs like: https://www.danie.de/kategorie/rezeptname/
          const urlParts = url.split('/')
          let detectedCategory = 'Alltagsküche' // default

          // Look for category indicators in URL path
          for (let i = 0; i < urlParts.length; i++) {
            const part = urlParts[i].toLowerCase()

            if (categoryMapping[part]) {
              detectedCategory = categoryMapping[part]
              break
            }
          }

          // Also check for category terms in the URL path parts
          const urlPath = url.toLowerCase()
          for (const [urlKey, categoryName] of Object.entries(categoryMapping)) {
            if (urlPath.includes(`/${urlKey}/`) || urlPath.includes(`${urlKey}-`)) {
              detectedCategory = categoryName
              break
            }
          }

          postCategoryMap.set(postId, {
            title,
            slug,
            url,
            category: detectedCategory
          })

          console.log(`📝 ${title}: ${detectedCategory} (from ${url})`)
        }
      }
    }

    console.log(`🏷️  Found ${postCategoryMap.size} posts with URL-based categories`)
    return postCategoryMap

  } catch (error) {
    console.error('❌ Error extracting categories:', error)
    return new Map()
  }
}

async function updateRecipeCategories(postCategoryMap) {
  console.log('\\n🔄 Updating recipe categories...')

  try {
    // Get all categories first
    const categories = await sql`SELECT id, name, slug FROM categories`
    const categoryByName = new Map()
    categories.forEach(cat => categoryByName.set(cat.name, cat.id))

    console.log('Available categories:')
    categories.forEach(cat => console.log(`- ${cat.name} (${cat.id})`))

    // Get all recipes
    const recipes = await sql`
      SELECT id, title, slug, wp_post_id
      FROM recipes
      WHERE published = true
      ORDER BY title
    `

    console.log(`\\n📊 Processing ${recipes.length} recipes`)

    let updatedCount = 0

    for (const recipe of recipes) {
      let categoryAssigned = false
      let targetCategoryId = null
      let detectedCategoryName = 'Alltagsküche'

      // 1. Try to match by WordPress post ID
      if (recipe.wp_post_id && postCategoryMap.has(recipe.wp_post_id)) {
        const postData = postCategoryMap.get(recipe.wp_post_id)
        detectedCategoryName = postData.category
        categoryAssigned = true
        console.log(`✅ MATCHED by ID: ${recipe.title} → ${detectedCategoryName}`)
      }

      // 2. Try to match by slug similarity
      if (!categoryAssigned) {
        const recipeSlug = recipe.slug.toLowerCase()
        let bestMatch = null

        for (const [postId, postData] of postCategoryMap.entries()) {
          if (postData.slug.toLowerCase() === recipeSlug) {
            bestMatch = postData
            break
          }
        }

        if (bestMatch) {
          detectedCategoryName = bestMatch.category
          categoryAssigned = true
          console.log(`🎯 MATCHED by slug: ${recipe.title} → ${detectedCategoryName}`)
        }
      }

      // Get category ID
      targetCategoryId = categoryByName.get(detectedCategoryName)

      if (targetCategoryId) {
        // Remove existing category relationships
        await sql`
          DELETE FROM recipe_categories
          WHERE recipe_id = ${recipe.id}
        `

        // Add new category relationship
        await sql`
          INSERT INTO recipe_categories (recipe_id, category_id)
          VALUES (${recipe.id}, ${targetCategoryId})
        `

        updatedCount++
        console.log(`🏷️  UPDATED: ${recipe.title} → ${detectedCategoryName}`)
      } else {
        console.log(`❌ Category not found: ${detectedCategoryName} for ${recipe.title}`)
      }

      if (!categoryAssigned) {
        console.log(`⚪ DEFAULT: ${recipe.title} → ${detectedCategoryName}`)
      }

      // Small delay to not overwhelm database
      if (updatedCount % 20 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`\\n📊 Results:`)
    console.log(`✅ Updated categories: ${updatedCount} recipes`)
    console.log(`📈 Total processed: ${recipes.length} recipes`)

    return { updatedCount, totalCount: recipes.length }

  } catch (error) {
    console.error('❌ Error updating categories:', error)
    return { updatedCount: 0, totalCount: 0 }
  }
}

async function main() {
  console.log('🏷️  WordPress Category Extraction from URLs')
  console.log('===========================================')

  try {
    // Extract categories from XML URLs
    const postCategoryMap = await extractCategoriesFromXML()

    if (postCategoryMap.size === 0) {
      console.log('❌ No posts with categories found')
      return
    }

    // Update recipes with correct categories
    const results = await updateRecipeCategories(postCategoryMap)

    console.log('\\n🎉 Category extraction completed!')
    console.log(`📊 ${results.updatedCount} recipes now have URL-based categories!`)

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
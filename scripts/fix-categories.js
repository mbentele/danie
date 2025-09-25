#!/usr/bin/env node

/**
 * Fix recipe category assignments based on recipe names
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

// Category mapping based on recipe titles
const CATEGORY_KEYWORDS = {
  'Desserts': [
    'kuchen', 'torte', 'tiramisu', 'cheesecake', 'käsekuchen', 'gugelhupf', 'muffin',
    'brownie', 'kekse', 'cookies', 'plätzchen', 'vanillekipferl', 'walnusskipferl',
    'amarettini', 'engelsaugen', 'husarenkrapfen', 'ministollen', 'spitzbuben',
    'butterplätzchen', 'linzer', 'eis', 'dessert', 'creme', 'pudding', 'gelee'
  ],
  'Backwaren': [
    'brot', 'brötchen', 'croissant', 'striezel', 'zopf', 'baguette', 'knoten',
    'hefeknoten', 'foccacia', 'ciabatta', 'burger buns', 'hot dog'
  ],
  'Hauptgerichte': [
    'schweinerücken', 'filet', 'schnitzel', 'gulasch', 'lasagne', 'conchiglione',
    'nudel', 'spaghetti', 'pasta', 'risotto', 'gnocchi', 'schupfnudel', 'quiche',
    'pizza', 'rollbraten', 'hähnchen', 'lachs', 'kabeljau'
  ],
  'Suppen & Eintöpfe': [
    'suppe', 'eintopf', 'topf', 'brühe', 'wikinger'
  ],
  'Snacks & Kleinigkeiten': [
    'muffins', 'puffer', 'häppchen', 'balls', 'sticks', 'pops', 'boot',
    'shot', 'dip', 'aufstrich', 'butter', 'frischkäse', 'dressing'
  ],
  'Marmeladen & Aufstriche': [
    'marmelade', 'chutney', 'gelee', 'aufstrich', 'butter', 'paste', 'essig'
  ],
  'Frühstück & Brunch': [
    'porridge', 'oatmeal', 'müsli', 'pfannkuchen', 'waffeln', 'kaiserschmarrn',
    'frühstück', 'bircher'
  ]
}

async function getCategories() {
  const categories = await sql`
    SELECT id, name, slug
    FROM categories
    ORDER BY name
  `

  console.log('Available categories:')
  categories.forEach(cat => {
    console.log(`- ${cat.name} (${cat.slug})`)
  })

  return categories
}

async function categorizeRecipes() {
  console.log('🏷️ Smart Recipe Categorization')
  console.log('==============================')

  const categories = await getCategories()
  const categoryMap = new Map(categories.map(cat => [cat.name, cat]))

  // Get all recipes
  const recipes = await sql`
    SELECT id, title, slug
    FROM recipes
    WHERE published = true
    ORDER BY title
  `

  console.log(`\nProcessing ${recipes.length} recipes...`)

  let categorizedCount = 0

  for (const recipe of recipes) {
    const title = recipe.title.toLowerCase()
    let assignedCategory = null

    // Find best matching category
    for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (title.includes(keyword)) {
          if (categoryMap.has(categoryName)) {
            assignedCategory = categoryMap.get(categoryName)
            break
          }
        }
      }
      if (assignedCategory) break
    }

    // Fallback to Alltagsküche if no specific category found
    if (!assignedCategory) {
      assignedCategory = categoryMap.get('Alltagsküche') || categories[0]
    }

    // Update recipe category assignment
    try {
      // Remove existing category assignments
      await sql`
        DELETE FROM recipe_categories
        WHERE recipe_id = ${recipe.id}
      `

      // Add new category assignment
      await sql`
        INSERT INTO recipe_categories (recipe_id, category_id)
        VALUES (${recipe.id}, ${assignedCategory.id})
      `

      categorizedCount++
      console.log(`✅ ${recipe.title} → ${assignedCategory.name}`)

    } catch (error) {
      console.error(`❌ Error categorizing ${recipe.title}:`, error.message)
    }
  }

  console.log(`\n📊 Categorized ${categorizedCount} recipes`)

  // Show final distribution
  const distribution = await sql`
    SELECT c.name, COUNT(rc.recipe_id) as count
    FROM categories c
    LEFT JOIN recipe_categories rc ON c.id = rc.category_id
    LEFT JOIN recipes r ON rc.recipe_id = r.id AND r.published = true
    GROUP BY c.id, c.name
    ORDER BY count DESC
  `

  console.log('\nFinal category distribution:')
  distribution.forEach(row => {
    console.log(`${row.name}: ${row.count} recipes`)
  })
}

async function main() {
  try {
    await categorizeRecipes()
    console.log('\n🎉 Recipe categorization completed!')

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
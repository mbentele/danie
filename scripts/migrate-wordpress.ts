import { parseStringPromise } from 'xml2js'
import * as cheerio from 'cheerio'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { db } from '../lib/db'
import { recipes, categories, recipeCategories } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { slugify } from 'transliteration'

interface WordPressItem {
  title: string[]
  'wp:post_id': string[]
  'wp:post_name': string[]
  'wp:post_parent': string[]
  'wp:post_type': string[]
  'wp:status': string[]
  'wp:post_date': string[]
  'wp:post_modified': string[]
  'content:encoded': string[]
  'excerpt:encoded': string[]
  link: string[]
  'wp:attachment_url'?: string[]
  'wp:postmeta'?: Array<{
    'wp:meta_key': string[]
    'wp:meta_value': string[]
  }>
}

interface ParsedRecipe {
  wpPostId: number
  title: string
  slug: string
  ingredients: string[]
  instructions: string[]
  featuredImage?: string
  images: string[]
  categorySlug?: string
  createdAt: Date
  updatedAt: Date
  wpUrl: string
  cookingTime?: number
  servings?: number
  difficulty?: string
}

// German category mapping from WordPress slugs to readable names
const CATEGORY_MAPPING = {
  'alltagskueche': { name: 'Alltagsküche', description: 'Einfache Rezepte für jeden Tag' },
  'kuchen-suesses': { name: 'Kuchen & Süßes', description: 'Kuchen, Torten und süße Leckereien' },
  'ohne-brot-nix-los': { name: 'Brot & Gebäck', description: 'Brot, Brötchen und Gebäck' },
  'besondereanlaesse': { name: 'Besondere Anlässe', description: 'Rezepte für festliche Gelegenheiten' },
  'fruehstueck': { name: 'Frühstück', description: 'Der perfekte Start in den Tag' },
  'kuechengeschenke': { name: 'Küchengeschenke', description: 'Selbstgemachte Geschenke aus der Küche' },
  'kuechen-basics': { name: 'Küchen-Basics', description: 'Grundlagen und Basisrezepte' },
  'rezepte-fuer-besondere-anlaesse': { name: 'Festliche Rezepte', description: 'Besondere Rezepte für besondere Momente' }
}

class WordPressMigration {
  private xmlData: any
  private categoryMap = new Map<string, string>() // parent post id -> category slug
  private recipeCount = 0

  async parseXML(filePath: string): Promise<void> {
    console.log('📖 Parsing WordPress XML export...')
    const xmlContent = readFileSync(filePath, 'utf-8')
    this.xmlData = await parseStringPromise(xmlContent)
    console.log('✅ XML parsed successfully')
  }

  private extractFromDiviContent(content: string): { ingredients: string[], instructions: string[], images: string[] } {
    // Remove Divi shortcodes and extract clean HTML
    let cleanContent = content
      .replace(/\[et_pb_[^\]]+\]/g, '') // Remove opening Divi shortcodes
      .replace(/\[\/et_pb_[^\]]*\]/g, '') // Remove closing Divi shortcodes
      .replace(/&nbsp;/g, ' ')
      .trim()

    const $ = cheerio.load(cleanContent)

    // Extract ingredients
    const ingredients: string[] = []
    $('h2, h3, h4').each((_, element) => {
      const heading = $(element).text().trim().toLowerCase()
      if (heading.includes('zutaten') || heading.includes('ingredients')) {
        const nextList = $(element).next('ul')
        if (nextList.length) {
          nextList.find('li').each((_, li) => {
            const ingredient = $(li).text().trim()
            if (ingredient) ingredients.push(ingredient)
          })
        }
      }
    })

    // Extract instructions
    const instructions: string[] = []
    $('h2, h3, h4').each((_, element) => {
      const heading = $(element).text().trim().toLowerCase()
      if (heading.includes('zubereitung') || heading.includes('anleitung') || heading.includes('preparation')) {
        let nextElement = $(element).next()
        while (nextElement.length && !nextElement.is('h1, h2, h3, h4')) {
          if (nextElement.is('p') && nextElement.text().trim()) {
            instructions.push(nextElement.text().trim())
          }
          nextElement = nextElement.next()
        }
      }
    })

    // Extract images from img tags
    const images: string[] = []
    $('img').each((_, img) => {
      const src = $(img).attr('src')
      if (src && src.includes('danie.de')) {
        images.push(src)
      }
    })

    return { ingredients, instructions, images }
  }

  private parseRecipe(item: WordPressItem): ParsedRecipe | null {
    try {
      const title = item.title?.[0]?.trim()
      const postId = parseInt(item['wp:post_id'][0])
      const slug = item['wp:post_name'][0]
      const parentId = item['wp:post_parent'][0]
      const content = item['content:encoded']?.[0] || ''
      const wpUrl = item.link[0]

      if (!title || !content) return null

      // Extract structured content
      const { ingredients, instructions, images } = this.extractFromDiviContent(content)

      if (ingredients.length === 0 || instructions.length === 0) {
        console.log(`⚠️ Skipping "${title}" - missing ingredients or instructions`)
        return null
      }

      // Get category from parent mapping
      const categorySlug = this.categoryMap.get(parentId)

      // Extract cooking metadata from content
      const cookingTime = this.extractCookingTime(content)
      const servings = this.extractServings(content)

      return {
        wpPostId: postId,
        title,
        slug: slugify(slug),
        ingredients,
        instructions,
        featuredImage: images[0],
        images,
        categorySlug,
        createdAt: new Date(item['wp:post_date'][0]),
        updatedAt: new Date(item['wp:post_modified'][0]),
        wpUrl,
        cookingTime,
        servings
      }
    } catch (error) {
      console.error(`Error parsing recipe:`, error)
      return null
    }
  }

  private extractCookingTime(content: string): number | undefined {
    const timeMatch = content.match(/(\d+)\s*(min|minuten|stunden|std)/i)
    if (timeMatch) {
      const time = parseInt(timeMatch[1])
      const unit = timeMatch[2].toLowerCase()
      if (unit.includes('std') || unit.includes('stunden')) {
        return time * 60 // Convert hours to minutes
      }
      return time
    }
    return undefined
  }

  private extractServings(content: string): number | undefined {
    const servingsMatch = content.match(/(\d+)\s*(personen|portionen|stück)/i)
    return servingsMatch ? parseInt(servingsMatch[1]) : undefined
  }

  private buildCategoryMap(): void {
    console.log('🗂️ Building category mapping...')

    const items = this.xmlData.rss.channel[0].item as WordPressItem[]

    items.forEach(item => {
      if (item['wp:post_type'][0] === 'page' && item['wp:post_parent'][0] === '0') {
        const slug = item['wp:post_name'][0]
        const postId = item['wp:post_id'][0]

        if (CATEGORY_MAPPING[slug as keyof typeof CATEGORY_MAPPING]) {
          this.categoryMap.set(postId, slug)
          console.log(`📁 Category: ${slug} (ID: ${postId})`)
        }
      }
    })

    // Map child pages to categories
    items.forEach(item => {
      const parentId = item['wp:post_parent'][0]
      if (parentId !== '0' && this.categoryMap.has(parentId)) {
        const categorySlug = this.categoryMap.get(parentId)!
        this.categoryMap.set(item['wp:post_id'][0], categorySlug)
      }
    })

    console.log(`✅ Built category mapping for ${this.categoryMap.size} items`)
  }

  async createCategories(): Promise<void> {
    console.log('📝 Creating recipe categories...')

    for (const [slug, data] of Object.entries(CATEGORY_MAPPING)) {
      try {
        await db.insert(categories).values({
          name: data.name,
          slug,
          description: data.description
        }).onConflictDoNothing()

        console.log(`✅ Category: ${data.name}`)
      } catch (error) {
        console.error(`Error creating category ${slug}:`, error)
      }
    }
  }

  async migrateRecipes(): Promise<void> {
    console.log('🚀 Starting recipe migration...')

    const items = this.xmlData.rss.channel[0].item as WordPressItem[]
    const recipePages = items.filter(item =>
      item['wp:post_type'][0] === 'page' &&
      item['wp:status'][0] === 'publish' &&
      item['wp:post_parent'][0] !== '0' // Has a parent (is a recipe)
    )

    console.log(`📊 Found ${recipePages.length} potential recipe pages`)

    const validRecipes: ParsedRecipe[] = []

    for (const item of recipePages) {
      const recipe = this.parseRecipe(item)
      if (recipe) {
        validRecipes.push(recipe)
        this.recipeCount++

        if (this.recipeCount % 50 === 0) {
          console.log(`📈 Processed ${this.recipeCount} recipes...`)
        }
      }
    }

    console.log(`✅ Parsed ${validRecipes.length} valid recipes`)

    // Insert recipes in batches
    const batchSize = 10
    for (let i = 0; i < validRecipes.length; i += batchSize) {
      const batch = validRecipes.slice(i, i + batchSize)

      try {
        for (const recipe of batch) {
          // Find category ID
          const categoryResult = await db.select().from(categories)
            .where(eq(categories.slug, recipe.categorySlug || 'alltagskueche'))
            .limit(1)

          const categoryId = categoryResult[0]?.id

          // Insert recipe
          const [insertedRecipe] = await db.insert(recipes).values({
            title: recipe.title,
            slug: recipe.slug,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            featuredImage: recipe.featuredImage,
            images: recipe.images,
            cookTime: recipe.cookingTime,
            servings: recipe.servings,
            difficulty: 'medium',
            published: true,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
            wpPostId: recipe.wpPostId,
            wpUrl: recipe.wpUrl
          }).returning().onConflictDoNothing()

          // Create recipe-category relationship if both exist
          if (insertedRecipe && categoryId) {
            await db.insert(recipeCategories).values({
              recipeId: insertedRecipe.id,
              categoryId
            }).onConflictDoNothing()
          }
        }

        console.log(`💾 Saved batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(validRecipes.length/batchSize)}`)

      } catch (error) {
        console.error(`Error saving batch:`, error)
      }
    }

    console.log(`🎉 Migration complete! Migrated ${validRecipes.length} recipes`)
  }

  async run(xmlFilePath: string): Promise<void> {
    try {
      console.log('🚀 Starting WordPress to Next.js migration...')
      console.log(`📁 XML file: ${xmlFilePath}`)

      await this.parseXML(xmlFilePath)
      this.buildCategoryMap()
      await this.createCategories()
      await this.migrateRecipes()

      console.log('✨ Migration completed successfully!')

      // Generate summary report
      const summary = {
        timestamp: new Date().toISOString(),
        recipesProcessed: this.recipeCount,
        categoriesCreated: Object.keys(CATEGORY_MAPPING).length,
        status: 'completed'
      }

      writeFileSync(
        join(process.cwd(), 'migration-summary.json'),
        JSON.stringify(summary, null, 2)
      )

    } catch (error) {
      console.error('💥 Migration failed:', error)
      throw error
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const xmlPath = process.argv[2] || './migration/danieskche.WordPress.2025-09-25.xml'

  const migration = new WordPressMigration()
  migration.run(xmlPath).catch(console.error)
}

export { WordPressMigration }
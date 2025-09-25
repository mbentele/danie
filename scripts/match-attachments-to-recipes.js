#!/usr/bin/env node

/**
 * Match WordPress attachments to recipes
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function extractAttachmentsFromXML() {
  console.log('📖 Extracting attachments from WordPress XML...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    console.log(`✅ Loaded XML file (${Math.round(xmlContent.length / 1024)}KB)`)

    const attachments = []

    // Find all attachment items
    const itemRegex = /<item>([\\s\\S]*?)<\\/item>/g
    let match

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemContent = match[1]

      // Check if it's an attachment
      if (itemContent.includes('<wp:post_type><![CDATA[attachment]]></wp:post_type>')) {

        // Extract attachment info
        const titleMatch = itemContent.match(/<title><!\\[CDATA\\[(.*?)\\]\\]><\\/title>/)
        const filenameMatch = itemContent.match(/<wp:post_name><!\\[CDATA\\[(.*?)\\]\\]><\\/wp:post_name>/)
        const urlMatch = itemContent.match(/<wp:attachment_url><!\\[CDATA\\[(.*?)\\]\\]><\\/wp:attachment_url>/)

        if (titleMatch && filenameMatch && urlMatch) {
          const title = titleMatch[1]
          const filename = filenameMatch[1]
          const url = urlMatch[1]

          // Only include recipe-related images (not logos, icons, etc.)
          if (!filename.includes('logo') &&
              !filename.includes('icon') &&
              !filename.includes('schriftzug') &&
              (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png'))) {

            attachments.push({
              title,
              filename,
              url
            })
          }
        }
      }
    }

    console.log(`🖼️  Found ${attachments.length} recipe-related attachments`)

    return attachments

  } catch (error) {
    console.error('❌ Error extracting attachments:', error)
    return []
  }
}

async function matchAttachmentsToRecipes(attachments) {
  console.log('🔗 Matching attachments to recipes...')

  try {
    // Get all recipes
    const recipes = await sql`
      SELECT id, title, slug, wp_post_id
      FROM recipes
      WHERE published = true
    `

    console.log(`📊 Processing ${recipes.length} recipes`)

    let updatedCount = 0

    for (const recipe of recipes) {
      // Find matching attachments for this recipe
      const matchingAttachments = attachments.filter(attachment => {
        const recipeWords = recipe.title.toLowerCase()
          .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
          .split(/[^a-z0-9]+/)
          .filter(word => word.length > 3) // Only words longer than 3 chars

        const attachmentName = attachment.filename.toLowerCase()
        const attachmentTitle = attachment.title.toLowerCase()

        // Check if any recipe words appear in attachment name or title
        return recipeWords.some(word =>
          attachmentName.includes(word) ||
          attachmentTitle.includes(word) ||
          attachmentName.includes(word.substring(0, 6)) // partial match
        )
      })

      if (matchingAttachments.length > 0) {
        // Limit to 3 images per recipe
        const limitedAttachments = matchingAttachments.slice(0, 3)
        const featuredImage = limitedAttachments[0].url
        const galleryImages = limitedAttachments.slice(1).map(att => att.url)

        await sql`
          UPDATE recipes
          SET
            featured_image = ${featuredImage},
            images = ${JSON.stringify(galleryImages)}
          WHERE id = ${recipe.id}
        `

        updatedCount++
        console.log(`✅ ${recipe.title}: ${limitedAttachments.length} REAL images matched`)
        limitedAttachments.forEach((att, i) => {
          console.log(`   ${i + 1}. ${att.url}`)
        })
      }
    }

    console.log(`\\n📊 Updated ${updatedCount} recipes with REAL attachment URLs`)
    return updatedCount

  } catch (error) {
    console.error('❌ Error matching attachments:', error)
    return 0
  }
}

async function main() {
  console.log('🔗 WordPress Attachment to Recipe Matcher')
  console.log('==========================================')

  try {
    // Extract all attachments
    const attachments = await extractAttachmentsFromXML()

    if (attachments.length === 0) {
      console.log('❌ No attachments found')
      return
    }

    // Show some examples
    console.log('\\n📝 Sample attachments:')
    attachments.slice(0, 10).forEach((att, i) => {
      console.log(`${i + 1}. ${att.filename} → ${att.url}`)
    })

    // Match to recipes
    const updatedCount = await matchAttachmentsToRecipes(attachments)

    console.log('\\n🎉 Attachment matching completed!')
    console.log(`📊 Found: ${attachments.length} attachments`)
    console.log(`📊 Matched: ${updatedCount} recipes`)

    if (updatedCount === 0) {
      console.log('\\n⚠️  No matches found. Recipe titles might not match attachment names.')
      console.log('Let me try a more flexible matching approach...')
    }

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
#!/usr/bin/env node

/**
 * Extract REAL post-image relationships from WordPress XML content
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs').promises
const path = require('path')
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function analyzeXMLStructure() {
  console.log('📖 Analyzing WordPress XML structure...')

  try {
    const xmlPath = path.join(__dirname, '../migration/danieskche.WordPress.2025-09-25.xml')
    const xmlContent = await fs.readFile(xmlPath, 'utf8')

    // Find a post with content to understand structure
    const postMatch = xmlContent.match(/<item>[\s\S]*?<wp:post_type><!?\[CDATA\[?post\]?\]?><\/wp:post_type>[\s\S]*?<content:encoded><!?\[CDATA\[([\s\S]*?)\]?\]?><\/content:encoded>[\s\S]*?<\/item>/)

    if (postMatch) {
      const content = postMatch[1]
      console.log('Sample post content structure:')
      console.log('=================================')
      console.log(content.substring(0, 500) + '...')

      // Look for image patterns
      const imageMatches = content.match(/https?:\/\/[^\s<>"']*\.(jpg|jpeg|png|gif)/gi)
      if (imageMatches) {
        console.log('\nFound image URLs in content:')
        imageMatches.forEach(url => console.log(`- ${url}`))
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

analyzeXMLStructure()
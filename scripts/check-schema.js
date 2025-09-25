#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function checkSchema() {
  console.log('📊 Database Schema Analysis')
  console.log('============================')

  try {
    // Get table columns
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'recipes'
      ORDER BY ordinal_position
    `

    console.log('\\n🗂️  Recipes table columns:')
    columns.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(required)'}`)
    })

    // Get sample recipe
    const sample = await sql`SELECT * FROM recipes LIMIT 1`

    if (sample.length > 0) {
      console.log('\\n📝 Sample recipe data:')
      const recipe = sample[0]
      Object.keys(recipe).forEach(key => {
        const value = recipe[key]
        const preview = value ? String(value).substring(0, 100) : 'null'
        console.log(`   ${key}: ${preview}${String(value).length > 100 ? '...' : ''}`)
      })
    }

  } catch (error) {
    console.error('❌ Schema error:', error)
  }
}

checkSchema()
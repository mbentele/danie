import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { recipes, categories, recipeCategories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = db
      .select({
        recipe: recipes,
        category: categories,
      })
      .from(recipes)
      .leftJoin(recipeCategories, eq(recipes.id, recipeCategories.recipeId))
      .leftJoin(categories, eq(recipeCategories.categoryId, categories.id))
      .where(eq(recipes.published, true))
      .orderBy(desc(recipes.updatedAt))

    // Add filters if provided
    if (category) {
      query = query.where(eq(categories.slug, category))
    }

    if (search) {
      // This would need to be implemented properly with SQL LIKE or full-text search
      // For now, we'll skip search filtering in the API and handle it client-side
    }

    const recipesData = await query
      .offset(offset)
      .limit(limit)

    return NextResponse.json({
      recipes: recipesData,
      hasMore: recipesData.length === limit // Simple check - if we got less than limit, no more data
    })

  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}
'use client'

import { Clock, Users, ChefHat, Heart, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Recipe {
  id: string
  title: string
  slug: string
  description?: string
  ingredients: string[]
  instructions: string[]
  servings?: number
  prepTime?: number
  cookTime?: number
  totalTime?: number
  difficulty: string
  featuredImage?: string
  images: string[]
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
  wpPostId?: number
  wpUrl?: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
}

interface RecipeCardProps {
  recipe: Recipe
  category?: Category | null
}

export function RecipeCard({ recipe, category }: RecipeCardProps) {
  const totalTime = recipe.totalTime || (recipe.cookTime || 0) + (recipe.prepTime || 0)

  // Parse images if it's a JSON string
  let parsedImages = recipe.images
  if (typeof recipe.images === 'string') {
    try {
      parsedImages = JSON.parse(recipe.images)
    } catch (e) {
      parsedImages = []
    }
  }

  // Fallback image if no featured image
  const imageUrl = recipe.featuredImage || parsedImages?.[0] || '/images/recipe-placeholder.svg'

  // Difficulty colors
  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100'
  }

  const difficultyLabels = {
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Schwer'
  }

  return (
    <div className="glass rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200">
      <Link href={`/rezepte/${recipe.slug}`}>
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            unoptimized={false}
          />

          {/* Overlays */}
          <div className="absolute top-4 left-4 flex gap-2">
            {/* Category Badge */}
            {category && (
              <span
                className="px-3 py-1 rounded-full text-sm font-hoss font-semibold text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}

            {/* Featured Badge */}
            {recipe.featured && (
              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-hoss font-semibold flex items-center gap-1">
                <Star size={14} fill="currentColor" />
                Highlight
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
            <Heart size={18} />
          </button>

          {/* Difficulty Badge */}
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-hoss font-semibold ${difficultyColors[recipe.difficulty as keyof typeof difficultyColors]}`}>
              {difficultyLabels[recipe.difficulty as keyof typeof difficultyLabels] || recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-fatfrank text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className="text-gray-600 font-hoss text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Ingredients Preview */}
          <div className="mb-4">
            <p className="text-gray-500 font-hoss text-sm">
              <span className="font-semibold">{recipe.ingredients?.length || 0} Zutaten</span>
              {recipe.ingredients?.length > 0 && (
                <span> • {recipe.ingredients.slice(0, 2).join(', ')}{recipe.ingredients.length > 2 ? '...' : ''}</span>
              )}
            </p>
          </div>

          {/* Recipe Info */}
          <div className="flex items-center justify-between text-gray-500 font-hoss text-sm">
            <div className="flex items-center space-x-4">
              {/* Time */}
              {totalTime > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{totalTime}min</span>
                </div>
              )}

              {/* Servings */}
              {recipe.servings && (
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{recipe.servings}</span>
                </div>
              )}
            </div>

            {/* Instructions Count */}
            <div className="flex items-center space-x-1">
              <ChefHat size={16} />
              <span>{recipe.instructions?.length || 0} Schritte</span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  )
}
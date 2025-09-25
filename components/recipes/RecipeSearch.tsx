'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import { cleanWordPressShortcodes } from '@/lib/utils'

interface Recipe {
  id: string
  title: string
  slug: string
  description?: string
  featuredImage?: string
  servings?: number
  totalTime?: number
  difficulty?: string
  published: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface RecipeSearchProps {
  initialRecipes: any[]
  categories: Category[]
}

export function RecipeSearch({ initialRecipes, categories }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState(initialRecipes)
  const [displayCount, setDisplayCount] = useState(50)

  // Filter recipes based on search query and category
  useEffect(() => {
    let filtered = initialRecipes

    // Apply both filters sequentially
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(({ recipe }) =>
        recipe.title.toLowerCase().includes(query) ||
        (recipe.description && recipe.description.toLowerCase().includes(query))
      )
    }

    // Filter by category (after search filter)
    if (selectedCategory) {
      filtered = filtered.filter(({ category }) =>
        category && category.slug === selectedCategory
      )
    }

    setFilteredRecipes(filtered)
    setDisplayCount(50) // Reset display count when filters change
  }, [searchQuery, selectedCategory, initialRecipes])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? '' : categorySlug)
  }

  const handleLoadMore = () => {
    setDisplayCount(displayCount + 50)
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rezept suchen... (z.B. 'Käsekuchen', 'Apfel', 'Brot')"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-hoss"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-hoss font-medium transition-colors ${
              !selectedCategory
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alle ({initialRecipes.length})
          </button>
          {categories.map((category) => {
            const categoryCount = initialRecipes.filter(({ category: recipeCategory }) =>
              recipeCategory && recipeCategory.slug === category.slug
            ).length

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-hoss font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.slug ? category.color : undefined
                }}
              >
                {category.name} ({categoryCount})
              </button>
            )
          })}
        </div>

        {/* Results Info */}
        <div className="mt-4 text-sm text-gray-600 font-hoss">
          <span>Zeige {filteredRecipes.length} Rezepte</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecipes.slice(0, displayCount).map(({ recipe, category }) => (
          <div key={recipe.id} className="group">
            <a href={`/rezepte/${recipe.slug}`} className="block">
              <div className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-orange-100">
                  {recipe.featuredImage ? (
                    <img
                      src={recipe.featuredImage}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-lg text-gray-500 font-hoss">Kein Bild</div>
                    </div>
                  )}

                  {/* Category Badge */}
                  {category && (
                    <div className="absolute top-3 right-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-hoss font-semibold text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-fatfrank text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {recipe.title}
                  </h3>

                  {recipe.description && (
                    <p className="text-gray-600 font-hoss text-sm mb-4 line-clamp-2">
                      {cleanWordPressShortcodes(recipe.description)}
                    </p>
                  )}

                  {/* Recipe Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 font-hoss">
                    {recipe.totalTime && (
                      <span className="flex items-center space-x-1">
                        <span>Zeit:</span>
                        <span>{recipe.totalTime}min</span>
                      </span>
                    )}
                    {recipe.servings && recipe.servings !== 4 && (
                      <span className="flex items-center space-x-1">
                        <span>Portionen:</span>
                        <span>{recipe.servings}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < filteredRecipes.length && (
        <div className="text-center py-8">
          <button
            onClick={handleLoadMore}
            className="glass px-8 py-3 rounded-2xl text-lg font-hoss font-semibold text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-colors"
          >
            Weitere Rezepte laden ({filteredRecipes.length - displayCount} weitere verfügbar)
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-fatfrank text-gray-600 mb-4">
            Keine Rezepte gefunden
          </h3>
          <p className="text-gray-500 font-hoss mb-6">
            Versuche es mit anderen Suchbegriffen oder wähle eine andere Kategorie.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('')
            }}
            className="btn-primary font-hoss font-semibold"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  )
}
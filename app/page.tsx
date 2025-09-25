import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedRecipes } from '@/components/home/FeaturedRecipes'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { SearchSection } from '@/components/home/SearchSection'
import { InstagramFeed } from '@/components/home/InstagramFeed'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section with Dynamic Content */}
      <HeroSection />

      {/* Smart Search */}
      <SearchSection />

      {/* Featured/Trending Recipes */}
      <FeaturedRecipes />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Instagram Integration */}
      <InstagramFeed />
    </div>
  )
}
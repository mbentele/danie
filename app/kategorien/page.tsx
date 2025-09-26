import Link from 'next/link'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'

async function getCategories() {
  try {
    return await db.select().from(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const metadata = {
  title: 'Alle Kategorien',
  description: 'Entdecke Rezepte nach Kategorien sortiert - finde genau das was du suchst.',
}

export default async function KategorienPage() {
  const categoriesData = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-fatfrank text-gradient mb-4">
            Alle Kategorien
          </h1>
          <p className="text-xl text-gray-600 font-hoss max-w-2xl mx-auto">
            Entdecke Rezepte nach Kategorien sortiert - finde genau das was du suchst.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category) => (
            <Link
              key={category.id}
              href={`/kategorien/${category.slug}`}
              className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl group"
            >
              <div
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-white text-2xl font-fatfrank"
                style={{ backgroundColor: category.color }}
              >
                {category.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-fatfrank text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-600 font-hoss">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
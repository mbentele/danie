import { db } from './index';
import { categories, tags, recipes } from './schema';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Initial Categories (basierend auf typischen Food Blog Kategorien)
  const initialCategories = [
    {
      name: 'Hauptgerichte',
      slug: 'hauptgerichte',
      description: 'Herzhafte Hauptmahlzeiten für jeden Tag',
      color: '#ef4444'
    },
    {
      name: 'Desserts',
      slug: 'desserts',
      description: 'Süße Nachspeisen und Kuchen',
      color: '#ec4899'
    },
    {
      name: 'Vorspeisen',
      slug: 'vorspeisen',
      description: 'Leichte Gerichte zum Start',
      color: '#10b981'
    },
    {
      name: 'Snacks',
      slug: 'snacks',
      description: 'Kleine Häppchen für zwischendurch',
      color: '#f59e0b'
    },
    {
      name: 'Getränke',
      slug: 'getraenke',
      description: 'Erfrischende und warme Getränke',
      color: '#3b82f6'
    }
  ];

  // Initial Tags für flexible Kategorisierung
  const initialTags = [
    // Dietary
    { name: 'Vegetarisch', slug: 'vegetarisch', type: 'diet' },
    { name: 'Vegan', slug: 'vegan', type: 'diet' },
    { name: 'Glutenfrei', slug: 'glutenfrei', type: 'diet' },
    { name: 'Laktosefrei', slug: 'laktosefrei', type: 'diet' },

    // Difficulty
    { name: 'Einfach', slug: 'einfach', type: 'difficulty' },
    { name: 'Mittel', slug: 'mittel', type: 'difficulty' },
    { name: 'Schwer', slug: 'schwer', type: 'difficulty' },

    // Time
    { name: 'Unter 15 Min', slug: 'unter-15-min', type: 'time' },
    { name: 'Unter 30 Min', slug: 'unter-30-min', type: 'time' },
    { name: 'Über 1 Stunde', slug: 'ueber-1-stunde', type: 'time' },

    // Occasion
    { name: 'Feierabend', slug: 'feierabend', type: 'occasion' },
    { name: 'Wochenende', slug: 'wochenende', type: 'occasion' },
    { name: 'Gäste', slug: 'gaeste', type: 'occasion' },
    { name: 'Comfort Food', slug: 'comfort-food', type: 'occasion' }
  ];

  try {
    // Insert categories
    console.log('📁 Creating categories...');
    await db.insert(categories).values(initialCategories);

    // Insert tags
    console.log('🏷️ Creating tags...');
    await db.insert(tags).values(initialTags);

    console.log('✅ Database seeded successfully!');

    return {
      categories: initialCategories.length,
      tags: initialTags.length
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
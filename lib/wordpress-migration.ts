// WordPress URL Structure Migration Mapping
export const wordpressCategories = {
  'ohne-brot-nix-los': {
    name: 'Ohne Brot nix los',
    slug: 'brot-backwaren',
    description: 'Leckere Brot- und Backwarenrezepte',
    color: '#f59e0b'
  },
  'kuchen-suesses': {
    name: 'Kuchen & Süßes',
    slug: 'desserts',
    description: 'Süße Verführungen und Kuchen',
    color: '#ec4899'
  },
  'alltagskueche': {
    name: 'Alltagsküche',
    slug: 'hauptgerichte',
    description: 'Praktische Rezepte für jeden Tag',
    color: '#ef4444'
  },
  'fruehstueck': {
    name: 'Frühstück',
    slug: 'fruehstueck',
    description: 'Perfekter Start in den Tag',
    color: '#f97316'
  },
  'kuechen-basics': {
    name: 'Küchen-Basics',
    slug: 'basics',
    description: 'Grundlagen für die Küche',
    color: '#10b981'
  },
  'kuechengeschenke': {
    name: 'Küchengeschenke',
    slug: 'geschenke',
    description: 'Selbstgemachte Geschenke aus der Küche',
    color: '#8b5cf6'
  },
  'rezepte-fuer-besondere-anlaesse': {
    name: 'Besondere Anlässe',
    slug: 'besondere-anlaesse',
    description: 'Rezepte für Feiertage und Events',
    color: '#06b6d4'
  }
}

// Known WordPress Recipe URLs for Migration
export const knownWordPressRecipes = [
  // Ohne Brot nix los
  '/meine-kueche/ohne-brot-nix-los/weisse-schoko-zitronen-cookies/',
  '/meine-kueche/ohne-brot-nix-los/schoko-zimt-schnecken/',
  '/meine-kueche/ohne-brot-nix-los/mini-donuts/',
  '/meine-kueche/ohne-brot-nix-los/lemon-posset/',

  // Kuchen & Süßes
  '/meine-kueche/kuchen-suesses/schoko-zimt-schnecken/',
  '/meine-kueche/kuchen-suesses/mini-donuts/',
  '/meine-kueche/kuchen-suesses/lemon-posset/',

  // Alltagsküche
  '/meine-kueche/alltagskueche/schnelle-gnocchi-pfanne/',
  '/meine-kueche/alltagskueche/pasta-mit-brokkoli/',
  '/meine-kueche/alltagskueche/ratatouille/',

  // Frühstück
  '/meine-kueche/fruehstueck/overnight-oats/',
  '/meine-kueche/fruehstueck/pancakes/',
  '/meine-kueche/fruehstueck/granola/',

  // Add more known recipes...
]

// URL Migration Helper
export function migrateWordPressUrl(wpUrl: string): string {
  // Remove /meine-kueche/ prefix and map to new structure
  const urlPart = wpUrl.replace('/meine-kueche/', '')

  for (const [wpSlug, category] of Object.entries(wordpressCategories)) {
    if (urlPart.startsWith(wpSlug)) {
      const recipeName = urlPart.replace(`${wpSlug}/`, '').replace('/', '')
      return `/rezepte/${category.slug}/${recipeName}`
    }
  }

  // Fallback: direct recipe URL
  return `/rezepte/${urlPart.replace('/', '')}`
}

// Generate Next.js redirects for WordPress URLs
export function generateWordPressRedirects() {
  return knownWordPressRecipes.map(wpUrl => ({
    source: wpUrl,
    destination: migrateWordPressUrl(wpUrl),
    permanent: true
  }))
}
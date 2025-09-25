#!/usr/bin/env tsx

/**
 * WordPress XML Export Analyzer for danie.de
 *
 * Analyzes the WordPress export to extract:
 * - All recipes (posts)
 * - Categories and taxonomies
 * - Images and media
 * - Author information
 * - URL structure
 */

import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';

interface WordPressPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishDate: string;
  status: string;
  author: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  customFields?: { [key: string]: string };
}

interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
  parent?: string;
}

interface AnalysisResult {
  posts: WordPressPost[];
  categories: WordPressCategory[];
  totalPosts: number;
  publishedPosts: number;
  authors: string[];
  dateRange: { earliest: string; latest: string };
}

function parseWordPressXML(xmlPath: string): AnalysisResult {
  console.log('📖 Reading WordPress export XML...');

  const xmlContent = readFileSync(xmlPath, 'utf-8');

  // Extract basic info with regex (simple XML parsing for analysis)
  const posts: WordPressPost[] = [];
  const categories: WordPressCategory[] = [];
  const authors = new Set<string>();

  // Extract categories
  const categoryMatches = xmlContent.matchAll(/<wp:category>.*?<\/wp:category>/gs);
  for (const match of categoryMatches) {
    const catXml = match[0];
    const id = catXml.match(/<wp:term_id>(\d+)<\/wp:term_id>/)?.[1] || '';
    const name = catXml.match(/<wp:cat_name><!\[CDATA\[(.*?)\]\]><\/wp:cat_name>/)?.[1] || '';
    const slug = catXml.match(/<wp:category_nicename><!\[CDATA\[(.*?)\]\]><\/wp:category_nicename>/)?.[1] || '';
    const parent = catXml.match(/<wp:category_parent><!\[CDATA\[(.*?)\]\]><\/wp:category_parent>/)?.[1] || '';

    if (name && slug) {
      categories.push({
        id,
        name,
        slug,
        parent: parent || undefined
      });
    }
  }

  // Extract posts
  const itemMatches = xmlContent.matchAll(/<item>.*?<\/item>/gs);
  const publishDates: Date[] = [];

  for (const match of itemMatches) {
    const itemXml = match[0];

    // Skip if not a post
    const postType = itemXml.match(/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/)?.[1];
    if (postType !== 'post') continue;

    const id = itemXml.match(/<wp:post_id>(\d+)<\/wp:post_id>/)?.[1] || '';
    const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '';
    const slug = itemXml.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/)?.[1] || '';
    const content = itemXml.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s)?.[1] || '';
    const excerpt = itemXml.match(/<excerpt:encoded><!\[CDATA\[(.*?)\]\]><\/excerpt:encoded>/s)?.[1] || '';
    const status = itemXml.match(/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/)?.[1] || '';
    const author = itemXml.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/)?.[1] || '';
    const pubDate = itemXml.match(/<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/)?.[1] || '';

    // Extract categories for this post
    const postCategories: string[] = [];
    const categoryMatches = itemXml.matchAll(/<category domain="category" nicename="(.*?)"><!\[CDATA\[(.*?)\]\]><\/category>/g);
    for (const catMatch of categoryMatches) {
      postCategories.push(catMatch[2]);
    }

    if (title && slug) {
      posts.push({
        id,
        title,
        slug,
        content,
        excerpt,
        publishDate: pubDate,
        status,
        author,
        categories: postCategories,
        tags: [] // TODO: extract tags if needed
      });

      authors.add(author);
      if (pubDate) {
        publishDates.push(new Date(pubDate));
      }
    }
  }

  // Calculate date range
  publishDates.sort((a, b) => a.getTime() - b.getTime());
  const dateRange = {
    earliest: publishDates[0]?.toISOString() || '',
    latest: publishDates[publishDates.length - 1]?.toISOString() || ''
  };

  return {
    posts,
    categories,
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'publish').length,
    authors: Array.from(authors),
    dateRange
  };
}

function generateAnalysisReport(result: AnalysisResult): string {
  let report = `# WordPress Export Analysis - danie.de

## 📊 Statistics
- **Total Posts:** ${result.totalPosts}
- **Published Posts:** ${result.publishedPosts}
- **Draft Posts:** ${result.totalPosts - result.publishedPosts}
- **Categories:** ${result.categories.length}
- **Authors:** ${result.authors.join(', ')}
- **Date Range:** ${new Date(result.dateRange.earliest).toLocaleDateString()} - ${new Date(result.dateRange.latest).toLocaleDateString()}

## 📂 Categories Found
`;

  result.categories.forEach(cat => {
    report += `- **${cat.name}** (${cat.slug})${cat.parent ? ` - Parent: ${cat.parent}` : ''}\n`;
  });

  report += `\n## 📝 Sample Posts (First 10 Published)
`;

  const publishedPosts = result.posts.filter(p => p.status === 'publish').slice(0, 10);
  publishedPosts.forEach(post => {
    report += `
### ${post.title}
- **Slug:** ${post.slug}
- **Date:** ${new Date(post.publishDate).toLocaleDateString()}
- **Categories:** ${post.categories.join(', ')}
- **Content Length:** ${post.content.length} chars
- **URL:** /meine-kueche/${post.categories[0]?.toLowerCase().replace(/\s+/g, '-')}/${post.slug}/
`;
  });

  report += `\n## 🔄 Migration Recommendations

### URL Structure Mapping
Current WordPress structure: \`/meine-kueche/{category}/{recipe-slug}/\`
New Next.js structure: \`/rezepte/{modern-category}/{recipe-slug}\`

### Modern Category Mapping
`;

  // Suggest modern category mapping
  const categoryMappings = [
    { old: 'Alltagsküche', new: 'hauptgerichte', type: 'Nach Gang' },
    { old: 'Kuchen & Süßes', new: 'desserts', type: 'Nach Gang' },
    { old: 'Ohne Brot nix los', new: 'brot-backwaren', type: 'Nach Hauptzutat' },
    { old: 'Frühstück', new: 'fruehstueck', type: 'Nach Anlass' }
  ];

  categoryMappings.forEach(mapping => {
    report += `- ${mapping.old} → ${mapping.new} (${mapping.type})\n`;
  });

  return report;
}

// Main execution
async function main() {
  try {
    const xmlPath = './migration/danieskche.WordPress.2025-09-25.xml';
    console.log('🚀 Starting WordPress export analysis...');

    const analysis = parseWordPressXML(xmlPath);
    const report = generateAnalysisReport(analysis);

    // Write analysis report
    writeFileSync('./migration/analysis-report.md', report);
    console.log('📄 Analysis report written to: ./migration/analysis-report.md');

    // Write JSON data for migration scripts
    writeFileSync('./migration/posts-data.json', JSON.stringify(analysis.posts, null, 2));
    writeFileSync('./migration/categories-data.json', JSON.stringify(analysis.categories, null, 2));

    console.log('✅ Analysis complete!');
    console.log(`📊 Found ${analysis.publishedPosts} published recipes`);
    console.log(`📂 Found ${analysis.categories.length} categories`);

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { parseWordPressXML, generateAnalysisReport };
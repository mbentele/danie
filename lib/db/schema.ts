import { pgTable, text, integer, timestamp, boolean, json, uuid, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Recipe Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  color: text('color').default('#ec4899'), // Brand pink as default
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Recipe Tags Table (für flexible Kategorisierung)
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'diet', 'difficulty', 'time', 'occasion'
  createdAt: timestamp('created_at').defaultNow(),
});

// Main Recipes Table
export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  ingredients: json('ingredients').$type<string[]>().notNull(), // Array of ingredients
  instructions: json('instructions').$type<string[]>().notNull(), // Array of steps
  servings: integer('servings').default(4),
  prepTime: integer('prep_time'), // in minutes
  cookTime: integer('cook_time'), // in minutes
  totalTime: integer('total_time'), // in minutes
  difficulty: text('difficulty').default('medium'), // 'easy', 'medium', 'hard'

  // Images
  featuredImage: text('featured_image'), // Main recipe photo
  images: json('images').$type<string[]>().default([]), // Additional photos

  // SEO & Content
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),

  // Status
  published: boolean('published').default(false),
  featured: boolean('featured').default(false),

  // WordPress Migration
  wpPostId: integer('wp_post_id'), // Original WordPress post ID
  wpUrl: text('wp_url'), // Original WordPress URL

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  publishedAt: timestamp('published_at'),
}, (table) => ({
  titleIdx: index('recipe_title_idx').on(table.title),
  slugIdx: index('recipe_slug_idx').on(table.slug),
  publishedIdx: index('recipe_published_idx').on(table.published),
  createdAtIdx: index('recipe_created_at_idx').on(table.createdAt),
}));

// Recipe-Category Relationship (Many-to-Many)
export const recipeCategories = pgTable('recipe_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Recipe-Tag Relationship (Many-to-Many)
export const recipeTags = pgTable('recipe_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Ratings/Reviews (für später)
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  userName: text('user_name'),
  userEmail: text('user_email'),
  approved: boolean('approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Search/Analytics für KI Features
export const searchQueries = pgTable('search_queries', {
  id: uuid('id').primaryKey().defaultRandom(),
  query: text('query').notNull(),
  resultsCount: integer('results_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Zod Schemas für Type Safety
export const insertRecipeSchema = createInsertSchema(recipes);
export const selectRecipeSchema = createSelectSchema(recipes);
export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
export const insertTagSchema = createInsertSchema(tags);
export const selectTagSchema = createSelectSchema(tags);

// Types
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
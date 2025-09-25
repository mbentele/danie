# Danie.de - Modern Food Blog Website

## Overview

Danie.de is a modern, AI-powered German food blog website built with Next.js 14+ and TypeScript. The project aims to replace an existing WordPress site with a performance-optimized, SEO-friendly platform featuring intelligent recipe search, personalized recommendations, and a modern glassmorphism design. The site focuses on providing cooking inspiration for everyday meals and special occasions, targeting German-speaking food enthusiasts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 14** with App Router for server-side rendering and static site generation
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** with custom glassmorphism design system
- **Framer Motion** for smooth animations and transitions
- **React** 18+ with modern hooks and component patterns

### Styling and Design
- **Glassmorphism Design System**: Custom CSS classes using backdrop-filter and transparent overlays
- **Brand Colors**: Pink accent (#ec4899), light gray backgrounds (#f1f5f9), dark headers (#1f2937)
- **Typography**: Google Fonts (Inter) with plans for Adobe Fonts integration
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Component Library**: Custom components using Radix UI primitives for accessibility

### Database Architecture
- **PostgreSQL** as the primary database (via Neon or future IONOS hosting)
- **Drizzle ORM** for type-safe database operations and migrations
- **Schema Design**: Optimized for recipe content with flexible categorization
  - `recipes` table with JSON fields for ingredients and instructions
  - `categories` table for traditional categorization
  - `tags` table for flexible multi-type classification (diet, difficulty, time, occasion)
  - UUID primary keys for better performance and security

### Content Management
- **Smart Categorization**: Multi-dimensional recipe organization
  - By ingredient (pasta, meat, vegetables)
  - By dietary restrictions (vegetarian, vegan, gluten-free)
  - By cooking time (under 15 min, 30 min, 1 hour+)
  - By occasion (weeknight, weekend, guests)
  - By portions and comfort food categories
- **WordPress Migration Strategy**: Mapping existing URL structure to new taxonomy
- **SEO Optimization**: Structured data, meta tags, and German-focused content

### Performance Optimization
- **Static Site Generation**: Pre-built pages for better loading times
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic bundling optimization
- **Caching Strategy**: Built-in Next.js caching for static and dynamic content

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM with migration tools
- **framer-motion**: Animation library for smooth user interactions
- **lucide-react**: Icon library for consistent UI elements

### AI and Search
- **openai**: Integration for intelligent recipe search and content recommendations
- **marked**: Markdown processing for recipe content
- **react-markdown**: Markdown rendering in React components

### Development Tools
- **@tailwindcss/typography**: Enhanced typography styles for content
- **eslint-config-next**: Next.js-specific linting rules
- **sharp**: Image processing and optimization

### Planned Integrations
- **Instagram API**: For @daniesrezepte feed integration
- **Adobe Fonts**: Premium typography (Freight Sans Pro, Source Sans Pro)
- **Weather API**: For weather-based recipe recommendations
- **Analytics**: For user behavior tracking and content optimization

### Deployment Infrastructure
- **Current**: Replit for development and testing
- **Planned**: IONOS hosting for production (German hosting for GDPR compliance)
- **CDN**: Image optimization and delivery
- **SSL**: HTTPS encryption for security and SEO
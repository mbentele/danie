# Claude Commands für danie.de

Diese Datei enthält wichtige Commands für die Entwicklung von danie.de.

## 📋 Development Commands

```bash
# Lokale Entwicklung starten
npm run dev

# TypeScript Check
npm run lint

# Build für Production
npm run build

# Production Server starten
npm run start
```

## 🗄️ Database Commands

```bash
# Schema zu Neon Database pushen
npm run db:push

# Neue Migrations generieren
npm run db:generate

# Drizzle Studio öffnen (Database GUI)
npm run db:studio

# Database seeden (Initial-Daten)
npx tsx lib/db/seed.ts
```

## 🚀 Deployment Commands

```bash
# Git workflow für Replit Auto-Deploy
git add .
git commit -m "feat: your feature description"
git push origin main

# Branch für Features
git checkout -b feature/neue-funktion
git push -u origin feature/neue-funktion
```

## 🔧 Nützliche Scripts

```bash
# Alle Node Modules neu installieren
rm -rf node_modules package-lock.json
npm install

# TypeScript Errors checken
npx tsc --noEmit

# Tailwind CSS neu kompilieren
npm run build:css
```

## 📁 Wichtige Dateien

- `app/page.tsx` - Homepage
- `components/home/` - Homepage-Komponenten
- `lib/db/schema.ts` - Database Schema
- `lib/wordpress-migration.ts` - WordPress URL-Migration
- `.env.example` - Environment Variables Vorlage

## 🎯 Replit Setup

1. **Neues Replit-Projekt:**
   - Next.js Template wählen
   - `danie-website` als Name

2. **Database verknüpfen:**
   - Database → Neon PostgreSQL → Connect
   - `DATABASE_URL` automatisch in Secrets

3. **Repository verknüpfen:**
   - Version Control → Connect to GitHub
   - Repository: `https://github.com/mbentele/danie.git`

4. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://...  (automatisch von Neon)
   OPENAI_API_KEY=sk-...         (für KI-Features)
   NEXTAUTH_URL=https://danie-website.replit.app
   NEXTAUTH_SECRET=random-secret-key
   ```

## 🔄 WordPress Migration Workflow

```bash
# 1. WordPress-Daten analysieren
node scripts/analyze-wordpress.js

# 2. Rezepte importieren
node scripts/import-recipes.js

# 3. Bilder optimieren und migrieren
node scripts/migrate-images.js

# 4. URLs testen und Redirects erstellen
node scripts/test-redirects.js
```

## 🤖 KI-Features Commands

```bash
# OpenAI Test
node scripts/test-openai.js

# Search Index erstellen
node scripts/create-search-index.js

# Kategorien automatisch zuordnen
node scripts/auto-categorize.js
```

---

💡 **Tipp:** Diese Datei wird automatisch von Claude gelesen, um relevante Commands für das Projekt zu kennen.
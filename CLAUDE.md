# Claude Commands für danie.de

Diese Datei enthält wichtige Commands für die Entwicklung von danie.de.

## 🎉 Aktueller Status (25. Sept. 2024)

✅ **WordPress Migration abgeschlossen:**
- 480 Rezepte erfolgreich migriert mit korrekten Bildern
- Kategorisierung basierend auf WordPress-URL-Struktur implementiert
- Lightbox-Funktionalität für Rezeptbilder funktionsfähig
- WordPress-Shortcode-Bereinigung implementiert
- Nährwerte-Extraktion aus deutschen Rezepttexten

✅ **Suchfunktionalität:**
- Intelligente Suche mit Kategoriefilterung
- Client-side Filtering mit "Weitere laden"-Button (50 Rezepte + Nachladen)
- Korrekte Kategoriezählung für alle 480+ Rezepte

✅ **Serving Size Extraktion:**
- 29 Rezepte mit korrekten Portionsangaben aus Titeln extrahiert
- Nur sinnvolle Portionsangaben werden angezeigt (nicht Standard-4)
- Pattern-Matching für deutsche Portionsangaben implementiert

**Nächste Schritte:**
- Frontend für Rezeptverwaltung (CRUD Operations)
- Schwierigkeitsgrad-System
- Erweiterte Metadaten (Kochzeit, Kategorien, etc.)

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

## 🔄 Rezept-Management Scripts

```bash
# Rezepte automatisch kategorisieren (basierend auf WordPress-URLs)
export DATABASE_URL="..." && npx tsx scripts/categorize-recipes.ts

# Portionsangaben aus Rezepttiteln extrahieren
export DATABASE_URL="..." && npx tsx scripts/extract-servings.ts

# Doppelte Kategorien bereinigen
export DATABASE_URL="..." && npx tsx scripts/cleanup-duplicate-categories.ts

# WordPress-Daten analysieren (falls nötig)
node scripts/analyze-wordpress.js
```

## 🧹 Maintenance Commands

```bash
# Content-Bereinigung testen
npm run test:clean-content

# Lightbox-Funktionalität testen
npm run test:lightbox

# Suche und Filter testen
npm run test:search
```

---

💡 **Tipp:** Diese Datei wird automatisch von Claude gelesen, um relevante Commands für das Projekt zu kennen.
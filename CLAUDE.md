# Claude Commands für danie.de

Diese Datei enthält wichtige Commands für die Entwicklung von danie.de.

## 🎉 Aktueller Status (26. Sept. 2024)

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

✅ **Design & Typography (NEU):**
- Adobe Fonts (TypeKit) Integration wiederhergestellt mit Kit ID: lgm7svp
- Drei Fonts: fatfrank (Überschriften), hoss-round (Text), playwrite-cc-dk-uloopet (Akzente)
- Text-Gradient-Rendering-Issues behoben
- Glassmorphism Design-System implementiert
- Responsive Layout für alle Geräte

✅ **Navigation & Pages:**
- Über-mich-Seite mit korrektem Image-Text-Layout erstellt
- Home-Link zur Navigation hinzugefügt, Kontakt aus Hauptnavigation entfernt
- Alle Schriftgrößen global vergrößert für bessere Lesbarkeit
- Emojis komplett entfernt (User-Präferenz)

✅ **Hydration & Deployment (NEU):**
- Replit Hydration-Fehler behoben durch Entfernung manueller Font-Loading
- Adobe Fonts werden nun ausschließlich via globals.css @import geladen
- Erfolgreiche Bereitstellung auf GitHub mit korrekter Upstream-Konfiguration

---

## 🎯 **VOLLSTÄNDIGE MIGRATION ROADMAP (12-15 Arbeitstage)**

### **AKTUELLER STATUS:**
- ✅ 480 Rezepte migriert mit korrekten Bildern
- ✅ Adobe Fonts Integration (fatfrank, hoss-round, playwrite)
- ✅ Über-mich-Seite mit korrektem Layout implementiert
- ✅ Hydration-Fehler behoben
- ✅ Navigation mit Home-Link, glassmorphism Design
- ⏳ **NÄCHSTER SCHRITT:** Replit Deployment + Code-Learning

---

### **PHASE 1: REPLIT LEARNING & CODE OPTIMIZATION**
**🔧 Replit Deployment Cycle (Tag 1)**
- Replit automatische Fehlerkorrektur durchlaufen lassen
- Git Pull aller Replit-Korrekturen
- **Systematische Code-Analyse:**
  - Dependencies & Package.json Fixes
  - Next.js/React Best Practices
  - ESLint/Prettier Konfiguration
  - TypeScript Strict Mode Korrekturen
  - Build-Optimierungen
- **Standards Update:** Coding-Patterns für alle weiteren Features

---

### **PHASE 2: VOLLSTÄNDIGE CONTENT MIGRATION**
**📄 Fehlende WordPress Seiten (Tag 2-3)**
- **Kontakt-Seite:** Instagram-Integration + Kontaktformular
- **Datenschutz:** DSGVO-konform (Daniela Bentele, Mozartweg 9, Wolpertswende)
- **Impressum:** Vollständige rechtliche Angaben
- **Cookie-Hinweise:** EU-Consent-Management
- **Meine Küche:** Equipment/Empfehlungen aus XML

**🔍 SEO Foundation Setup**
- Schema.org Markup für alle Seiten
- XML Sitemaps (auto-generiert)
- Meta Tags dynamisch per Seite
- Open Graph + Twitter Cards
- Robots.txt + Canonical URLs

---

### **PHASE 3: KI-POWERED REZEPT INTELLIGENCE**
**🤖 Batch AI-Analyse aller 480 Rezepte (Tag 4-5)**
```
Jedes Rezept analysieren:
├── Schwierigkeitsgrad (1-3 Sterne)
├── Ernährung (Vegan/Vegetarisch/Glutenfrei/Laktosefrei)
├── Allergene (Nüsse, Eier, Milch, Gluten etc.)
├── Tageszeit (Frühstück/Mittag/Abend/Snack)
├── Zubereitungszeit (<15, 15-30, 30-60, >60 Min)
├── Saison (Frühling/Sommer/Herbst/Winter)
├── Nährwerte (Kalorien, Protein, Kohlenhydrate)
├── KI-Tags (Comfort Food, Gesund, Festlich, One-Pot)
└── SEO-Keywords (für bessere Rankings)
```

**📊 Database Schema Extension**
```sql
recipes Table erweitern:
+ difficulty_level: INTEGER (1-3)
+ dietary_tags: JSON (vegan, vegetarian, gluten_free)
+ allergens: JSON (nuts, eggs, dairy, etc.)
+ meal_time: ENUM (breakfast, lunch, dinner, snack)
+ prep_time_minutes + cook_time_minutes: INTEGER
+ season_tags: JSON (spring, summer, autumn, winter)
+ nutrition_per_serving: JSON (calories, protein, carbs, fat)
+ ai_generated_tags: JSON
+ seo_keywords: TEXT
+ meta_title + meta_description: TEXT (KI-generiert)
+ structured_data: JSON (Schema.org für Rich Snippets)
```

---

### **PHASE 4: VOLLSTÄNDIGES CMS BACKEND**
**⚙️ Admin Interface für Daniela (Tag 6-8)**

**Rezept-Management Features:**
- **Rich-Text-Editor** (Tiptap) mit Live-Preview
- **Zutaten-Manager** mit Mengen + Einheiten
- **Schritt-Editor** mit Drag & Drop Reihenfolge
- **Batch-Operations** (Multiple Rezepte gleichzeitig)
- **Auto-Save + Undo/Redo** (keine Datenverluste)
- **Veröffentlichung** (Draft/Published Status)

**KI-Integration im Backend:**
```typescript
// Text-KI Features
✅ Rezept-Optimierung (Klarheit, Struktur, SEO)
✅ Meta-Generierung (Title, Description, Alt-Texte)
✅ Content-Expansion (Tipps, Variationen)
✅ Stil-Konsistenz (Danielas Schreibstil lernen)
✅ Mehrsprachigkeit (EN/IT Versionen)

// Foto-KI Features
✅ DALL-E 3 Integration (Food-Photography)
✅ Style Training (Danielas Ästhetik replizieren)
✅ Batch Generation (5 Varianten pro Rezept)
✅ Professional Styling (Lighting, Komposition)
✅ Background Removal (Clean Produkt-Shots)
```

**Bildverwaltung:**
- **Multi-Upload** für Rezeptbilder
- **Auto-Optimierung** (WebP, responsive Größen)
- **Alt-Text-Editor** (Barrierefreiheit)
- **Crop-Tool** integriert
- **KI-Bilder** direkt verfügbar

---

### **PHASE 5: INTELLIGENT FRONTEND**
**🎨 Moderne Homepage (Tag 9)**
- **Hero-Section:** Dynamische Empfehlungen (Tageszeit/Saison)
- **Smart Collections:** "Heute Abend", "Schnelle Rezepte", "Wochenend-Projekte"
- **Instagram Feed** Integration
- **Newsletter Signup**
- **Personalisierung** basierend auf User-Präferenzen

**🔍 Intelligente Rezept-Suche**
- **Multi-Filter:** Schwierigkeit + Ernährung + Zeit kombiniert
- **Allergen-Ausschluss:** "Glutenfrei", "Ohne Nüsse"
- **Zeit-Filter:** "Unter 30 Min"
- **Tageszeit-Filter:** "Abendessen"
- **Saison-Filter:** "Herbstrezepte"
- **Voice Search** Ready
- **URL-State** für teilbare Filter

**📱 Erweiterte Rezept-Cards**
```
Jedes Rezept zeigt:
├── Schwierigkeits-Sterne (1-3)
├── Ernährungs-Badges (🌱 Vegan, 🥛 Vegetarisch, 🌾 Glutenfrei)
├── Zeit-Badge (⏱️ "25 Min")
├── Tageszeit-Icon (🌅 🌞 🌙)
├── Allergen-Warnungen (Icon-Row)
├── Saison-Highlight (aktuell hervorgehoben)
└── Kalorien pro Portion
```

---

### **PHASE 6: AERO ARCHITECTURE & PERFORMANCE**
**🚀 AERO Framework Implementation (Tag 10-11)**
```typescript
// A - Asynchronous: Alle KI-Operationen non-blocking
// E - Event-driven: Real-time Updates für KI-Prozesse
// R - Reactive: UI reagiert sofort auf Ergebnisse
// O - Optimized: Performance-first Architecture
```

**Tech Stack:**
- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Backend:** tRPC + Redis + PostgreSQL + Drizzle ORM
- **KI-Layer:** OpenAI GPT-4o + DALL-E 3 + Custom Models
- **Styling:** Tailwind CSS + Framer Motion
- **Hosting:** Vercel Edge Network + CDN
- **Analytics:** Plausible (Privacy-friendly)

**Performance Ziele:**
- **Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1
- **Lighthouse:** 95+ (Performance, SEO, Accessibility)
- **Mobile-First:** Touch-optimiert, PWA-ready
- **SEO:** Rich Snippets, Schema.org, perfekte Rankings

---

### **PHASE 7: INNOVATIVE USER FEATURES**
**🎯 KI-Powered Experience (Tag 12)**
- **Personalisierte Empfehlungen** (User-Verhalten-basiert)
- **Intelligent Meal Planning** (Wochenplan-Generator)
- **Auto-Grocery-Lists** aus ausgewählten Rezepten
- **Nutrition Tracking** (Tagesübersicht)
- **Vector Search** für ähnliche Rezepte

**♿ Barrierefreiheit (WCAG 2.1 AA)**
- **Screen Reader** Support (alle Badges/Icons)
- **Keyboard Navigation** (komplette Website)
- **High Contrast** Mode
- **Focus Management** optimiert
- **KI-generierte Alt-Texte** für alle Bilder

---

### **PHASE 8: QUALITY ASSURANCE & GO-LIVE**
**🧪 Vollständige Tests (Tag 13-14)**
- **KI-Analyse Validation** (50 Rezepte Sample-Test)
- **Admin Interface Testing** (alle CRUD-Operationen)
- **Cross-Browser Testing** (Chrome, Safari, Firefox, Edge)
- **Mobile Responsiveness** (alle Breakpoints)
- **Performance Audit** (Lighthouse 95+)
- **Accessibility Testing** (WCAG 2.1 AA Compliance)

**📈 SEO & Marketing Setup (Tag 15)**
- **Google Search Console** Integration
- **Sitemap Submission** (auto-updating)
- **Rich Results** für Recipe Cards
- **Social Media Optimization** (Open Graph, Twitter Cards)
- **Pinterest Rich Pins** + Local SEO
- **Analytics Setup** (Privacy-compliant)

---

## **📋 FEATURE CHECKLIST**

### **✅ BEREITS IMPLEMENTIERT**
- [x] 480 Rezepte migriert mit Bildern
- [x] Kategorisierung (WordPress-URL-basiert)
- [x] Adobe Fonts (fatfrank, hoss-round, playwrite)
- [x] Glassmorphism Design-System
- [x] Über-mich-Seite mit korrektem Layout
- [x] Hydration-Fehler behoben
- [x] Navigation mit Home-Link
- [x] Lokaler Development-Server funktionsfähig

### **🎯 IN UMSETZUNG**
- [ ] **Replit Deployment Learning Cycle**
- [ ] **Code Standards Update basierend auf Replit-Korrekturen**

### **📋 GEPLANTE FEATURES**
- [ ] Kontakt/Datenschutz/Impressum/Cookie-Seiten (aus XML)
- [ ] KI-Analyse aller 480 Rezepte (OpenAI GPT-4o)
- [ ] Vollständiges CMS Backend für Daniela
- [ ] DALL-E 3 Food-Photography Integration
- [ ] Intelligente Suche mit Multi-Filtern
- [ ] Homepage Neudesign (Johnny Ive + Magic)
- [ ] AERO Architecture Implementation
- [ ] PWA + Offline-Funktionalität
- [ ] SEO-Optimierung (Rich Snippets, Schema.org)
- [ ] Barrierefreiheit (WCAG 2.1 AA)
- [ ] Performance-Optimierung (<2s Ladezeit)

---

## **🎯 ERFOLGSKRITERIEN**

**Für Google & SEO:**
- ✅ Lighthouse SEO Score: 100/100
- ✅ Core Web Vitals: Alle grün
- ✅ Rich Snippets in Suchergebnissen
- ✅ Mobile-First Design perfekt

**Für Daniela:**
- ✅ Einfaches Rezept-Management (CMS)
- ✅ KI-Unterstützung bei Content-Erstellung
- ✅ Professionelle Fotos per Knopfdruck (DALL-E 3)
- ✅ SEO-Dashboard mit Rankings

**Für Nutzer:**
- ✅ Intelligente Rezept-Suche (Ernährung, Allergene, Zeit)
- ✅ Personalisierte Empfehlungen (KI-basiert)
- ✅ Perfekte Mobile-Experience (PWA)
- ✅ Offline-Funktionalität

**ZEITPLAN:** 12-15 Arbeitstage für komplette Migration
**METHODIK:** Systematisch, getestet, production-ready, keine Debug-Sessions

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
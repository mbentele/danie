# Danie.de - Moderne Food-Website

Eine moderne, KI-gestützte Food-Blog Website, entwickelt mit Next.js 14+ und TypeScript.

## 🎯 Projektziele

- **Performance:** Schnelle Ladezeiten durch Static Site Generation
- **KI-Features:** Intelligente Suche und personalisierte Empfehlungen
- **SEO-Optimiert:** Bessere Google-Indexierung als WordPress
- **Moderne UX:** Glasmorphism Design mit warmer Ausstrahlung
- **DSGVO-Konform:** Deutsche Hosting-Lösung geplant

## 🚀 Tech Stack

- **Framework:** Next.js 14 mit App Router
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** PostgreSQL + Drizzle ORM
- **Deployment:** Replit (Development) → IONOS (Production)
- **KI-Integration:** OpenAI API für Search & Content-Features

## 🏗️ Architektur

### Frontend
- **Design System:** Glasmorphism + warme Farben
- **Typography:** Adobe Fonts (Freight Sans Pro + Source Sans Pro)
- **Components:** Moderne React-Komponenten mit TypeScript
- **Animations:** Framer Motion für smooth UX

### Backend
- **Database Schema:** Optimiert für Rezept-Content
- **ORM:** Drizzle für Type-Safety
- **File Storage:** Optimierte Bilder (WebP/AVIF)
- **Search:** KI-gestützte semantische Suche

### Moderne Kategorisierung
Intelligente Kategorisierung statt starrer WordPress-Struktur:
- Nach Hauptzutat (Pasta, Fleisch, Gemüse...)
- Nach Diät (Vegetarisch, Vegan, Glutenfrei...)
- Nach Zeit (Unter 15 Min, 30 Min, 1h+...)
- Nach Anlass (Feierabend, Wochenende, Gäste...)
- Nach Portionen (1-2, 3-4, 5-8 Personen...)
- Comfort Food (Eintöpfe, Aufläufe, Süßes...)

## 🎨 Design Features

- **Glasmorphism:** backdrop-filter + transparente Overlays
- **Responsive:** Mobile-First Design
- **Accessibility:** WCAG-konform
- **Instagram-Integration:** @daniesrezepte Feed
- **Dynamic Content:** Wetterbasierte Rezept-Empfehlungen

## 📱 Geplante Features

### KI-Features
- **Smart Search:** "Was kann ich mit Brokkoli kochen?"
- **Kühlschrank-Scan:** Foto → Rezeptvorschläge
- **Meal Planning:** Wochenplanung mit automatischer Einkaufsliste
- **Voice Cooking:** Alexa-Integration für Schritt-für-Schritt
- **Dynamic Homepage:** Kontext-basierte Empfehlungen

### Content-Management
- **Admin-Interface:** Einfaches Upload für neue Rezepte
- **Auto-Kategorisierung:** KI ordnet Rezepte automatisch ein
- **SEO-Optimization:** Automatische Meta-Tags und Alt-Texte
- **WordPress-Migration:** Automatischer Import aller 500+ Rezepte

## 🔄 Development Workflow

```bash
# Lokale Entwicklung
npm run dev

# Database Operations
npm run db:push
npm run db:studio

# Build & Deploy
npm run build
git push origin main  # Auto-Deploy zu Replit
```

## 📊 Migration von WordPress

- **Aktuell:** 500+ Rezepte auf danie.de (WordPress + Divi)
- **Problem:** Langsam, schlechte SEO, nur 50% Google-indexiert
- **Lösung:** Moderne Next.js-App mit KI-Features
- **Erwartung:** 5-10x schneller, 95%+ Indexierung, 2-3x mehr Traffic

## 🎯 Zielgruppe

- **Primär:** Home-Cooks die einfache, leckere Rezepte suchen
- **Instagram:** 17.7k Follower @daniesrezepte
- **Bedarf:** Schnelle Feierabend-Rezepte, Wochenend-Projekte, Inspiration

## 🚀 Getting Started

1. **Replit Setup:**
   - Next.js Template wählen
   - Neon Database verknüpfen
   - Repository klonen

2. **Lokale Entwicklung:**
   ```bash
   git clone https://github.com/mbentele/danie.git
   npm install
   npm run dev
   ```

3. **Database Setup:**
   ```bash
   npm run db:push  # Schema zu Neon pushen
   ```

## 📈 Roadmap

- [ ] **Phase 1:** Basis-Website mit modernem Design
- [ ] **Phase 2:** WordPress-Migration (500+ Rezepte)
- [ ] **Phase 3:** KI-Features (Search, Recommendations)
- [ ] **Phase 4:** Mobile Apps (iOS + Android)
- [ ] **Phase 5:** DSGVO-Migration zu deutschen Hosting

---

**"GEGESSEN WIRD IMMER"** • Rezepte für jeden Tag ❤️
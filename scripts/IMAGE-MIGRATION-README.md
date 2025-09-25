# WordPress zu Next.js Bilder-Migration

Dieses Verzeichnis enthält Scripts für die Migration von WordPress Media-Dateien zu Next.js.

## 🚀 Scripts

### 1. `migrate-images.js` - Haupt-Migration Script

**Funktion:** Kopiert WordPress Bilder ins Next.js public/images Verzeichnis

**Usage:**
```bash
node scripts/migrate-images.js /path/to/wordpress/wp-content/uploads
```

**Features:**
- 📁 Automatische Verzeichniserstellung
- 🏷️ Intelligente Kategorisierung (Rezepte, Kategorien, Sonstige)
- 🔄 Dateinamen-Bereinigung für Web-Nutzung
- 📊 Detaillierte Logs und Statistiken
- 📋 JSON Manifest-Erstellung

**Output:**
- `public/images/recipes/` - Rezept-Bilder
- `public/images/categories/` - Kategorie-Bilder
- `public/images/` - Andere Bilder
- `migration-log.json` - Detailliertes Migrations-Log
- `public/images/image-manifest.json` - Bild-Zuordnungen

### 2. `update-recipe-images.js` - Datenbank Update

**Funktion:** Aktualisiert Bild-URLs in der Datenbank nach der Migration

**Usage:**
```bash
# Direkte Datenbank-Updates
node scripts/update-recipe-images.js

# Nur SQL-Statements generieren
node scripts/update-recipe-images.js sql
```

**Features:**
- 🔄 Automatische URL-Aktualisierung in der Rezepte-Tabelle
- 🎯 Intelligente Bild-Zuordnung (exakt, fuzzy matching)
- 📝 SQL-Statement Generierung für manuelle Ausführung
- ✅ Validierung und Fehlerbehandlung

## 📋 Schritt-für-Schritt Anleitung

### Vorbereitung

1. **WordPress Backup erstellen**
   ```bash
   # WordPress Media-Ordner sichern
   cp -r /path/to/wordpress/wp-content/uploads ./wordpress-media-backup
   ```

2. **Abhängigkeiten überprüfen**
   ```bash
   # Node.js Packages installieren falls nötig
   npm install dotenv drizzle-orm @neondatabase/serverless
   ```

### Migration durchführen

1. **Bilder migrieren**
   ```bash
   # Beispiel: WordPress uploads Ordner migrieren
   node scripts/migrate-images.js /Users/username/wordpress/wp-content/uploads
   ```

2. **Ergebnisse überprüfen**
   ```bash
   # Anzahl migrierter Bilder prüfen
   ls -la public/images/recipes/ | wc -l
   ls -la public/images/categories/ | wc -l

   # Migration-Log ansehen
   cat migration-log.json | jq '.totalImages'
   ```

3. **Datenbank aktualisieren**
   ```bash
   # Option A: Direkte Updates (empfohlen für kleine DBs)
   node scripts/update-recipe-images.js

   # Option B: SQL-Datei generieren (empfohlen für große DBs)
   node scripts/update-recipe-images.js sql
   # Dann: migration-image-updates.sql in Datenbank ausführen
   ```

## 📊 Erwartete Ergebnisse

Basierend auf der WordPress-Migration:

- **977 Media-Dateien** aus WordPress
- **449 Rezepte** in der Datenbank
- Geschätzte Verteilung:
  - ~600 Rezept-Bilder
  - ~20 Kategorie-Bilder
  - ~357 sonstige Bilder

## 🔧 Konfiguration

### Unterstützte Dateiformate
```javascript
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
```

### Verzeichnisstruktur
```
public/
├── images/
│   ├── recipes/          # Rezept-Bilder
│   ├── categories/       # Kategorie-Bilder
│   ├── logo/            # Logo-Dateien (bereits vorhanden)
│   └── image-manifest.json
```

### Dateinamen-Konventionen
- **Rezepte:** `recipe-[name].jpg`
- **Kategorien:** `category-[name].jpg`
- **Bereinigung:** Sonderzeichen → Bindestriche
- **Kleinschreibung:** Alle Dateinamen werden zu lowercase

## 🛠️ Troubleshooting

### Häufige Probleme

1. **"Directory not found"**
   ```bash
   # WordPress uploads Pfad prüfen
   ls -la /path/to/wordpress/wp-content/uploads
   ```

2. **"Database connection failed"**
   ```bash
   # .env.local prüfen
   cat .env.local | grep DATABASE_URL
   ```

3. **"No images found"**
   ```bash
   # WordPress Media-Dateien suchen
   find /path/to/wordpress -name "*.jpg" -o -name "*.png" | head -10
   ```

### Debug-Modus

Für detaillierte Logs, Script mit DEBUG erweitern:
```bash
DEBUG=true node scripts/migrate-images.js /path/to/uploads
```

## 📈 Performance

- **Kleine Sites** (< 100 Bilder): ~1-2 Minuten
- **Mittlere Sites** (100-500 Bilder): ~5-10 Minuten
- **Große Sites** (500+ Bilder): ~15-30 Minuten

## ✅ Verification

Nach der Migration überprüfen:

1. **Bildanzahl**
   ```bash
   # Sollten etwa gleich sein
   echo "WordPress Bilder: $(find /path/to/uploads -name "*.jpg" -o -name "*.png" | wc -l)"
   echo "Migrierte Bilder: $(find public/images -name "*.jpg" -o -name "*.png" | wc -l)"
   ```

2. **Datenbank URLs**
   ```sql
   SELECT COUNT(*) FROM recipes WHERE image LIKE '/images/%';
   ```

3. **Funktionale Tests**
   - Website öffnen: http://localhost:3000
   - Rezepte-Seite überprüfen: http://localhost:3000/rezepte
   - Einzelne Rezepte testen

---

🎯 **Ziel:** Alle WordPress Bilder erfolgreich nach Next.js migriert und URLs in der Datenbank aktualisiert.
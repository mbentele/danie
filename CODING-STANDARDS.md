# DANIE.DE CODING STANDARDS
*Basierend auf Replit Production-Optimierungen*

## **🚀 DEPLOYMENT STANDARDS**

### **Replit Configuration**
```bash
# .replit - Production Ready
run = "npm run dev"
modules = ["nodejs-18"]

[deployment]
run = ["npm", "run", "start"]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]

# Dev Server mit externem Zugriff
npm run dev -- --port 5000 --hostname 0.0.0.0
```

### **Port Management**
- **Development:** 3000 (lokal), 5000 (Replit)
- **Production:** 80 (external), 5000 (internal)
- **Hostname:** `0.0.0.0` für externe Erreichbarkeit

## **📊 TYPESCRIPT BEST PRACTICES**

### **tsconfig.json Standards**
```json
{
  "compilerOptions": {
    "target": "ES2018",         // Browser-Kompatibilität
    "strict": true,             // Strikte Type-Checks
    "moduleResolution": "bundler",  // Next.js Optimierung
    "skipLibCheck": true        // Performance
  },
  "exclude": [
    "node_modules",
    "scripts"                   // Build-Performance
  ]
}
```

### **Type Safety Patterns**
```typescript
// ✅ Robuste Fallbacks
const value = data?.property || defaultValue
const color = category.color || '#ec4899'
const images = recipe.images || '[]'

// ✅ Proper Type Casting für Dynamic JSON
let nutrition: any = {}
try {
  nutrition = JSON.parse(recipe.nutrition as string)
} catch (e) {
  nutrition = {}
}
```

## **🛡️ NULL SAFETY & ERROR HANDLING**

### **Defensive Programming**
```typescript
// ✅ Always provide fallbacks
featuredImage={recipe.featuredImage || undefined}
backgroundColor: category.color || '#ec4899'

// ✅ Safe JSON parsing
try {
  const data = JSON.parse(jsonString || '[]')
} catch (e) {
  console.error('JSON parsing failed:', e)
  // Fallback logic
}
```

### **Optional Chaining**
```typescript
// ✅ Safe property access
const title = recipe?.title || 'Untitled'
const count = data?.recipes?.length || 0
```

## **🚀 SQL & DATABASE PATTERNS**

### **Drizzle Query Optimization**
```typescript
// ✅ Proper condition building
const conditions = [eq(recipes.published, true)]

if (category) {
  conditions.push(eq(categories.slug, category))
}

if (search) {
  conditions.push(like(recipes.title, `%${search}%`))
}

// ✅ Single WHERE clause with AND
.where(and(...conditions))

// ❌ Avoid chained WHERE clauses
.where(eq(recipes.published, true))
.where(eq(categories.slug, category)) // Can override previous
```

### **Import Optimization**
```typescript
// ✅ Import only what you need
import { eq, desc, and, like } from 'drizzle-orm'

// ❌ Avoid wildcard imports
import * from 'drizzle-orm'
```

## **📝 HTML & CONTENT STANDARDS**

### **German Typography**
```tsx
// ✅ Proper HTML entities for German quotes
&bdquo;austoben&ldquo; // „austoben"
&bdquo;ad acta&ldquo;  // „ad acta"

// ✅ Proper apostrophes
kann mich &bdquo;austoben&ldquo; // instead of "austoben"
```

### **Accessible HTML**
```tsx
// ✅ Always provide alt text
<Image
  src={imageSrc}
  alt="Descriptive alt text"
  width={400}
  height={300}
/>

// ✅ Proper link attributes
<a
  href="https://external.com"
  target="_blank"
  rel="noopener noreferrer"
>
```

## **⚡ PERFORMANCE PATTERNS**

### **Component Optimization**
```typescript
// ✅ Memoize expensive calculations
const processedData = useMemo(() =>
  processExpensiveData(rawData), [rawData]
)

// ✅ Proper loading states
if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage />
```

### **Image Optimization**
```tsx
// ✅ Next.js Image with proper sizing
<Image
  src={imageSrc}
  alt={altText}
  width={800}
  height={600}
  className="w-full h-auto object-cover"
  priority // For above-fold images
/>
```

## **🧪 ERROR PREVENTION**

### **Build-Safe Patterns**
```typescript
// ✅ Handle undefined gracefully
const safeValue = someValue?.toString() || ''

// ✅ Validate before processing
if (!data || !Array.isArray(data)) {
  return defaultValue
}
```

### **Runtime Safety**
```typescript
// ✅ Environment-specific logic
const isDev = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 3000
```

## **📋 CODE REVIEW CHECKLIST**

### **Before Every Commit:**
- [ ] TypeScript errors: `npx tsc --noEmit`
- [ ] Linting: `npm run lint`
- [ ] Build test: `npm run build`
- [ ] All imports optimized (no unused)
- [ ] Proper fallbacks for all optional data
- [ ] HTML entities for German content
- [ ] Accessible alt texts and ARIA labels

### **Before Production Deploy:**
- [ ] Port configuration correct
- [ ] Environment variables set
- [ ] Database queries optimized
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] SEO meta tags complete

---

**FAZIT:** Diese Standards basieren auf realen Production-Fixes und verhindern deployment-brechende Fehler. Jeder neue Code muss diese Patterns befolgen.
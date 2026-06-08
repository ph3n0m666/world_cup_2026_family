# Data Freshness Strategy for World Cup 2026 Fixtures

## Overview
Three options available to keep match data fresh (API updates daily):

### Option 1: **Build-Time Fetch** (Recommended for Static Hosting)
**Best for:** Vercel, Netlify, GitHub Pages

```bash
# Manual update
npm run update-fixtures

# Auto-update during build
npm run build:fresh
```

**Advantages:**
- ✅ Fastest app load (no HTTP requests at runtime)
- ✅ Always have latest data deployed
- ✅ Works offline
- ⚠️ Data only fresh when you deploy

**Setup:** Connect your deploy to run `npm run build:fresh` instead of `npm run build`

---

### Option 2: **Client-Side Smart Caching** (Recommended for General Use)
**Best for:** Any deployment with internet connectivity

Import in your Vue components:
```javascript
import { getMatches, getCacheAge, clearMatchesCache } from '@/utils/fetchMatches.js'

// In your component:
export default {
  async setup() {
    try {
      const matches = await getMatches()
      return { matches }
    } catch (error) {
      console.error('Failed to load matches:', error)
    }
  }
}
```

**Caching Behavior:**
- First load: Fetches from API
- Subsequent loads (same day): Uses browser cache
- Next day: Auto-refreshes from API
- Network down: Uses cached data as fallback

**Check cache age:**
```javascript
import { getCacheAge } from '@/utils/fetchMatches.js'

const age = getCacheAge() // Returns seconds, or -1 if no cache
if (age > 0) {
  console.log(`Cache is ${Math.floor(age / 60)} minutes old`)
}
```

**Manual refresh:**
```javascript
import { clearMatchesCache, getMatches } from '@/utils/fetchMatches.js'

clearMatchesCache()
const freshMatches = await getMatches()
```

---

### Option 3: **Hybrid** (Best of Both Worlds)
1. **Production:** Use build-time fetching
2. **Development:** Use client-side fetching for live updates

Set an env variable:
```javascript
// In fetchMatches.js
const USE_API = import.meta.env.DEV // true in dev, false in prod
```

---

## Current Status
- ✅ `src/utils/fetchMatches.js` - Client-side fetching utility ready
- ✅ `scripts/updateMatches.js` - Build-time script ready  
- ✅ `package.json` - Scripts added (`update-fixtures`, `build:fresh`)
- 📝 `src/data/matches.json` - Static backup file (use with Option 1)

## Implementation Example

```vue
<template>
  <div>
    <p v-if="cacheAge >= 0">Cache age: {{ Math.floor(cacheAge / 60) }} minutes</p>
    <button @click="refreshMatches">Refresh from API</button>
    
    <div v-for="match in matches" :key="match.MatchNumber">
      {{ match.HomeTeam }} vs {{ match.AwayTeam }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMatches, getCacheAge, clearMatchesCache } from '@/utils/fetchMatches'

const matches = ref([])
const cacheAge = ref(-1)

async function loadMatches() {
  try {
    matches.value = await getMatches()
    cacheAge.value = getCacheAge()
  } catch (error) {
    console.error('Failed to load matches:', error)
  }
}

async function refreshMatches() {
  clearMatchesCache()
  await loadMatches()
}

onMounted(loadMatches)
</script>
```

## Recommendation
**Use Option 2 (Client-Side Smart Caching)** for most cases:
- Automatic daily refresh with 24h cache
- Works both online and offline
- No deployment complexity
- Users always get latest data on first load of a new day

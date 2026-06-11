<template>
  <div id="app">
    <header class="app-header">
      <div>
        <p class="app-subtitle">Cowap World Cup 2026 Pool</p>
        <h1>Results & Standings</h1>
      </div>

      <div class="header-actions">
        <button @click="refreshMatches" :disabled="loading">
          {{ loading ? 'Refreshing...' : 'Refresh matches' }}
        </button>
        <span class="cache-age" v-if="cacheAge >= 0 && !loading">
          Cache age: {{ formatCacheAge(cacheAge) }}
        </span>
      </div>

      <nav class="app-nav">
        <router-link to="/" class="nav-link" active-class="active" exact>Home</router-link>
        <!-- <router-link to="/results" class="nav-link" active-class="active">Pool Results</router-link> -->
        <router-link to="/groups/A" class="nav-link" active-class="active">Group Standings</router-link>
        <router-link to="/matches" class="nav-link" active-class="active">Matches</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { refreshMatches, loading, cacheAge } from '@/store/matches.js'

function formatCacheAge(seconds) {
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`
}
</script>

<style>
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f3f4f6;
  color: #111827;
}

#app {
  min-height: 100vh;
  padding: 1.5rem;
}

.app-header {
  position: relative;
  margin-bottom: 2rem;
  padding: 1.75rem 1.5rem 2rem;
  min-height: 220px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  color: white;
  display: grid;
  gap: 1rem;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.17);
}

.app-subtitle {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 2.8vw, 3.1rem);
  line-height: 1.05;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-end;
}

.header-actions button {
  background: rgba(255, 255, 255, 0.16);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.75rem;
  padding: 0.65rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.header-actions button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.28);
}

.header-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cache-age {
  color: #f8fafc;
  opacity: 0.88;
  font-size: 0.95rem;
}

.nav-link {
  border: none;
  background: transparent;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  transition: background 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.16);
}

.active {
  background: rgba(255, 255, 255, 0.24);
}

main {
  display: grid;
  gap: 1.75rem;
}

@media (max-width: 768px) {
  #app {
    padding: 1rem;
  }

  .app-header {
    padding: 1.25rem 1rem 1.75rem;
    min-height: auto;
  }

  .app-nav {
    gap: 0.75rem;
  }

  .nav-link {
    padding: 0.5rem 0.85rem;
  }
}

@media (max-width: 540px) {
  .app-header {
    padding: 1rem 0.9rem 1.5rem;
  }

  .app-nav {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

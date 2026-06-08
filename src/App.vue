<template>
  <div id="app">
    <header class="app-header">
      <div>
        <p class="app-subtitle">Cowap World Cup 2026 Pool</p>
        <h1>Results & Standings</h1>
      </div>

      <nav class="app-nav">
        <router-link to="/" class="nav-link" active-class="active" exact>Home</router-link>

        <div class="nav-dropdown">
          <button class="dropdown-button" type="button">Group Standings</button>
          <div class="dropdown-menu">
            <router-link v-for="id in groupIds" :key="id" :to="`/groups/${id}`" class="dropdown-item"
              active-class="active">
              Group {{ id }}
            </router-link>
          </div>
        </div>

        <router-link to="/matches" class="nav-link" active-class="active">Matches</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
const groupIds = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
]
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
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  color: white;
  display: grid;
  gap: 1rem;
}

.app-subtitle {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  opacity: 0.85;
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

.nav-link,
.dropdown-button,
.dropdown-item {
  border: none;
  background: transparent;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  transition: background 0.2s ease;
}

.nav-link:hover,
.dropdown-button:hover,
.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.16);
}

.active {
  background: rgba(255, 255, 255, 0.24);
}

.nav-dropdown {
  position: relative;
}

.dropdown-button {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  display: grid;
  background: white;
  color: #111827;
  min-width: 180px;
  border-radius: 0.75rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
}

.nav-dropdown:hover .dropdown-menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.dropdown-item {
  color: #111827;
  padding: 0.75rem 1rem;
  display: block;
}

.dropdown-item.active {
  background: #e0e7ff;
}

main {
  display: grid;
  gap: 1.75rem;
}
</style>

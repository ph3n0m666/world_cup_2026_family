<template>
  <div id="app">
    <header class="app-header">
      <div>
        <p class="app-subtitle">World Cup 2026 Predictor</p>
        <h1>Make your match predictions</h1>
      </div>
    </header>

    <main>
      <GroupPrediction />
      <KnockoutBracket />
    </main>
  </div>
</template>

<script setup>
import GroupPrediction from './components/GroupPrediction.vue'
import KnockoutBracket from './components/KnockoutBracket.vue'
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

main {
  display: grid;
  gap: 1.75rem;
}
</style>

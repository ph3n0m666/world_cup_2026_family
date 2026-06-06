<template>
  <section class="group-prediction">
    <div class="section-header">
      <div>
        <p class="section-label">Group stage</p>
        <h2>Predict the group order</h2>
      </div>
      <p class="section-help">Choose the predicted finishing position for each team in every group.</p>
    </div>

    <div class="groups">
      <article v-for="(group, groupIndex) in predictions" :key="group.name" class="group-card">
        <h3>Group {{ group.name }}</h3>

        <div class="group-grid group-grid--header">
          <span>Team</span>
          <span>Prediction</span>
        </div>

        <div v-for="(team, teamIndex) in group.teams" :key="team.name" class="group-grid">
          <span>{{ team.name }}</span>
          <select v-model.number="team.position">
            <option v-for="option in positionOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="prediction-summary">
          <p class="summary-title">Predicted order</p>
          <ol>
            <li
              v-for="team in sortedGroupTeams(group.teams)"
              :key="team.name"
            >
              {{ team.position }}. {{ team.name }}
            </li>
          </ol>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { groups } from '../data/groups.js'

const predictions = ref(
  groups.map(group => ({
    name: group.name,
    teams: group.teams.map((team, index) => ({
      name: team,
      position: index + 1,
    })),
  }))
)

const positionOptions = [1, 2, 3, 4]

function sortedGroupTeams(teams) {
  return [...teams].sort((a, b) => a.position - b.position)
}
</script>

<style scoped>
.group-prediction {
  padding: 1.5rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-label {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #2563eb;
}

h2 {
  margin: 0;
  font-size: 1.6rem;
}

.section-help {
  margin: 0;
  color: #4b5563;
}

.groups {
  display: grid;
  gap: 1rem;
}

.group-card {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
  background: #f9fafb;
}

.group-card h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.group-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-top: 1px solid #e5e7eb;
}

.group-grid--header {
  font-weight: 700;
  border-color: transparent;
  color: #374151;
  margin-bottom: 0.25rem;
}

select {
  width: 100%;
  min-width: 6rem;
  appearance: none;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  background: white;
  color: #111827;
}

.prediction-summary {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
}

.summary-title {
  margin: 0 0 0.5rem;
  font-weight: 700;
}

ol {
  margin: 0;
  padding-left: 1.2rem;
  color: #374151;
}
</style>

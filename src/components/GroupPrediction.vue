<template>
  <section class="group-prediction">
    <div class="section-header">
      <div>
        <p class="section-label">Group stage</p>
        <h2>Predict the group order</h2>
      </div>
      <p class="section-help">Choose the predicted finish for each team and see every group matchup.</p>
    </div>

    <div class="groups">
      <article v-for="group in predictions" :key="group.id" class="group-card">
        <h3>{{ group.name }}</h3>

        <div class="group-grid group-grid--header">
          <span>Team</span>
          <span>Prediction</span>
        </div>

        <div v-for="team in group.teams" :key="team.name" class="group-grid">
          <span class="team-name">
            <span class="team-flag">{{ team.flag }}</span>
            {{ team.name }}
          </span>

          <select v-model.number="team.position">
            <option v-for="option in positionOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="group-schedule">
          <p class="summary-title">Group matches</p>
          <ol>
            <li v-for="match in groupMatchups(group.teams)" :key="match.home.name + match.away.name">
              <span>{{ match.home.flag }} {{ match.home.name }}</span>
              <strong>vs</strong>
              <span>{{ match.away.flag }} {{ match.away.name }}</span>
            </li>
          </ol>
        </div>

        <div class="prediction-summary">
          <p class="summary-title">Predicted order</p>
          <ol>
            <li v-for="team in sortedGroupTeams(group.teams)" :key="team.name">
              {{ team.position }}.
              <span class="team-flag">{{ team.flag }}</span>
              {{ team.name }}
            </li>
          </ol>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePredictions } from '../store/predictions.js'

const { predictions } = usePredictions()
const positionOptions = [1, 2, 3, 4]

function sortedGroupTeams(teams) {
  return [...teams].sort((a, b) => a.position - b.position)
}

function groupMatchups(teams) {
  const matches = []

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      matches.push({ home: teams[i], away: teams[j] })
    }
  }

  return matches
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

.group-grid:first-of-type {
  border-top: none;
}

.group-grid--header {
  font-weight: 700;
  border-color: transparent;
  color: #374151;
  margin-bottom: 0.25rem;
}

.team-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.team-flag {
  font-size: 1.15rem;
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

.group-schedule,
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

.group-schedule ol,
.prediction-summary ol {
  margin: 0;
  padding-left: 1.2rem;
  color: #374151;
}

.group-schedule li {
  margin-bottom: 0.35rem;
}

.group-schedule strong {
  display: inline-block;
  width: 2rem;
  text-align: center;
  color: #111827;
}
</style>

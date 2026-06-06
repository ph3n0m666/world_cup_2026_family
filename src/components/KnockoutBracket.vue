<template>
  <section class="knockout-bracket">
    <div class="section-header">
      <div>
        <p class="section-label">Knockout stage</p>
        <h2>Bracket preview</h2>
      </div>
      <p class="section-help">The first two knockout rounds show actual predicted qualifiers; later rounds follow match winners.</p>
    </div>

    <div class="bracket-grid">
      <div v-for="round in rounds" :key="round.name" class="bracket-column">
        <h3>{{ round.name }}</h3>
        <div v-for="match in round.matches" :key="match.id" class="bracket-card">
          <p class="match-label">Match {{ match.id }}</p>
          <div class="match-line">
            <span>{{ match.leftLabel }}</span>
            <strong>vs</strong>
            <span>{{ match.rightLabel }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePredictions } from '../store/predictions.js'
import { knockoutRounds } from '../data/bracketTemplate.js'

const { predictions } = usePredictions()

function sortedGroupTeams(group) {
  return [...group].sort((a, b) => a.position - b.position)
}

function findGroup(groupId) {
  return predictions.value.find(group => group.id === groupId)
}

function resolveParticipant(participant) {
  if (!participant) {
    return ''
  }

  if (participant.type === 'groupWinner') {
    const group = findGroup(participant.group)
    const winner = group ? sortedGroupTeams(group.teams)[0] : null
    return winner ? `Winner ${participant.group}: ${winner.flag} ${winner.name}` : `Winner ${participant.group}`
  }

  if (participant.type === 'groupRunnerUp') {
    const group = findGroup(participant.group)
    const runnerUp = group ? sortedGroupTeams(group.teams)[1] : null
    return runnerUp ? `Runner-up ${participant.group}: ${runnerUp.flag} ${runnerUp.name}` : `Runner-up ${participant.group}`
  }

  if (participant.type === 'groupThirdPlace') {
    return `Group ${participant.groups.join('/')} third place`
  }

  if (participant.type === 'matchWinner') {
    return `Winner match ${participant.match}`
  }

  if (participant.type === 'matchRunnerUp') {
    return `Runner-up match ${participant.match}`
  }

  return participant.label || ''
}

const rounds = computed(() =>
  knockoutRounds.map(round => ({
    ...round,
    matches: round.matches.map(match => ({
      ...match,
      leftLabel: resolveParticipant(match.left),
      rightLabel: resolveParticipant(match.right),
    })),
  }))
)
</script>

<style scoped>
.knockout-bracket {
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
  color: #1d4ed8;
}

h2 {
  margin: 0;
  font-size: 1.6rem;
}

.section-help {
  margin: 0;
  color: #4b5563;
}

.bracket-grid {
  display: grid;
  gap: 1.5rem;
}

.bracket-column {
  display: grid;
  gap: 0.75rem;
}

.bracket-column h3 {
  margin: 0;
  font-size: 1.05rem;
}

.bracket-card {
  padding: 1rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  color: #1f2937;
}

.match-label {
  margin: 0 0 0.75rem;
  font-weight: 700;
}

.match-line {
  display: grid;
  gap: 0.5rem;
}

.match-line strong {
  display: block;
  text-align: center;
  color: #111827;
}
</style>

<template>
    <div class="standings-table-wrapper">
        <div v-if="loading" class="status">Loading matches...</div>
        <div v-else-if="error" class="status error">{{ error }}</div>
        <div v-else class="standings-table">
            <div class="header">
                <div class="rank">#</div>
                <div class="name">Player</div>
                <div class="points">Points</div>
                <div class="teams">Teams</div>
            </div>

            <div v-for="(standing, index) in standings" :key="standing.person" class="standing-row">
                <div class="rank">{{ index + 1 }}</div>
                <div class="name">{{ standing.person }}</div>
                <div class="points"><strong>{{ standing.points }}</strong></div>
                <div class="teams">
                    <span v-for="team in standing.teams" :key="team" class="team-badge">
                        {{ team }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMatches } from '@/utils/fetchMatches.js'
import { calculateStandings } from '@/utils/scoring.js'
import { poolParticipants } from '@/data/people.js'

const loading = ref(true)
const error = ref(null)
const standings = ref([])

onMounted(async () => {
    try {
        const matches = await getMatches()
        standings.value = calculateStandings(matches, poolParticipants)
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.standings-table-wrapper {
    width: 100%;
}

.status {
    padding: 1.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    text-align: center;
}

.status.error {
    color: #b91c1c;
    border-color: #fecaca;
}

.standings-table {
    width: 100%;
    border-collapse: collapse;
}

.header,
.standing-row {
    display: grid;
    grid-template-columns: 50px 150px 80px 1fr;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
}

.header {
    background: #f3f4f6;
    font-weight: 700;
    border-radius: 0.75rem;
    margin-bottom: 0.5rem;
}

.standing-row {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    margin-bottom: 0.5rem;
}

.rank {
    text-align: center;
    font-weight: 700;
}

.name {
    font-weight: 600;
}

.points {
    text-align: center;
}

.team-badge {
    display: inline-block;
    background: #e0e7ff;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    margin: 0.15rem;
}
</style>

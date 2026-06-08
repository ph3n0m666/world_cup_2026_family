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
                <div class="name" data-label="Player">{{ standing.person }}</div>
                <div class="points" data-label="Points"><strong>{{ standing.points }}</strong></div>
                <div class="teams" data-label="Teams">
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

@media (max-width: 720px) {
    .standings-table {
        width: 100%;
    }

    .header {
        display: none;
    }

    .standing-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        padding: 0.9rem;
    }

    .rank {
        text-align: left;
        font-size: 0.95rem;
    }

    .name,
    .points,
    .teams {
        display: grid;
        gap: 0.35rem;
    }

    .name::before,
    .points::before,
    .teams::before {
        content: attr(data-label);
        color: #6b7280;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .points {
        justify-content: flex-start;
    }

    .team-badge {
        margin: 0.15rem 0.1rem 0 0;
    }
}
</style>

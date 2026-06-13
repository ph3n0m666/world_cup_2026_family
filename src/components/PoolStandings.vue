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

            <div v-for="(standing, index) in standings" :key="standing.person" class="standing-row"
                :class="{ eliminated: isPersonEliminated(standing) }">
                <div class="rank">{{ index + 1 }}</div>
                <div class="name" data-label="Player">{{ standing.person }}</div>
                <div class="points" data-label="Points"><strong>{{ standing.points }}</strong></div>
                <div class="teams" data-label="Teams">
                    <span v-for="team in standing.teams" :key="team" class="team-badge"
                        :class="{ eliminated: eliminatedTeams.has(normalizeTeamName(team)) }">
                        {{ team }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, watch, onMounted, ref } from 'vue'
import { calculateStandings, getEliminatedTeams } from '@/utils/scoring.js'
import { normalizeTeamName, poolParticipants } from '@/data/people.js'
import { matches, loading, error, loadMatches } from '@/store/matches.js'

const standings = ref([])
const eliminatedTeams = computed(() => getEliminatedTeams(matches.value))

function updateStandings() {
    standings.value = calculateStandings(matches.value, poolParticipants)
}

function isPersonEliminated(standing) {
    return standing.teams.every((team) => eliminatedTeams.value.has(normalizeTeamName(team)))
}

watch(matches, (newMatches) => {
    if (newMatches.length) {
        updateStandings()
    }
})

onMounted(async () => {
    try {
        await loadMatches()
        updateStandings()
    } catch (err) {
        // error is handled by shared store
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

.standing-row.eliminated {
    color: #6b7280;
    text-decoration: line-through;
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

.team-badge.eliminated {
    opacity: 0.55;
    text-decoration: line-through;
}

@media (max-width: 768px) {
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

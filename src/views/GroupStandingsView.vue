<template>
    <div class="group-view">
        <div class="page-header">
            <div>
                <h2>Group Standings</h2>
                <p>Choose a group to view the standings for Group {{ groupId }}</p>
            </div>
            <div class="group-picker">
                <label for="group-select">Group</label>
                <select id="group-select" v-model="selectedGroup" @change="navigateToGroup">
                    <option v-for="group in groupIds" :key="group" :value="group">
                        Group {{ group }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="status">Loading matches...</div>
        <div v-else-if="error" class="status error">{{ error }}</div>
        <div v-else class="group-table-wrapper">
            <div class="table-header">
                <div class="team-col">Team</div>
                <div class="stat-col">M</div>
                <div class="stat-col">W</div>
                <div class="stat-col">D</div>
                <div class="stat-col">L</div>
                <div class="stat-col">GF</div>
                <div class="stat-col">GA</div>
                <div class="points-col">Pts</div>
                <div class="owner-col">Pool Person</div>
            </div>

            <div v-for="team in standings" :key="team.name" class="table-row">
                <div class="team-col">{{ team.name }}</div>
                <div class="stat-col">{{ team.matches }}</div>
                <div class="stat-col">{{ team.wins }}</div>
                <div class="stat-col">{{ team.draws }}</div>
                <div class="stat-col">{{ team.losses }}</div>
                <div class="stat-col">{{ team.goalsFor }}</div>
                <div class="stat-col">{{ team.goalsAgainst }}</div>
                <div class="points-col"><strong>{{ team.points }}</strong></div>
                <div class="owner-col">{{ getPersonForTeam(team.name) || '—' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroupStandings } from '@/utils/scoring.js'
import { getPersonForTeam } from '@/data/people.js'
import { groups } from '@/data/groups.js'
import { matches, loading, error, loadMatches } from '@/store/matches.js'

const route = useRoute()
const router = useRouter()
const groupId = ref(route.params.groupId || 'A')
const selectedGroup = ref(groupId.value)
const standings = ref([])
const groupIds = groups.map((group) => group.id)

function updateStandings(id) {
    standings.value = getGroupStandings(id, matches.value)
}

watch(matches, (newMatches) => {
    if (newMatches.length) {
        updateStandings(groupId.value)
    }
})

async function loadStandings(id) {
    loading.value = true
    error.value = null

    try {
        if (!matches.value.length) {
            await loadMatches()
        }
        updateStandings(id)
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

function navigateToGroup() {
    router.push({ name: 'group', params: { groupId: selectedGroup.value } })
}

watch(
    () => route.params.groupId,
    (newGroupId) => {
        if (newGroupId) {
            groupId.value = newGroupId
            selectedGroup.value = newGroupId
            loadStandings(newGroupId)
        }
    },
)

onMounted(() => {
    loadStandings(groupId.value)
})
</script>

<style scoped>
.group-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.page-header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.group-picker {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.group-picker select {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
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

.group-table-wrapper {
    display: grid;
    gap: 0.25rem;
}

.table-header,
.table-row {
    display: grid;
    grid-template-columns: 2.4fr repeat(7, 0.9fr) 1.8fr;
    gap: 0.5rem;
    align-items: center;
    padding: 0.85rem 1rem;
}

.table-header {
    background: #f3f4f6;
    font-weight: 700;
    border-radius: 0.75rem;
}

.table-row {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
}

.team-col {
    text-align: left;
    font-weight: 600;
}

.stat-col,
.points-col,
.owner-col {
    text-align: center;
}

.points-col {
    font-size: 1rem;
}
</style>

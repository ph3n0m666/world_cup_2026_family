<template>
    <div class="matches-view">
        <div class="page-header">
            <div>
                <h2>Weekly Matches</h2>
                <p>Select a calendar week to view all scheduled games.</p>
            </div>
        </div>

        <div v-if="weekOptions.length" class="week-nav">
            <button v-for="week in weekOptions" :key="week.key" type="button" class="week-button"
                :class="{ active: week.key === selectedWeekKey }" @click="selectedWeekKey = week.key">
                {{ week.label }}
            </button>
        </div>

        <div v-if="loading" class="status">Loading matches...</div>
        <div v-else-if="error" class="status error">{{ error }}</div>
        <div v-else>
            <div v-if="!weekMatches.length" class="status">No matches scheduled for this week.</div>
            <div v-else class="matches-list">
                <div v-for="match in weekMatches" :key="match.MatchNumber" class="match-card">
                    <div class="match-card-header">
                        <div class="match-date">{{ formatDate(match.DateUtc) }}</div>
                        <div>{{ formatMatchTime(match.DateUtc) }}</div>
                        <div v-if="isFinal(match)" class="match-tag">World Cup Final</div>
                    </div>
                    <div class="match-content">
                        <div class="team home">
                            <div class="team-name">{{ match.HomeTeam }}</div>
                            <div class="team-person">{{ getPersonForTeam(match.HomeTeam) || '—' }}</div>
                        </div>

                        <div class="score">
                            <div v-if="match.HomeTeamScore !== null" class="score-display">
                                {{ match.HomeTeamScore }} - {{ match.AwayTeamScore }}
                            </div>
                            <div v-else class="score-pending">vs</div>
                        </div>

                        <div class="team away">
                            <div class="team-name">{{ match.AwayTeam }}</div>
                            <div class="team-person">{{ getPersonForTeam(match.AwayTeam) || '—' }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getPersonForTeam } from '@/data/people.js'
import { matches, loading, error, loadMatches } from '@/store/matches.js'

const weekOptions = ref([])
const selectedWeekKey = ref('')

function updateWeekState(matchData) {
    const options = buildWeekOptions(matchData)
    weekOptions.value = options
    selectedWeekKey.value = findDefaultWeek(options)
}

watch(matches, (newMatches) => {
    if (newMatches.length) {
        updateWeekState(newMatches)
    }
})

onMounted(async () => {
    try {
        if (!matches.value.length) {
            await loadMatches()
        }
        if (matches.value.length) {
            updateWeekState(matches.value)
        }
    } catch (err) {
        // error displayed by shared store
    }
})

function getWeekStart(dateString) {
    const date = new Date(dateString)
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const day = utcDate.getUTCDay()
    const weekStart = new Date(utcDate)
    weekStart.setUTCDate(utcDate.getUTCDate() - day)
    return weekStart
}

function formatWeekLabel(start, end) {
    const format = (d) =>
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${format(start)} — ${format(end)}`
}

function buildWeekOptions(matchList) {
    const weeks = new Map()

    matchList.forEach((match) => {
        const start = getWeekStart(match.DateUtc)
        const key = start.toISOString().slice(0, 10)

        if (!weeks.has(key)) {
            const end = new Date(start)
            end.setUTCDate(start.getUTCDate() + 6)
            weeks.set(key, {
                key,
                start,
                end,
                label: formatWeekLabel(start, end),
                matches: [],
            })
        }

        weeks.get(key).matches.push(match)
    })

    return Array.from(weeks.values()).sort((a, b) => a.start - b.start)
}

function findDefaultWeek(weekList) {
    if (!weekList.length) return ''

    const today = new Date()
    const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

    const currentWeek = weekList.find((week) => utcToday >= week.start && utcToday <= week.end)
    if (currentWeek) return currentWeek.key

    const upcomingWeek = weekList.find((week) => utcToday < week.start)
    if (upcomingWeek) return upcomingWeek.key

    return weekList[weekList.length - 1].key
}

const weekMatches = computed(() => {
    const currentWeek = weekOptions.value.find((week) => week.key === selectedWeekKey.value)
    if (!currentWeek) return []
    return currentWeek.matches.sort((a, b) => new Date(a.DateUtc).getTime() - new Date(b.DateUtc).getTime())
})

function isFinal(match) {
    return match.MatchNumber === 104
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })
}
function formatMatchTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-IE', {
        timeZone: 'Europe/Dublin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

</script>

<style scoped>
.matches-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.page-header {
    margin-bottom: 1.5rem;
}

.week-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.week-button {
    border: none;
    background: #e5e7eb;
    color: #111827;
    padding: 0.85rem 1rem;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
}

.week-button:hover {
    background: #dbeafe;
}

.week-button.active {
    background: #2563eb;
    color: white;
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

.matches-list {
    display: grid;
    gap: 1rem;
}

.match-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
    background: white;
}

.match-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.match-date {
    font-size: 0.9rem;
    color: #6b7280;
}

.match-tag {
    background: #2563eb;
    color: white;
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
}

.match-content {
    display: grid;
    grid-template-columns: 1fr 100px 1fr;
    gap: 1rem;
    align-items: center;
}

.team {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.team-name {
    font-weight: 600;
}

.team-person {
    color: #4b5563;
}

.score {
    display: flex;
    align-items: center;
    justify-content: center;
}

.score-display {
    font-size: 1.5rem;
    font-weight: 700;
}

.score-pending {
    color: #9ca3af;
}
</style>

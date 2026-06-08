<template>
  <div class="pool-results">
    <div class="standings-section">
      <h2>Pool Standings</h2>

      <div v-if="loading" class="loading">Loading matches...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="standings-table">
        <div class="header">
          <div class="rank">#</div>
          <div class="name">Player</div>
          <div class="points">Points</div>
          <div class="teams">Teams</div>
        </div>

        <div
          v-for="(standing, index) in standings"
          :key="standing.person"
          class="standing-row"
        >
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

    <div class="group-standings-section">
      <h2>Group Standings</h2>
      <div v-for="group in groups" :key="group.id" class="group">
        <h3>{{ group.name }}</h3>
        <div class="group-table">
          <div class="header">
            <div class="team">Team</div>
            <div class="stats">M</div>
            <div class="stats">W</div>
            <div class="stats">D</div>
            <div class="stats">L</div>
            <div class="stats">GF</div>
            <div class="stats">GA</div>
            <div class="points">Pts</div>
            <div class="person">Pool Person</div>
          </div>

          <div
            v-for="team in groupStandings[group.id] || []"
            :key="team.name"
            class="team-row"
          >
            <div class="team">{{ team.name }}</div>
            <div class="stats">{{ team.matches }}</div>
            <div class="stats">{{ team.wins }}</div>
            <div class="stats">{{ team.draws }}</div>
            <div class="stats">{{ team.losses }}</div>
            <div class="stats">{{ team.goalsFor }}</div>
            <div class="stats">{{ team.goalsAgainst }}</div>
            <div class="points"><strong>{{ team.points }}</strong></div>
            <div class="person">
              {{ getPersonForTeam(team.name) || "—" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="matches-section">
      <h2>Recent Matches</h2>
      <div
        v-for="match in recentMatches"
        :key="match.MatchNumber"
        class="match-card"
      >
        <div class="match-date">{{ formatDate(match.DateUtc) }}</div>
        <div class="match-content">
          <div class="team home">
            <div class="team-name">{{ match.HomeTeam }}</div>
            <div class="team-person">
              {{ getPersonForTeam(match.HomeTeam) || "—" }}
            </div>
          </div>

          <div class="score">
            <div v-if="match.HomeTeamScore !== null" class="score-display">
              {{ match.HomeTeamScore }} - {{ match.AwayTeamScore }}
            </div>
            <div v-else class="score-pending">vs</div>
          </div>

          <div class="team away">
            <div class="team-name">{{ match.AwayTeam }}</div>
            <div class="team-person">
              {{ getPersonForTeam(match.AwayTeam) || "—" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getMatches } from "@/utils/fetchMatches.js";
import { calculateStandings, getGroupStandings } from "@/utils/scoring.js";
import { getPersonForTeam, poolParticipants } from "@/data/people.js";
import { groups } from "@/data/groups.js";

const loading = ref(true);
const error = ref(null);
const matches = ref([]);
const standings = ref([]);
const groupStandings = ref({});

onMounted(async () => {
  try {
    matches.value = await getMatches();
    standings.value = calculateStandings(matches.value, poolParticipants);

    // Calculate standings for each group
    const groupMap = {};
    groups.forEach((group) => {
      groupMap[group.id] = getGroupStandings(group.id, matches.value);
    });
    groupStandings.value = groupMap;

    loading.value = false;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
});

const recentMatches = computed(() => {
  return matches.value
    .filter((m) => m.Group !== null) // Only group stage
    .sort(
      (a, b) =>
        new Date(b.DateUtc).getTime() - new Date(a.DateUtc).getTime()
    )
    .slice(0, 10);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
.pool-results {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Standings Table */
.standings-table,
.group-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.header {
  display: grid;
  grid-template-columns: 50px 150px 80px 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f0f0f0;
  font-weight: bold;
  border-bottom: 2px solid #333;
}

.group-table .header {
  grid-template-columns: 150px repeat(7, 60px) 150px;
  gap: 0.5rem;
}

.standing-row {
  display: grid;
  grid-template-columns: 50px 150px 80px 1fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  align-items: center;
}

.team-row {
  display: grid;
  grid-template-columns: 150px repeat(7, 60px) 150px;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  align-items: center;
  text-align: center;
}

.rank {
  font-weight: bold;
  text-align: center;
}

.name {
  font-weight: 500;
}

.points {
  text-align: center;
  font-size: 1.1em;
}

.team-badge {
  display: inline-block;
  background: #e0e7ff;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85em;
  margin: 0.25rem;
}

.group-standings-section {
  margin-top: 2rem;
}

.group {
  margin-bottom: 2rem;
}

.group h3 {
  margin-bottom: 0.5rem;
}

.team {
  text-align: left;
  font-weight: 500;
}

.stats {
  text-align: center;
}

.person {
  text-align: left;
  font-size: 0.9em;
}

/* Matches Section */
.matches-section {
  margin-top: 2rem;
}

.match-card {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
}

.match-date {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 0.5rem;
}

.match-content {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: 1rem;
  align-items: center;
}

.team {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.team-name {
  font-weight: 500;
}

.team-person {
  font-size: 0.85em;
  color: #666;
}

.score {
  text-align: center;
}

.score-display {
  font-size: 1.5em;
  font-weight: bold;
}

.score-pending {
  color: #999;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 0.5rem;
}
</style>

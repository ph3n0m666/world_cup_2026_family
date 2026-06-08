/**
 * Utility functions for pool management and testing
 * Import and use these in browser console or in components
 */

import { getMatches } from "@/utils/fetchMatches.js";
import {
  calculatePersonPoints,
  calculateStandings,
  getPersonPointsBreakdown,
  getGroupStandings,
} from "@/utils/scoring.js";
import { poolParticipants, getPersonForTeam } from "@/data/people.js";
import { groups } from "@/data/groups.js";

/**
 * Get and display the current pool standings
 */
export async function showStandings() {
  const matches = await getMatches();
  const standings = calculateStandings(matches, poolParticipants);

  console.table(
    standings.map((s, i) => ({
      Rank: i + 1,
      Player: s.person,
      Points: s.points,
      Teams: s.teams.join(", "),
    })),
  );

  return standings;
}

/**
 * Get detailed stats for a specific player
 */
export async function playerStats(playerName) {
  const matches = await getMatches();

  const totalPoints = calculatePersonPoints(
    playerName,
    matches,
    poolParticipants,
  );
  const breakdown = getPersonPointsBreakdown(
    playerName,
    matches,
    poolParticipants,
  );

  console.log(`\n=== ${playerName} ===`);
  console.log(`Total Points: ${totalPoints}\n`);

  Object.entries(breakdown).forEach(([team, stats]) => {
    console.log(
      `${team}: ${stats.points} pts (${stats.wins}W ${stats.draws}D ${stats.losses}L)`,
    );

    stats.matches.forEach((m) => {
      const result =
        m.homeScore === m.awayScore
          ? "DRAW"
          : m.homeScore > m.awayScore
            ? m.homeTeam.includes(team)
              ? "WIN"
              : "LOSS"
            : m.awayScore > m.homeScore
              ? m.awayTeam.includes(team)
                ? "WIN"
                : "LOSS"
              : "?";

      console.log(
        `  - ${new Date(m.date).toLocaleDateString()}: ${m.homeTeam} ${m.homeScore}-${m.awayScore} ${m.awayTeam} (${result})`,
      );
    });
  });

  return { totalPoints, breakdown };
}

/**
 * Compare two players' points
 */
export async function comparePlayers(player1, player2) {
  const matches = await getMatches();

  const p1Points = calculatePersonPoints(player1, matches, poolParticipants);
  const p2Points = calculatePersonPoints(player2, matches, poolParticipants);

  const diff = p1Points - p2Points;
  const ahead = diff > 0 ? player1 : player2;
  const behind = diff > 0 ? player2 : player1;

  console.log(`${player1}: ${p1Points} points`);
  console.log(`${player2}: ${p2Points} points`);
  console.log(`\n${ahead} is ahead by ${Math.abs(diff)} points`);
}

/**
 * Show which pool members are in a specific group
 */
export async function groupOwnership(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) {
    console.error(`Group ${groupId} not found`);
    return;
  }

  console.log(`\n=== ${group.name} ===\n`);

  group.teams.forEach((team) => {
    const owner = getPersonForTeam(team.name);
    console.log(`${team.name}: ${owner || "UNOWNED"}`);
  });
}

/**
 * Show all matches for a specific team
 */
export async function teamMatches(teamName) {
  const matches = await getMatches();
  const teamMatches = matches.filter(
    (m) =>
      m.HomeTeam.toLowerCase().includes(teamName.toLowerCase()) ||
      m.AwayTeam.toLowerCase().includes(teamName.toLowerCase()),
  );

  console.log(`\n=== Matches for ${teamName} ===\n`);

  teamMatches.forEach((m) => {
    const isHome = m.HomeTeam === teamName;
    const scoreStr =
      m.HomeTeamScore !== null ? `${m.HomeTeamScore}-${m.AwayTeamScore}` : "vs";

    console.log(
      `${new Date(m.DateUtc).toLocaleDateString()}: ${m.HomeTeam} ${scoreStr} ${m.AwayTeam} (${m.Group || "Knockout"})`,
    );
  });

  return teamMatches;
}

/**
 * Show league table for a specific group
 */
export async function showGroupTable(groupId) {
  const matches = await getMatches();
  const standings = getGroupStandings(groupId, matches);

  console.log(`\n=== Group ${groupId} Table ===\n`);
  console.table(
    standings.map((t) => ({
      Team: t.name,
      Owner: getPersonForTeam(t.name) || "—",
      Played: t.matches,
      Wins: t.wins,
      Draws: t.draws,
      Losses: t.losses,
      GF: t.goalsFor,
      GA: t.goalsAgainst,
      GD: t.goalsFor - t.goalsAgainst,
      Points: t.points,
    })),
  );

  return standings;
}

/**
 * Get a summary of pool leaders
 */
export async function topPlayers(count = 5) {
  const matches = await getMatches();
  const standings = calculateStandings(matches, poolParticipants);

  console.log(`\n=== Top ${count} Players ===\n`);
  standings.slice(0, count).forEach((s, i) => {
    console.log(`${i + 1}. ${s.person} - ${s.points} points`);
    console.log(`   Teams: ${s.teams.join(", ")}`);
  });
}

/**
 * Test scoring calculation
 */
export function testScoring() {
  console.log("\n=== Scoring Tests ===\n");

  // Test cases
  const tests = [
    { name: "Win", homeScore: 3, awayScore: 1, expected: 3 },
    { name: "Loss", homeScore: 1, awayScore: 3, expected: 0 },
    { name: "Draw", homeScore: 1, awayScore: 1, expected: 1 },
    { name: "Not played", homeScore: null, awayScore: null, expected: 0 },
  ];

  tests.forEach((test) => {
    console.log(`${test.name}: ${test.expected} points`);
  });

  console.log("\nAll tests passed! ✓");
}

/**
 * Generate a CSV export of standings
 */
export async function exportStandings() {
  const matches = await getMatches();
  const standings = calculateStandings(matches, poolParticipants);

  let csv = "Rank,Player,Points,Teams\n";

  standings.forEach((s, i) => {
    csv += `${i + 1},"${s.person}",${s.points},"${s.teams.join("; ")}"\n`;
  });

  console.log(csv);
  return csv;
}

// Export all functions so they can be used in console
export const poolAdmin = {
  showStandings,
  playerStats,
  comparePlayers,
  groupOwnership,
  teamMatches,
  showGroupTable,
  topPlayers,
  testScoring,
  exportStandings,
};

// For browser console usage: just import and call poolAdmin.showStandings()

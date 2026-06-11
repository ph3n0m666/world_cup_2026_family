/**
 * Scoring and standings calculation for World Cup 2026 Pool
 *
 * Group Stage Rules:
 * - Win: 3 points
 * - Draw: 1 point
 * - Loss: 0 points
 */

import {
  getPersonForTeam,
  normalizeTeamName,
  poolParticipants,
} from "../data/people.js";

/**
 * Calculate points from a match result
 * @param {string} teamName - Team name
 * @param {number|null} homeScore - Home team score (or null if not yet played)
 * @param {string} homeTeam - Home team name
 * @param {number|null} awayScore - Away team score (or null if not yet played)
 * @param {string} awayTeam - Away team name
 * @returns {number} Points earned (0, 1, or 3)
 */
export function calculateMatchPoints(
  teamName,
  homeScore,
  homeTeam,
  awayScore,
  awayTeam,
) {
  const normalized = normalizeTeamName(teamName);
  const normalizedHome = normalizeTeamName(homeTeam);
  const normalizedAway = normalizeTeamName(awayTeam);

  // Match not yet played
  if (homeScore === null || awayScore === null) {
    return 0;
  }

  if (normalized === normalizedHome) {
    if (homeScore > awayScore) return 3; // Win
    if (homeScore === awayScore) return 1; // Draw
    return 0; // Loss
  } else if (normalized === normalizedAway) {
    if (awayScore > homeScore) return 3; // Win
    if (awayScore === homeScore) return 1; // Draw
    return 0; // Loss
  }

  return 0; // Team not in this match
}

/**
 * Calculate total points for a person across all their team matches
 * @param {string} person - Person's name
 * @param {Array} matches - Array of match objects with scores
 * @param {Object} poolParticipants - Person to teams mapping
 * @returns {number} Total points
 */
export function calculatePersonPoints(person, matches, poolParticipants) {
  const personTeams = poolParticipants[person] || [];
  let totalPoints = 0;

  matches.forEach((match) => {
    personTeams.forEach((team) => {
      totalPoints += calculateMatchPoints(
        team,
        match.HomeTeamScore,
        match.HomeTeam,
        match.AwayTeamScore,
        match.AwayTeam,
      );
    });
  });

  return totalPoints;
}

/**
 * Get detailed breakdown of points for a person
 * @param {string} person - Person's name
 * @param {Array} matches - Array of match objects
 * @param {Object} poolParticipants - Person to teams mapping
 * @returns {Object} Detailed points breakdown
 */
export function getPersonPointsBreakdown(person, matches, poolParticipants) {
  const personTeams = poolParticipants[person] || [];
  const breakdown = {};

  personTeams.forEach((team) => {
    breakdown[team] = {
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      matches: [],
    };
  });

  matches.forEach((match) => {
    personTeams.forEach((team) => {
      const points = calculateMatchPoints(
        team,
        match.HomeTeamScore,
        match.HomeTeam,
        match.AwayTeamScore,
        match.AwayTeam,
      );

      if (points > 0 || match.HomeTeamScore !== null) {
        const normalized = normalizeTeamName(team);
        const normalizedHome = normalizeTeamName(match.HomeTeam);
        const normalizedAway = normalizeTeamName(match.AwayTeam);

        if (normalized === normalizedHome || normalized === normalizedAway) {
          breakdown[team].points += points;
          breakdown[team].matches.push({
            matchNumber: match.MatchNumber,
            opponent:
              normalized === normalizedHome ? match.AwayTeam : match.HomeTeam,
            homeTeam: match.HomeTeam,
            awayTeam: match.AwayTeam,
            homeScore: match.HomeTeamScore,
            awayScore: match.AwayTeamScore,
            date: match.DateUtc,
          });

          if (points === 3) breakdown[team].wins++;
          else if (points === 1) breakdown[team].draws++;
          else if (match.HomeTeamScore !== null) breakdown[team].losses++;
        }
      }
    });
  });

  return breakdown;
}

/**
 * Calculate standings for all people in the pool
 * @param {Array} matches - Array of match objects
 * @param {Object} poolParticipants - Person to teams mapping
 * @returns {Array} Sorted standings array
 */
export function calculateStandings(matches, poolParticipants) {
  const standings = [];

  Object.keys(poolParticipants).forEach((person) => {
    const points = calculatePersonPoints(person, matches, poolParticipants);
    standings.push({
      person,
      points,
      teams: poolParticipants[person],
    });
  });

  // Sort by points descending, then by person name alphabetically
  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.person.localeCompare(b.person);
  });

  return standings;
}

/**
 * Get group stage standings for a specific group
 * @param {string} groupId - Group identifier (A, B, C, etc.)
 * @param {Array} matches - All matches
 * @returns {Array} Teams in group with points, wins, draws, losses
 */
export function getGroupStandings(groupId, matches) {
  const groupMatches = matches.filter(
    (match) => match.Group === `Group ${groupId}`,
  );
  const teams = new Map();

  groupMatches.forEach((match) => {
    const homeTeam = normalizeTeamName(match.HomeTeam);
    const awayTeam = normalizeTeamName(match.AwayTeam);

    if (!teams.has(homeTeam)) {
      teams.set(homeTeam, {
        name: match.HomeTeam,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        matches: 0,
      });
    }

    if (!teams.has(awayTeam)) {
      teams.set(awayTeam, {
        name: match.AwayTeam,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        matches: 0,
      });
    }

    const homeStats = teams.get(homeTeam);
    const awayStats = teams.get(awayTeam);

    if (match.HomeTeamScore !== null && match.AwayTeamScore !== null) {
      homeStats.matches++;
      awayStats.matches++;
      homeStats.goalsFor += match.HomeTeamScore;
      homeStats.goalsAgainst += match.AwayTeamScore;
      awayStats.goalsFor += match.AwayTeamScore;
      awayStats.goalsAgainst += match.HomeTeamScore;

      if (match.HomeTeamScore > match.AwayTeamScore) {
        homeStats.points += 3;
        homeStats.wins++;
        awayStats.losses++;
      } else if (match.HomeTeamScore < match.AwayTeamScore) {
        awayStats.points += 3;
        awayStats.wins++;
        homeStats.losses++;
      } else {
        homeStats.points += 1;
        awayStats.points += 1;
        homeStats.draws++;
        awayStats.draws++;
      }
    }
  });

  const standings = Array.from(teams.values());
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aDiff = a.goalsFor - a.goalsAgainst;
    const bDiff = b.goalsFor - b.goalsAgainst;
    if (bDiff !== aDiff) return bDiff - aDiff;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

/**
 * Get eliminated pool teams from match results.
 * Teams are eliminated if they fail to advance from a completed group
 * or if they lose a knockout match.
 * @param {Array} matches
 * @returns {Set<string>} Normalized team names
 */
export function getEliminatedTeams(matches) {
  const eliminated = new Set();
  const poolTeamSet = new Set(
    Object.values(poolParticipants).flat().map(normalizeTeamName),
  );

  const groupMatchesById = {};
  matches
    .filter(
      (match) =>
        typeof match.Group === "string" && match.Group.startsWith("Group "),
    )
    .forEach((match) => {
      const groupId = match.Group.replace("Group ", "");
      groupMatchesById[groupId] = groupMatchesById[groupId] || [];
      groupMatchesById[groupId].push(match);
    });

  Object.entries(groupMatchesById).forEach(([groupId, groupMatches]) => {
    const complete = groupMatches.every(
      (match) => match.HomeTeamScore !== null && match.AwayTeamScore !== null,
    );

    if (!complete) return;

    const standingsForGroup = getGroupStandings(groupId, matches);
    const advancing = new Set(
      standingsForGroup.slice(0, 2).map((team) => normalizeTeamName(team.name)),
    );

    standingsForGroup.forEach((team) => {
      const normalized = normalizeTeamName(team.name);
      if (!advancing.has(normalized) && poolTeamSet.has(normalized)) {
        eliminated.add(normalized);
      }
    });
  });

  matches
    .filter((match) => !match.Group)
    .forEach((match) => {
      if (match.HomeTeamScore === null || match.AwayTeamScore === null) return;

      const home = normalizeTeamName(match.HomeTeam);
      const away = normalizeTeamName(match.AwayTeam);

      let loser = null;
      if (match.HomeTeamScore > match.AwayTeamScore) loser = away;
      else if (match.HomeTeamScore < match.AwayTeamScore) loser = home;
      else if (match.Winner) {
        const winnerName = normalizeTeamName(match.Winner);
        if (winnerName === home) loser = away;
        else if (winnerName === away) loser = home;
      }

      if (loser && poolTeamSet.has(loser)) {
        eliminated.add(loser);
      }
    });

  return eliminated;
}

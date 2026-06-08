/**
 * World Cup 2026 Pool - People and their associated teams
 */

export const poolParticipants = {
  Tomato: ["Scotland", "Egypt", "Germany"],
  Aisling: ["Tunisia", "Sweden", "Colombia"],
  "Cathy Rose": ["Panama", "Czechia", "Netherlands"],
  Dad: ["Qatar", "Canada", "Portugal"],
  Jack: ["DR Congo", "Australia", "Spain"],
  Ciara: ["Iraq", "Ecuador", "Uruguay"],
  Ve: ["Uzbekistan", "Austria", "Croatia"],
  Ryan: ["Saudi Arabia", "Türkiye", "Argentina"],
  Ed: ["South Africa", "Paraguay", "Belgium"],
  Carrie: ["Jordan", "Iran", "France"],
  Ross: ["Cape Verde", "South Korea", "Senegal"],
  Kim: ["Bosnia & Herzegovina", "Ivory Coast", "United States"],
  Roisin: ["Ghana", "Algeria", "England"],
  Dean: ["Haiti", "Norway", "Brazil"],
  "Catch/Pete": ["Curacao", "Switzerland", "Morocco"],
  Al: ["New Zealand", "Japan", "Mexico"],
};

/**
 * Build a reverse lookup: team -> person
 */
export function buildTeamToPerson() {
  const teamToPerson = {};

  Object.entries(poolParticipants).forEach(([person, teams]) => {
    teams.forEach((team) => {
      teamToPerson[team] = person;
    });
  });

  return teamToPerson;
}

/**
 * Normalize team names to match both API and local data
 * (handles variations like "DR Congo" vs "Congo DR", "Côte d'Ivoire" vs "Ivory Coast", etc.)
 */
export const teamNameMapping = {
  "Congo DR": "DR Congo",
  "Côte d'Ivoire": "Ivory Coast",
  "IR Iran": "Iran",
  "Korea Republic": "South Korea",
  Curacao: "Curacao",
  Curaçao: "Curacao",
  "Cabo Verde": "Cape Verde",
  USA: "United States",
  "Bosnia and Herzegovina": "Bosnia & Herzegovina",
};

/**
 * Normalize a team name to match the pool data
 */
export function normalizeTeamName(teamName) {
  return teamNameMapping[teamName] || teamName;
}

/**
 * Get the person associated with a team
 */
export function getPersonForTeam(teamName) {
  const normalized = normalizeTeamName(teamName);
  const teamToPerson = buildTeamToPerson();
  return teamToPerson[normalized];
}

/**
 * Get all people in the pool
 */
export function getAllPeople() {
  return Object.keys(poolParticipants);
}

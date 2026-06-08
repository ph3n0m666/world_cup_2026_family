# World Cup 2026 Pool - Results Tracker

## Overview
This is a World Cup 2026 pool tracker that stores match results and calculates standings for 16 pool participants. Each person is associated with 3 teams, and points are earned based on their teams' performance.

## Pool Participants & Teams

| Person | Teams |
|--------|-------|
| Tomato | Scotland, Egypt, Germany |
| Aisling | Tunisia, Sweden, Colombia |
| Cathy Rose | Panama, Czechia, Netherlands |
| Dad | Qatar, Canada, Portugal |
| Jack | DR Congo, Australia, Spain |
| Ciara | Iraq, Ecuador, Uruguay |
| Ve | Uzbekistan, Austria, Croatia |
| Ryan | Saudi Arabia, Türkiye, Argentina |
| Ed | South Africa, Paraguay, Belgium |
| Carrie | Jordan, Iran, France |
| Ross | Cape Verde, South Korea, Senegal |
| Kim | Bosnia & Herzegovina, Ivory Coast, United States |
| Roisin | Ghana, Algeria, England |
| Dean | Haiti, Norway, Brazil |
| Cathy Pete | Curacao, Switzerland, Morocco |
| Al | New Zealand, Japan, Mexico |

## Scoring System

### Group Stage
- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

Each person earns points for **all 3 of their teams' group matches**. So if one of your teams wins, you get 3 points toward your pool score.

### Knockout Stage
(To be implemented: Points for predictions or actual match results)

## Project Structure

```
src/
├── data/
│   ├── people.js          # Pool participants and teams
│   ├── groups.js          # Group compositions and team flags
│   └── matches.json       # Match fixtures and results
├── utils/
│   ├── fetchMatches.js    # API fetching with 24h cache
│   └── scoring.js         # Scoring and standings calculations
└── components/
    └── PoolResults.vue    # Main results display component
```

## Key Files

### `src/data/people.js`
Contains pool participants and utility functions:
- `poolParticipants` - Object mapping person name to their 3 teams
- `getPersonForTeam(teamName)` - Get who owns a specific team
- `normalizeTeamName(teamName)` - Normalize team names (handles API variations)

### `src/utils/scoring.js`
Scoring and standings logic:
- `calculateMatchPoints(team, homeScore, homeTeam, awayScore, awayTeam)` - Points earned from one match
- `calculatePersonPoints(person, matches, poolParticipants)` - Total points for a person
- `calculateStandings(matches, poolParticipants)` - Pool standings sorted by points
- `getGroupStandings(groupId, matches)` - FIFA group standings (for reference)

### `src/components/PoolResults.vue`
Main component that displays:
1. **Pool Standings** - Ranked list of all 16 players with their points
2. **Group Standings** - FIFA group tables with goal differential
3. **Recent Matches** - Latest match results with scores and associated pool members

## Updating Results

Match results are automatically fetched from:
```
https://fixturedownload.com/feed/json/fifa-world-cup-2026
```

The data is cached for 24 hours in browser localStorage. To refresh:

```javascript
import { clearMatchesCache, getMatches } from '@/utils/fetchMatches'

// Clear cache and fetch fresh data
clearMatchesCache()
const freshMatches = await getMatches()
```

Or use the package.json script:
```bash
npm run update-fixtures  # Updates the cached JSON
```

## Using PoolResults Component

Add to any Vue page:

```vue
<template>
  <PoolResults />
</template>

<script setup>
import PoolResults from '@/components/PoolResults.vue'
</script>
```

The component:
- Fetches match data automatically on mount
- Calculates all standings and group tables
- Displays everything in a responsive layout
- Shows which pool member owns each team

## Example: Getting a Specific Player's Score

```javascript
import { calculatePersonPoints, getPersonPointsBreakdown } from '@/utils/scoring'
import { poolParticipants } from '@/data/people'

const matches = await getMatches()

// Get total points
const tomato_points = calculatePersonPoints('Tomato', matches, poolParticipants)
console.log(`Tomato has ${tomato_points} points`)

// Get detailed breakdown
const breakdown = getPersonPointsBreakdown('Tomato', matches, poolParticipants)
console.log(breakdown)
// Output:
// {
//   Scotland: { points: 3, wins: 1, draws: 0, losses: 0, matches: [...] },
//   Egypt: { points: 1, wins: 0, draws: 1, losses: 0, matches: [...] },
//   Germany: { points: 6, wins: 2, draws: 0, losses: 0, matches: [...] }
// }
```

## Data Format

### Match Object
```javascript
{
  "MatchNumber": 1,
  "RoundNumber": 1,
  "DateUtc": "2026-06-11T19:00:00Z",
  "Location": "Mexico City Stadium",
  "HomeTeam": "Mexico",
  "AwayTeam": "South Africa",
  "Group": "Group A",
  "HomeTeamScore": 2,      // null if match not yet played
  "AwayTeamScore": 1,      // null if match not yet played
  "Winner": "Mexico"       // or empty string if draw/not played
}
```

## Notes on Team Name Normalization

Some team names vary between the API and pool data. The system auto-normalizes:
- "Congo DR" ↔ "DR Congo"
- "Côte d'Ivoire" ↔ "Ivory Coast"
- "IR Iran" ↔ "Iran"
- "Korea Republic" ↔ "South Korea"
- "Curaçao" ↔ "Curacao"

If you add more teams or find variations, update the `teamNameMapping` in `src/data/people.js`.

## Future Features
- [ ] Knockout stage predictions/results
- [ ] Email notifications when standings change
- [ ] Historical standings view
- [ ] Individual team performance charts
- [ ] Head-to-head player stats

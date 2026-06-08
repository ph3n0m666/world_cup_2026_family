# World Cup 2026 Pool Tracker

A Vue 3 application for tracking World Cup 2026 match results and calculating pool standings for 16 participants.

## Features

- **Pool Standings** - Real-time leaderboard of all 16 players
- **Automatic Scoring** - Points calculated from official match results
- **Group Tables** - FIFA-style standings for each group (for reference)
- **Match Results** - View recent results with pool member associations
- **Team Ownership** - See which pool member owns each team
- **24-Hour Cache** - Fresh data daily from live API

## How It Works

### The Pool
- **16 participants**, each owning **3 teams**
- Points earned when teams win/draw their group matches
- **Win = 3 points**, **Draw = 1 point**, **Loss = 0 points**
- Final standings show cumulative points across all 3 teams

### Example
If a participant owns Scotland, Egypt, and Germany:
- Scotland wins (3 pts) + Egypt draws (1 pt) + Germany wins (3 pts) = **7 points** for that participant

## Pool Members

| Participant | Teams |
|-------------|-------|
| Participant 1 | New Zealand, Japan, Mexico |
| Participant 2 | Tunisia, Sweden, Colombia |
| Participant 3 | Jordan, Iran, France |
| Participant 4 | Curacao, Switzerland, Morocco |
| Participant 5 | Panama, Czechia, Netherlands |
| Participant 6 | Iraq, Ecuador, Uruguay |
| Participant 7 | Qatar, Canada, Portugal |
| Participant 8 | Haiti, Norway, Brazil |
| Participant 9 | South Africa, Paraguay, Belgium |
| Participant 10 | DR Congo, Australia, Spain |
| Participant 11 | Bosnia & Herzegovina, Ivory Coast, United States |
| Participant 12 | Ghana, Algeria, England |
| Participant 13 | Cape Verde, South Korea, Senegal |
| Participant 14 | Saudi Arabia, Türkiye, Argentina |
| Participant 15 | Scotland, Egypt, Germany |
| Participant 16 | Uzbekistan, Austria, Croatia |

## Project Structure

```
src/
├── components/
│   └── PoolResults.vue          # Main results display
├── data/
│   ├── people.js                # Pool participants and teams
│   ├── groups.js                # Group compositions
│   └── matches.json             # Match fixtures/results (cached)
└── utils/
    ├── fetchMatches.js          # API fetching with 24h cache
    ├── scoring.js               # Points and standings calculations
    └── poolAdmin.js             # Testing/debugging utilities
```

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Update Match Data
```bash
npm run update-fixtures  # Fetch latest from API
npm run build:fresh      # Build with fresh data
```

## Usage in Code

### Get Pool Standings
```javascript
import { getMatches } from '@/utils/fetchMatches'
import { calculateStandings } from '@/utils/scoring'
import { poolParticipants } from '@/data/people'

const matches = await getMatches()
const standings = calculateStandings(matches, poolParticipants)
standings.forEach(s => console.log(`${s.person}: ${s.points} pts`))
```

### Get One Player's Stats
```javascript
import { getPersonPointsBreakdown } from '@/utils/scoring'

const breakdown = getPersonPointsBreakdown('Participant 15', matches, poolParticipants)
// Shows points per team + match history
```

### Show Group Ownership
```javascript
import { getPersonForTeam } from '@/data/people'

console.log(getPersonForTeam('Germany'))  // "Participant 15"
```

## Data Source

Match results are fetched from:
```
https://fixturedownload.com/feed/json/fifa-world-cup-2026
```

Updates daily at midnight UTC. Browser caches for 24 hours.

## Documentation

- **[POOL_QUICKSTART.md](POOL_QUICKSTART.md)** - Getting started guide
- **[POOL_STRUCTURE.md](POOL_STRUCTURE.md)** - Complete API documentation
- **[DATA_FRESHNESS.md](DATA_FRESHNESS.md)** - Data refresh strategies

## Developer Tools

For testing and debugging in browser console:

```javascript
import { poolAdmin } from '@/utils/poolAdmin'

// Show current standings
await poolAdmin.showStandings()

// Get one player's detailed stats
await poolAdmin.playerStats('Tomato')

// Compare two players
await poolAdmin.comparePlayers('Tomato', 'Aisling')

// Show group table
await poolAdmin.showGroupTable('A')

// Find all matches for a team
await poolAdmin.teamMatches('Germany')

// Export standings as CSV
await poolAdmin.exportStandings()
```

## Tech Stack

- **Vue 3** - UI framework
- **Vite** - Build tool
- **Fetch API** - Data loading
- **localStorage** - Caching

## License

MIT

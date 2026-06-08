# World Cup 2026 Pool - Quick Start

## What Changed?

Your project is now a **results tracker and pool standings calculator** instead of a predictor.

### New Features:
✅ **Pool Participants** - 16 people with 3 teams each
✅ **Automatic Scoring** - Points calculated from real match results
✅ **Live Standings** - Real-time pool leaderboard
✅ **Group Tables** - FIFA-style group standings for reference
✅ **Result Display** - See which pool member owns each team

## How It Works

### Scoring (Group Stage Only)
- Your team **wins** → You get **3 points**
- Your team **draws** → You get **1 point**
- Your team **loses** → You get **0 points**

Each person owns 3 teams, so you can earn up to 9 points per round (if all 3 teams win).

### Example
Tomato owns: Scotland, Egypt, Germany

If Scotland wins (3 pts) + Egypt draws (1 pt) + Germany wins (3 pts) = **7 points** added to Tomato's total

## Files Created/Updated

### Data Files
- **`src/data/people.js`** - Pool participants and team mappings
  - Contains your 16 people and their 3 teams each
  - Utilities for team↔person lookup
  - Team name normalization

### Utility Files
- **`src/utils/scoring.js`** - All scoring logic
  - `calculatePersonPoints()` - Get a player's total points
  - `calculateStandings()` - Get full pool leaderboard
  - `getGroupStandings()` - Get FIFA group tables
  - `getPersonPointsBreakdown()` - Detailed breakdown per team

### Components
- **`src/components/PoolResults.vue`** - Main display component
  - Pool standings table
  - Group standings tables
  - Recent match results
  - Shows which player owns each team

### Documentation
- **`POOL_STRUCTURE.md`** - Detailed structure and API reference

## Using It

### Display in Your App
The `App.vue` is already updated. Just ensure PoolResults is imported:

```vue
<PoolResults />
```

### Check Someone's Score
```javascript
import { calculatePersonPoints } from '@/utils/scoring'
import { poolParticipants } from '@/data/people'
import { getMatches } from '@/utils/fetchMatches'

const matches = await getMatches()
const tomatoScore = calculatePersonPoints('Tomato', matches, poolParticipants)
console.log(`Tomato: ${tomatoScore} points`)
```

### Get Full Standings
```javascript
import { calculateStandings } from '@/utils/scoring'
import { poolParticipants } from '@/data/people'

const matches = await getMatches()
const standings = calculateStandings(matches, poolParticipants)

standings.forEach(s => {
  console.log(`${s.person}: ${s.points} pts`)
})
```

### Get Detailed Breakdown for One Player
```javascript
import { getPersonPointsBreakdown } from '@/utils/scoring'
import { poolParticipants } from '@/data/people'

const breakdown = getPersonPointsBreakdown('Tomato', matches, poolParticipants)
console.log(breakdown)
// {
//   Scotland: { points: 3, wins: 1, draws: 0, losses: 0, matches: [...] },
//   Egypt: { points: 1, wins: 0, draws: 1, losses: 0, matches: [...] },
//   Germany: { points: 3, wins: 1, draws: 0, losses: 0, matches: [...] }
// }
```

## Data Freshness

Match results are fetched from this API (updates daily):
```
https://fixturedownload.com/feed/json/fifa-world-cup-2026
```

- **First load**: Fetches from API
- **Same day**: Uses cached data (24h cache)
- **Next day**: Auto-refreshes from API
- **Offline**: Uses cached data as fallback

### Manual Refresh
```javascript
import { clearMatchesCache, getMatches } from '@/utils/fetchMatches'

clearMatchesCache()
const fresh = await getMatches()
```

Or use npm script:
```bash
npm run update-fixtures
```

## Testing Scores

To verify the scoring works, you can manually add scores to matches:

```javascript
import { calculateMatchPoints } from '@/utils/scoring'

// Scotland vs Brazil, Scotland wins 2-1
const points = calculateMatchPoints('Scotland', 2, 'Scotland', 1, 'Brazil')
console.log(points) // Should output: 3
```

## Pool Leaderboard Order

Players are ranked by:
1. **Total points** (highest first)
2. **Alphabetical** (tie-breaker)

## The 16 Pool Members

| # | Person | Teams |
|----|--------|-------|
| 1 | Al | New Zealand, Japan, Mexico |
| 2 | Aisling | Tunisia, Sweden, Colombia |
| 3 | Carrie | Jordan, Iran, France |
| 4 | Cathy Pete | Curacao, Switzerland, Morocco |
| 5 | Cathy Rose | Panama, Czechia, Netherlands |
| 6 | Ciara | Iraq, Ecuador, Uruguay |
| 7 | Dad | Qatar, Canada, Portugal |
| 8 | Dean | Haiti, Norway, Brazil |
| 9 | Ed | South Africa, Paraguay, Belgium |
| 10 | Jack | DR Congo, Australia, Spain |
| 11 | Kim | Bosnia & Herzegovina, Ivory Coast, United States |
| 12 | Roisin | Ghana, Algeria, England |
| 13 | Ross | Cape Verde, South Korea, Senegal |
| 14 | Ryan | Saudi Arabia, Türkiye, Argentina |
| 15 | Tomato | Scotland, Egypt, Germany |
| 16 | Ve | Uzbekistan, Austria, Croatia |

## Need to Update Teams?

If you need to change someone's teams, edit `src/data/people.js`:

```javascript
export const poolParticipants = {
  "Tomato": ["Scotland", "Egypt", "Germany"],  // ← Edit here
  // ... rest
}
```

The system will automatically:
- Recalculate all points
- Update the leaderboard
- Update group ownership displays

## Questions?

See `POOL_STRUCTURE.md` for complete API documentation.

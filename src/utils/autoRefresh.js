const MATCH_DURATION_MS = 2.5 * 60 * 60 * 1000; // 2.5 hours approximate match length
const AUTO_REFRESH_DELAY_MS = 30 * 60 * 1000; // 30 minutes after match end
let refreshTimer = null;

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function scheduleMatchRefresh(matchList, refreshFn) {
  if (typeof window === "undefined") return;
  clearRefreshTimer();

  const nextMatchFinish = getNextMatchFinishTime(matchList);
  if (nextMatchFinish === null) {
    return;
  }

  const delay = nextMatchFinish - Date.now() + AUTO_REFRESH_DELAY_MS;
  if (delay <= 0) {
    refreshFn().catch(() => {});
    return;
  }

  refreshTimer = setTimeout(() => {
    refreshFn().catch(() => {});
  }, delay);
}

export function cancelMatchRefresh() {
  clearRefreshTimer();
}

function getNextMatchFinishTime(matchList) {
  if (!Array.isArray(matchList) || !matchList.length) return null;

  const now = Date.now();
  const upcomingMatches = matchList
    .map((match) => ({
      ...match,
      start: new Date(match.DateUtc).getTime(),
    }))
    .filter((match) => match.start + MATCH_DURATION_MS > now)
    .sort((a, b) => a.start - b.start);

  if (!upcomingMatches.length) return null;
  return upcomingMatches[0].start + MATCH_DURATION_MS;
}

/**
 * Fetches FIFA World Cup 2026 fixtures from the API with intelligent caching
 * API updates once daily, so we cache for 24 hours
 */

import matchesData from "../data/matches.json";

const API_URL = "/api/matches";
const CACHE_KEY = "worldcup2026_matches";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get matches data from API or cache
 * @returns {Promise<Array>} Array of match objects
 */
export async function getMatches() {
  const cached = getCachedMatches();

  if (cached) {
    console.log("Using cached matches data (24h cache)");
    return cached;
  }

  try {
    console.log("Fetching fresh matches from API...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const matches = await response.json();

    // Cache the data
    cacheMatches(matches);
    console.log("Matches cached successfully");

    return matches;
  } catch (error) {
    console.error("Error fetching matches:", error);

    // Fallback: try to use expired cache
    const expiredCache = getExpiredCache();
    if (expiredCache) {
      console.log("Using expired cached data as fallback");
      return expiredCache;
    }

    // Final fallback: use local matches.json
    if (matchesData && Array.isArray(matchesData) && matchesData.length > 0) {
      console.log("Using local matches.json as fallback");
      return matchesData;
    }

    // Last resort: throw error
    throw new Error("Failed to fetch matches and no cached data available");
  }
}

/**
 * Get cached matches if they exist and haven't expired
 */
function getCachedMatches() {
  if (typeof window === "undefined") return null; // SSR safety

  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const data = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    if (age < CACHE_DURATION) {
      return data.matches;
    }
  } catch (e) {
    console.error("Error reading cache:", e);
  }

  return null;
}

/**
 * Get expired cache (for fallback purposes)
 */
function getExpiredCache() {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const data = JSON.parse(cached);
    return data.matches;
  } catch (e) {
    return null;
  }
}

/**
 * Cache matches data with timestamp
 */
function cacheMatches(matches) {
  if (typeof window === "undefined") return; // SSR safety

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        matches,
        timestamp: Date.now(),
      }),
    );
  } catch (e) {
    console.warn("Failed to cache matches:", e);
  }
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearMatchesCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Get cache age in seconds (returns -1 if no cache)
 */
export function getCacheAge() {
  if (typeof window === "undefined") return -1;

  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return -1;

  try {
    const data = JSON.parse(cached);
    return Math.floor((Date.now() - data.timestamp) / 1000);
  } catch (e) {
    return -1;
  }
}

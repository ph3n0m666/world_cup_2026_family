import { ref } from "vue";
import {
  getMatches as fetchMatches,
  clearMatchesCache as clearCache,
  getCacheAge as readCacheAge,
} from "@/utils/fetchMatches.js";
import { scheduleMatchRefresh } from "@/utils/autoRefresh.js";

const matches = ref([]);
const loading = ref(false);
const error = ref(null);
const cacheAge = ref(-1);
let currentLoad = null;

function updateCacheAge() {
  cacheAge.value = readCacheAge();
}

async function loadMatches(force = false) {
  if (!force && matches.value.length > 0) {
    updateCacheAge();
    scheduleMatchRefresh(matches.value, refreshMatches);
    return matches.value;
  }

  if (currentLoad) {
    return currentLoad;
  }

  loading.value = true;
  error.value = null;

  currentLoad = (async () => {
    try {
      const data = await fetchMatches();
      matches.value = data;
      updateCacheAge();
      scheduleMatchRefresh(matches.value, refreshMatches);
      return data;
    } catch (err) {
      error.value = err.message || "Failed to load matches";
      throw err;
    } finally {
      loading.value = false;
      currentLoad = null;
    }
  })();

  return currentLoad;
}

async function refreshMatches() {
  clearCache();
  updateCacheAge();
  return loadMatches(true);
}

if (typeof window !== "undefined") {
  updateCacheAge();
}

export { matches, loading, error, cacheAge, loadMatches, refreshMatches };

import { ref } from "vue";
import { groups } from "../data/groups.js";

function buildPredictions() {
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    teams: group.teams.map((team, index) => ({
      name: team.name,
      flag: team.flag,
      position: index + 1,
    })),
  }));
}

export const predictions = ref(buildPredictions());

export function usePredictions() {
  return { predictions };
}

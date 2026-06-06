export const knockoutRounds = [
  {
    name: "Round of 32",
    matches: [
      {
        id: 73,
        left: { type: "groupRunnerUp", group: "A" },
        right: { type: "groupRunnerUp", group: "B" },
      },
      {
        id: 74,
        left: { type: "groupWinner", group: "E" },
        right: { type: "groupThirdPlace", groups: ["A", "B", "C", "D", "F"] },
      },
      {
        id: 75,
        left: { type: "groupWinner", group: "F" },
        right: { type: "groupRunnerUp", group: "C" },
      },
      {
        id: 76,
        left: { type: "groupWinner", group: "C" },
        right: { type: "groupRunnerUp", group: "F" },
      },
      {
        id: 77,
        left: { type: "groupWinner", group: "I" },
        right: { type: "groupThirdPlace", groups: ["C", "D", "F", "G", "H"] },
      },
      {
        id: 78,
        left: { type: "groupRunnerUp", group: "E" },
        right: { type: "groupRunnerUp", group: "I" },
      },
      {
        id: 79,
        left: { type: "groupWinner", group: "A" },
        right: { type: "groupThirdPlace", groups: ["C", "E", "F", "H", "I"] },
      },
      {
        id: 80,
        left: { type: "groupWinner", group: "L" },
        right: { type: "groupThirdPlace", groups: ["E", "H", "I", "J", "K"] },
      },
      {
        id: 81,
        left: { type: "groupWinner", group: "D" },
        right: { type: "groupThirdPlace", groups: ["B", "E", "F", "I", "J"] },
      },
      {
        id: 82,
        left: { type: "groupWinner", group: "G" },
        right: { type: "groupThirdPlace", groups: ["A", "E", "H", "I", "J"] },
      },
      {
        id: 83,
        left: { type: "groupRunnerUp", group: "K" },
        right: { type: "groupRunnerUp", group: "L" },
      },
      {
        id: 84,
        left: { type: "groupWinner", group: "H" },
        right: { type: "groupRunnerUp", group: "J" },
      },
      {
        id: 85,
        left: { type: "groupWinner", group: "B" },
        right: { type: "groupThirdPlace", groups: ["E", "F", "G", "I", "J"] },
      },
      {
        id: 86,
        left: { type: "groupWinner", group: "J" },
        right: { type: "groupRunnerUp", group: "H" },
      },
      {
        id: 87,
        left: { type: "groupWinner", group: "K" },
        right: { type: "groupThirdPlace", groups: ["D", "E", "I", "J", "L"] },
      },
      {
        id: 88,
        left: { type: "groupRunnerUp", group: "D" },
        right: { type: "groupRunnerUp", group: "G" },
      },
    ],
  },
  {
    name: "Round of 16",
    matches: [
      {
        id: 89,
        left: { type: "matchWinner", match: 74 },
        right: { type: "matchWinner", match: 77 },
      },
      {
        id: 90,
        left: { type: "matchWinner", match: 73 },
        right: { type: "matchWinner", match: 75 },
      },
      {
        id: 91,
        left: { type: "matchWinner", match: 76 },
        right: { type: "matchWinner", match: 78 },
      },
      {
        id: 92,
        left: { type: "matchWinner", match: 79 },
        right: { type: "matchWinner", match: 80 },
      },
      {
        id: 93,
        left: { type: "matchWinner", match: 83 },
        right: { type: "matchWinner", match: 84 },
      },
      {
        id: 94,
        left: { type: "matchWinner", match: 81 },
        right: { type: "matchWinner", match: 82 },
      },
      {
        id: 95,
        left: { type: "matchWinner", match: 86 },
        right: { type: "matchWinner", match: 88 },
      },
      {
        id: 96,
        left: { type: "matchWinner", match: 85 },
        right: { type: "matchWinner", match: 87 },
      },
    ],
  },
  {
    name: "Quarter-finals",
    matches: [
      {
        id: 97,
        left: { type: "matchWinner", match: 89 },
        right: { type: "matchWinner", match: 90 },
      },
      {
        id: 98,
        left: { type: "matchWinner", match: 93 },
        right: { type: "matchWinner", match: 94 },
      },
      {
        id: 99,
        left: { type: "matchWinner", match: 91 },
        right: { type: "matchWinner", match: 92 },
      },
      {
        id: 100,
        left: { type: "matchWinner", match: 95 },
        right: { type: "matchWinner", match: 96 },
      },
    ],
  },
  {
    name: "Semi-finals",
    matches: [
      {
        id: 101,
        left: { type: "matchWinner", match: 97 },
        right: { type: "matchWinner", match: 98 },
      },
      {
        id: 102,
        left: { type: "matchWinner", match: 99 },
        right: { type: "matchWinner", match: 100 },
      },
    ],
  },
  {
    name: "Finals",
    matches: [
      {
        id: 103,
        left: { type: "matchRunnerUp", match: 101 },
        right: { type: "matchRunnerUp", match: 102 },
      },
      {
        id: 104,
        left: { type: "matchWinner", match: 101 },
        right: { type: "matchWinner", match: 102 },
      },
    ],
  },
];

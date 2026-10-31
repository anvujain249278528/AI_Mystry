// One place for every number the game depends on. See SPEC.md section "AI behavior and scoring rules".
export const difficultyRules = {
  easy: { label: 'Easy', suspects: 3, clues: 5, hints: 2, correctPoints: 100 },
  medium: { label: 'Medium', suspects: 4, clues: 7, hints: 3, correctPoints: 150 },
  hard: { label: 'Hard', suspects: 5, clues: 9, hints: 3, correctPoints: 200 },
};

export const scoring = {
  pointsPerDiscoveredClue: 5,
  pointsPerHint: -10,
  minimumScore: 0,
};

/**
 * Final score, calculated only on the server.
 * - Correct accusation: base points for the difficulty.
 * - +5 for each clue the player discovered by searching (clues on the board at the start do not count).
 * - -10 for each hint used.
 * - Never below 0.
 */
export function calculateScore({ difficulty, isCorrect, discoveredClueCount, hintsUsed }) {
  const rules = difficultyRules[difficulty];
  const basePoints = isCorrect && rules ? rules.correctPoints : 0;
  const clueBonus = discoveredClueCount * scoring.pointsPerDiscoveredClue;
  const hintPenalty = hintsUsed * scoring.pointsPerHint;
  const finalScore = Math.max(scoring.minimumScore, basePoints + clueBonus + hintPenalty);
  return { basePoints, clueBonus, hintPenalty, finalScore };
}

// The most a player can score at this difficulty: correct, every hidden clue found, no hints.
export function maxScore(difficulty, hiddenClueCount) {
  const rules = difficultyRules[difficulty];
  return (rules?.correctPoints || 0) + hiddenClueCount * scoring.pointsPerDiscoveredClue;
}

// Public part of the rules that the website may show.
export function publicRules(difficulty, hiddenClueCount) {
  const rules = difficultyRules[difficulty];
  return {
    maxHints: rules.hints, correctPoints: rules.correctPoints,
    pointsPerDiscoveredClue: scoring.pointsPerDiscoveredClue, pointsPerHint: scoring.pointsPerHint,
    maxScore: maxScore(difficulty, hiddenClueCount),
  };
}

export const CHAPTER_1_RULE = {
  totalQuestions: 6,
  minimumScore: 4,
  version: 1,
} as const;

export function isValidChapter1Score(score: number) {
  return (
    Number.isInteger(score) &&
    score >= 0 &&
    score <= CHAPTER_1_RULE.totalQuestions
  );
}

export function hasPassedChapter1(score: number) {
  return (
    isValidChapter1Score(score) &&
    score >= CHAPTER_1_RULE.minimumScore
  );
}
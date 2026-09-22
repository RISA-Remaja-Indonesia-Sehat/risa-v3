import {
  CHAPTER_1_RULE,
  hasPassedChapter1,
} from "./chapter-rules";

const GUEST_CHAPTER_1_KEY = "risa_guest_chapter_1_progress_v2";

const LEGACY_GUEST_CHAPTER_1_KEY =
  "risa_guest_chapter_1_completed";

type GuestChapter1Progress = {
  score: number;
  total: number;
  ruleVersion: number;
};

export function saveGuestChapter1Progress(score: number) {
  if (typeof window === "undefined") {
    return false;
  }

  if (!hasPassedChapter1(score)) {
    return false;
  }

  const progress: GuestChapter1Progress = {
    score,
    total: CHAPTER_1_RULE.totalQuestions,
    ruleVersion: CHAPTER_1_RULE.version,
  };

  localStorage.setItem(
    GUEST_CHAPTER_1_KEY,
    JSON.stringify(progress),
  );

  // Data boolean lama tidak lagi dipercaya.
  localStorage.removeItem(LEGACY_GUEST_CHAPTER_1_KEY);

  return true;
}

export function getGuestChapter1Score(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Nilai "true" lama mungkin berasal dari bypass 0/6.
  localStorage.removeItem(LEGACY_GUEST_CHAPTER_1_KEY);

  const rawProgress = localStorage.getItem(GUEST_CHAPTER_1_KEY);

  if (!rawProgress) {
    return null;
  }

  try {
    const progress = JSON.parse(rawProgress) as GuestChapter1Progress;

    const isCurrentRule =
      progress.total === CHAPTER_1_RULE.totalQuestions &&
      progress.ruleVersion === CHAPTER_1_RULE.version;

    if (!isCurrentRule || !hasPassedChapter1(progress.score)) {
      localStorage.removeItem(GUEST_CHAPTER_1_KEY);
      return null;
    }

    return progress.score;
  } catch {
    localStorage.removeItem(GUEST_CHAPTER_1_KEY);
    return null;
  }
}

export function isGuestChapter1Completed() {
  return getGuestChapter1Score() !== null;
}

export function clearGuestChapter1Progress() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(GUEST_CHAPTER_1_KEY);
  localStorage.removeItem(LEGACY_GUEST_CHAPTER_1_KEY);
}
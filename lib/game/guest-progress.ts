import { hasPassedChapter1 } from "./chapter-rules";

const GUEST_CHAPTER_1_KEY =
  "risa_guest_chapter_1_completed_v2";

const LEGACY_GUEST_CHAPTER_1_KEY =
  "risa_guest_chapter_1_completed";

const ABANDONED_PROGRESS_KEY =
  "risa_guest_chapter_1_progress_v2";

export function completeGuestChapter1(score: number) {
  if (typeof window === "undefined") {
    return false;
  }

  if (!hasPassedChapter1(score)) {
    return false;
  }

  localStorage.setItem(GUEST_CHAPTER_1_KEY, "true");

  // Bersihkan format lama yang tidak lagi digunakan.
  localStorage.removeItem(LEGACY_GUEST_CHAPTER_1_KEY);
  localStorage.removeItem(ABANDONED_PROGRESS_KEY);

  return true;
}

export function isGuestChapter1Completed() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(GUEST_CHAPTER_1_KEY) === "true";
}

export function clearGuestChapter1Progress() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(GUEST_CHAPTER_1_KEY);
  localStorage.removeItem(LEGACY_GUEST_CHAPTER_1_KEY);
  localStorage.removeItem(ABANDONED_PROGRESS_KEY);
}
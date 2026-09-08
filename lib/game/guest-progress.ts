const GUEST_CHAPTER_1_KEY =
  "risa_guest_chapter_1_completed";

export function isGuestChapter1Completed() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    localStorage.getItem(
      GUEST_CHAPTER_1_KEY
    ) === "true"
  );
}

export function completeGuestChapter1() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    GUEST_CHAPTER_1_KEY,
    "true"
  );
}

export function clearGuestChapter1Progress() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    GUEST_CHAPTER_1_KEY
  );
}
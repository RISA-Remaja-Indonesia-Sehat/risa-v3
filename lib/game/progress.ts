export type ProgressStatus = "locked" | "current" | "completed";

type GetChapterStatusParams = {
  chapterNumber: number;
  isChildAuthenticated: boolean;
  completedChapters: number[];
  guestChapter1Completed?: boolean;
};

export function getChapterStatus({
  chapterNumber,
  isChildAuthenticated,
  completedChapters,
  guestChapter1Completed = false,
}: GetChapterStatusParams): ProgressStatus {
  // =========================
  // USER BELUM LOGIN
  // =========================
  if (!isChildAuthenticated) {
    // Hanya Chapter 1 yang boleh dimainkan
    if (chapterNumber === 1) {
      return guestChapter1Completed ? "completed" : "current";
    }

    return "locked";
  }

  // =========================
  // USER SUDAH LOGIN
  // =========================

  if (completedChapters.includes(chapterNumber)) {
    return "completed";
  }

  const CHAPTER_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

  const nextChapter = CHAPTER_NUMBERS.find(
    (number) => !completedChapters.includes(number),
  );

  if (chapterNumber === nextChapter) {
    return "current";
  }

  return "locked";
}

type GetPostTestStatusParams = {
  isChildAuthenticated: boolean;
  completedChapters: number[];
  postTestCompleted: boolean;
};

export function getPostTestStatus({
  isChildAuthenticated,
  completedChapters,
  postTestCompleted,
}: GetPostTestStatusParams): ProgressStatus {
  // Guest tidak boleh membuka Post Test
  if (!isChildAuthenticated) {
    return "locked";
  }

  // Sudah pernah menyelesaikan Post Test
  if (postTestCompleted) {
    return "completed";
  }

  // Pastikan Chapter 1 sampai 7 semuanya selesai
  const allChaptersCompleted = [1, 2, 3, 4, 5, 6, 7].every((chapterNumber) =>
    completedChapters.includes(chapterNumber),
  );

  return allChaptersCompleted ? "current" : "locked";
}

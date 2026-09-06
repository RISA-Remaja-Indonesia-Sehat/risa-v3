export type ProgressStatus =
  | "locked"
  | "current"
  | "completed";

type GetChapterStatusParams = {
  chapterNumber: number;
  isAuthenticated: boolean;
  completedChapters: number[];
  guestChapter1Completed?: boolean;
};

export function getChapterStatus({
  chapterNumber,
  isAuthenticated,
  completedChapters,
  guestChapter1Completed = false,
}: GetChapterStatusParams): ProgressStatus {
  // =========================
  // USER BELUM LOGIN
  // =========================
  if (!isAuthenticated) {
    // Hanya Chapter 1 yang boleh dimainkan
    if (chapterNumber === 1) {
      return guestChapter1Completed
        ? "completed"
        : "current";
    }

    return "locked";
  }

  // =========================
  // USER SUDAH LOGIN
  // =========================

  // Chapter sudah selesai
  if (completedChapters.includes(chapterNumber)) {
    return "completed";
  }

  // Cari chapter berikutnya
  const nextChapter =
    completedChapters.length === 0
      ? 1
      : Math.max(...completedChapters) + 1;

  // Chapter berikutnya menjadi current
  if (chapterNumber === nextChapter) {
    return "current";
  }

  return "locked";
}

type GetPostTestStatusParams = {
  isAuthenticated: boolean;
  completedChapters: number[];
  postTestCompleted: boolean;
};

export function getPostTestStatus({
  isAuthenticated,
  completedChapters,
  postTestCompleted,
}: GetPostTestStatusParams): ProgressStatus {
  // Guest tidak boleh membuka Post Test
  if (!isAuthenticated) {
    return "locked";
  }

  // Sudah pernah menyelesaikan Post Test
  if (postTestCompleted) {
    return "completed";
  }

  // Pastikan Chapter 1 sampai 7 semuanya selesai
  const allChaptersCompleted = [1, 2, 3, 4, 5, 6, 7].every(
    (chapterNumber) =>
      completedChapters.includes(chapterNumber),
  );

  return allChaptersCompleted
    ? "current"
    : "locked";
}
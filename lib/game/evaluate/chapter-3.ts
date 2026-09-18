import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter3(
  score: number,
  total: number
): GameResult {
  if (score === total) {
    return {
      stars: 3,
      title: "Tasmu siap!",
      message:
        "Semua pilihanmu tepat. Kamu sudah tahu barang penting yang bisa disiapkan saat menstruasi.",
      score,
      total,
    };
  }

  if (score === 0) {
    return {
      stars: 0,
      title: "Yuk coba lagi!",
      message:
        "Belum ada pilihan yang tepat. Coba ingat lagi barang yang benar-benar berguna saat menstruasi.",
      score,
      total,
    };
  }

  if (score === 1) {
    return {
      stars: 1,
      title: "Awal yang bagus!",
      message:
        "Kamu sudah menemukan satu pilihan yang tepat. Coba susun tasmu lagi.",
      score,
      total,
    };
  }

  return {
    stars: 2,
    title: "Hampir sempurna!",
    message:
      "Sebagian besar pilihanmu sudah tepat. Sedikit lagi untuk mendapatkan tiga bintang!",
    score,
    total,
  };
}
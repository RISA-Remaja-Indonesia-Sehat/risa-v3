import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter1(
  score: number,
  total: number
): GameResult {
  if (score === total) {
    return {
      stars: 3,
      title: "Luar biasa!",
      message:
        "Semua jawabanmu benar. Kamu sudah memahami materi dengan sangat baik!",
      score,
      total,
    };
  }

  if (score === 0) {
    return {
      stars: 0,
      title: "Yuk coba lagi!",
      message:
        "Belum ada jawaban yang tepat. Coba pelajari kembali materinya lalu mainkan lagi, ya.",
      score,
      total,
    };
  }

  if (score <= 2) {
    return {
      stars: 1,
      title: "Bagus, lanjut belajar!",
      message:
        "Kamu sudah mencoba dengan baik. Coba lagi supaya semakin memahami materinya.",
      score,
      total,
    };
  }

  return {
    stars: 2,
    title: "Hebat!",
    message:
      "Kamu sudah memahami banyak bagian penting. Sedikit lagi untuk mendapatkan tiga bintang!",
    score,
    total,
  };
}
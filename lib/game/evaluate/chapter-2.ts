import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter2(
  score: number,
  total: number
): GameResult {
  if (score === total) {
    return {
      stars: 3,
      title: "Luar biasa!",
      message:
        "Semua pernyataan berhasil kamu bedakan dengan benar. Kamu sudah memahami mitos dan fakta tentang menstruasi dengan sangat baik!",
      score,
      total,
    };
  }

  if (score === 0) {
    return {
      stars: 0,
      title: "Yuk coba lagi!",
      message:
        "Belum ada yang tepat. Coba ingat kembali materi tentang menstruasi lalu mainkan lagi, ya.",
      score,
      total,
    };
  }

  if (score <= 2) {
    return {
      stars: 1,
      title: "Bagus, lanjut belajar!",
      message:
        "Kamu sudah mulai bisa membedakan mitos dan fakta. Coba lagi supaya semakin paham.",
      score,
      total,
    };
  }

  return {
    stars: 2,
    title: "Hebat!",
    message:
      "Kamu sudah bisa membedakan sebagian besar mitos dan fakta. Sedikit lagi untuk mendapatkan tiga bintang!",
    score,
    total,
  };
}
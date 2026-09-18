import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter7(
  score: number,
  total: number
): GameResult {
  if (score === total) {
    return {
      stars: 3,
      title: "Luar biasa!",
      message:
        "Semua jawaban TTS-mu benar. Kamu sudah memahami materi IMS dengan sangat baik!",
      score,
      total,
    };
  }

  if (score === 0) {
    return {
      stars: 0,
      title: "Yuk coba lagi!",
      message:
        "Belum ada kata yang tepat. Kamu bisa melihat pembahasannya lalu mencoba kembali.",
      score,
      total,
    };
  }

  if (score <= 2) {
    return {
      stars: 1,
      title: "Terus belajar!",
      message:
        "Beberapa jawabanmu sudah tepat. Lihat pembahasannya untuk membantu mengingat materi.",
      score,
      total,
    };
  }

  return {
    stars: 2,
    title: "Hebat!",
    message:
      "Sebagian besar jawabanmu sudah benar. Sedikit lagi untuk mendapatkan tiga bintang!",
    score,
    total,
  };
}
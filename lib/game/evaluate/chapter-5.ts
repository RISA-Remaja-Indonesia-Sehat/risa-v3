import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter5(
  score: number
): GameResult {
  if (score >= 90) {
    return {
      stars: 3,
      title: "Luar biasa!",
      message:
        "Kamu berhasil mengumpulkan banyak pilihan yang mendukung tubuh tetap sehat.",
      summary:
        `Skor akhir: ${score}`,
    };
  }

  if (score >= 50) {
    return {
      stars: 2,
      title: "Hebat!",
      message:
        "Pilihanmu sudah cukup baik. Sedikit lagi untuk mendapatkan tiga bintang!",
      summary:
        `Skor akhir: ${score}`,
    };
  }

  if (score > 10) {
    return {
      stars: 1,
      title: "Bagus, lanjutkan!",
      message:
        "Kamu sudah mulai memilih makanan yang mendukung kesehatan tubuh.",
      summary:
        `Skor akhir: ${score}`,
    };
  }

  return {
    stars: 0,
    title: "Yuk coba lagi!",
    message:
      "Perhatikan makanan yang kamu tangkap. Pilih lebih banyak makanan yang mendukung kesehatan tubuh.",
    summary:
      `Skor akhir: ${score}`,
  };
}
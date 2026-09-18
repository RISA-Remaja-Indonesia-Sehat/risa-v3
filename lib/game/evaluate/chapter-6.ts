import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter6(
  accuracy: number,
  empathy: number
): GameResult {
  const average =
    (accuracy + empathy) / 2;

  if (average >= 9) {
    return {
      stars: 3,
      title: "Luar biasa!",
      message:
        "Jawabanmu akurat sekaligus penuh empati. Kamu berhasil membantu pasien dengan sangat baik.",
      summary:
        `Akurasi ${accuracy}/10 • Empati ${empathy}/10`,
    };
  }

  if (average >= 6) {
    return {
      stars: 2,
      title: "Hebat!",
      message:
        "Konsultasimu sudah cukup baik. Terus tingkatkan akurasi dan caramu merespons pasien.",
      summary:
        `Akurasi ${accuracy}/10 • Empati ${empathy}/10`,
    };
  }

  if (average >= 3) {
    return {
      stars: 1,
      title: "Terus belajar!",
      message:
        "Kamu sudah mencoba membantu pasien. Coba lagi untuk memberikan jawaban yang lebih tepat dan empatik.",
      summary:
        `Akurasi ${accuracy}/10 • Empati ${empathy}/10`,
    };
  }

  return {
    stars: 0,
    title: "Yuk coba lagi!",
    message:
      "Coba perhatikan kembali informasi medis dan perasaan pasien sebelum memilih jawaban.",
    summary:
      `Akurasi ${accuracy}/10 • Empati ${empathy}/10`,
  };
}
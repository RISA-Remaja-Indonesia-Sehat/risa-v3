import type {
  GameResult,
} from "@/types/game-result";

export function evaluateChapter4(
  score: number,
  total: number
): GameResult {
  if (score === total) {
    return {
      stars: 3,
      title: "Luar biasa!",
      message:
        "Semua keputusanmu tepat. Kamu sudah memahami batas pribadi, hubungan sehat, dan cara menjaga diri.",
      score,
      total,
    };
  }

  if (score === 0) {
    return {
      stars: 0,
      title: "Yuk coba lagi!",
      message:
        "Situasi ini memang tidak selalu mudah. Coba pelajari kembali materinya dan mainkan lagi.",
      score,
      total,
    };
  }

  if (score <= 2) {
    return {
      stars: 1,
      title: "Terus belajar!",
      message:
        "Kamu sudah mengenali beberapa pilihan yang aman dan sehat.",
      score,
      total,
    };
  }

  return {
    stars: 2,
    title: "Hebat!",
    message:
      "Sebagian besar keputusanmu sudah tepat. Sedikit lagi untuk hasil sempurna!",
    score,
    total,
  };
}
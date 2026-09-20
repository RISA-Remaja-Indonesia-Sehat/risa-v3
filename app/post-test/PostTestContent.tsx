"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  House,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { childApiFetch } from "@/lib/api/child-client";

type PostTestOption = {
  id: string;
  label: string;
};

type PostTestQuestion = {
  id: string;
  order: number;
  chapterNumber: number;
  type: "SINGLE_CHOICE" | "TRUE_FALSE";
  prompt: string;
  options: PostTestOption[];
};

type PreviousResult = {
  score: number | null;
  correctAnswers: number | null;
  totalQuestions: number | null;
  completedAt: string;
};

type QuestionsResponse = {
  success: boolean;
  data: {
    contentVersion: number;
    questions: PostTestQuestion[];
    previousResult: PreviousResult | null;
  };
};

type ReviewItem = {
  questionId: string;
  order: number;
  chapterNumber: number;
  prompt: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  correctOptionId: string;
  correctOptionLabel: string;
  isCorrect: boolean;
  explanation: string;
};

type SubmissionResult = {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  contentVersion: number;
  isBestScore: boolean;
  chapterResults: Array<{
    chapterNumber: number;
    correct: number;
    total: number;
  }>;
  recommendedChapters: number[];
  review: ReviewItem[];
};

type SubmitResponse = {
  success: boolean;
  data: SubmissionResult;
};

type Screen = "intro" | "quiz" | "result";

const CHAPTER_TITLES: Record<number, string> = {
  1: "Kenalan dengan Tubuhku",
  2: "Menstruasi & Siklusku",
  3: "Kebersihan & Perawatan Diri",
  4: "Batas & Hubungan Sehat",
  5: "Kebiasaan Sehat untuk Tubuhku",
  6: "Kenali HPV & Vaksinnya",
  7: "Kenali Infeksi Menular Seksual",
};

const STAR_ASSETS = {
  0: "/img/game-result/stars-0.png",
  1: "/img/game-result/stars-1.png",
  2: "/img/game-result/stars-2.png",
  3: "/img/game-result/stars-3.png",
} as const;

function getResultCopy(score: number) {
  if (score >= 90) {
    return {
      stars: 3 as const,
      title: "Luar biasa!",
      message: "Kamu sudah memahami materi RISA dengan sangat baik.",
    };
  }

  if (score >= 75) {
    return {
      stars: 2 as const,
      title: "Hebat!",
      message:
        "Pemahamanmu sudah bagus. Tinggal pelajari kembali beberapa bagian.",
    };
  }

  if (score >= 50) {
    return {
      stars: 1 as const,
      title: "Terus belajar!",
      message:
        "Kamu sudah mencoba dengan baik. Yuk, perkuat lagi pemahamanmu.",
    };
  }

  return {
    stars: 0 as const,
    title: "Tetap semangat!",
    message:
      "Belum maksimal, tetapi kamu bisa membaca materi dan mencoba kembali.",
  };
}

export default function PostTestContent() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("intro");
  const [questions, setQuestions] = useState<PostTestQuestion[]>([]);
  const [contentVersion, setContentVersion] = useState<number | null>(null);
  const [previousResult, setPreviousResult] =
    useState<PreviousResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await childApiFetch<QuestionsResponse>(
        "/api/post-test/questions",
      );

      setQuestions(response.data.questions);
      setContentVersion(response.data.contentVersion);
      setPreviousResult(response.data.previousResult);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal mengambil soal Post Test.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;
  const wrongAnswers = useMemo(
    () => result?.review.filter((item) => !item.isCorrect) ?? [],
    [result],
  );

  function selectAnswer(optionId: string) {
    if (!currentQuestion) return;

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }));
  }

  function startQuiz() {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setError(null);
    setScreen("quiz");
  }

  async function submitAnswers() {
    if (contentVersion === null || questions.length === 0) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await childApiFetch<SubmitResponse>(
        "/api/post-test/submit",
        {
          method: "POST",
          body: JSON.stringify({
            contentVersion,
            answers: questions.map((question) => ({
              questionId: question.id,
              optionId: answers[question.id],
            })),
          }),
        },
      );

      setResult(response.data);
      setPreviousResult({
        score: response.data.score,
        correctAnswers: response.data.correctAnswers,
        totalQuestions: response.data.totalQuestions,
        completedAt: new Date().toISOString(),
      });
      setScreen("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Jawaban belum berhasil dikirim.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (!selectedOptionId) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    void submitAnswers();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F4] px-6">
        <div className="rounded-3xl border border-[#F2D7CE] bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#F3C8BC] border-t-[#D97066]" />
          <p className="mt-4 text-sm font-semibold text-[#536054]">
            Menyiapkan soal untukmu...
          </p>
        </div>
      </main>
    );
  }

  if (error && questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F4] px-6">
        <section className="w-full max-w-md rounded-3xl border border-[#F2D7CE] bg-white p-7 text-center shadow-sm">
          <h1 className="font-jaro text-3xl text-[#C95F57]">
            Soal belum bisa dibuka
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#667067]">{error}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="min-h-12 flex-1 rounded-full border border-[#CBD6C8] bg-white px-5 text-sm font-semibold text-[#4F6751]"
            >
              Kembali ke beranda
            </button>
            <button
              type="button"
              onClick={() => void loadQuestions()}
              className="min-h-12 flex-1 rounded-full bg-[#557A59] px-5 text-sm font-semibold text-white"
            >
              Coba lagi
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "intro") {
    return (
      <main className="min-h-screen bg-[#FFF9F4] px-4 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-[#F2D7CE] bg-white shadow-[0_18px_55px_rgba(111,78,62,0.10)]">
          <div className="bg-linear-to-br from-[#FBE6DF] via-[#FFF6D8] to-[#E6F0E2] px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 text-[#D97066] shadow-sm">
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#69806B]">
              Ujian akhir RISA
            </p>
            <h1 className="mt-2 font-jaro text-4xl text-[#B65352] sm:text-5xl">
              Post Test
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#59645B] sm:text-base">
              Saatnya melihat seberapa banyak yang kamu pahami setelah
              menyelesaikan tujuh chapter RISA.
            </p>
          </div>

          <div className="p-6 sm:p-9">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["20", "soal"],
                ["±10", "menit"],
                ["1", "soal per layar"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#E5EBDD] bg-[#F8FAF5] px-4 py-4 text-center"
                >
                  <strong className="block text-xl text-[#4F6751]">
                    {value}
                  </strong>
                  <span className="mt-1 block text-xs text-[#7C867D]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#FFF7E1] p-5">
              <div className="flex gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#C18A31]" />
                <div>
                  <h2 className="text-sm font-bold text-[#66552D]">
                    Sebelum mulai
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#756746]">
                    Jawablah dengan tenang. Pembahasan akan muncul setelah semua
                    jawaban dikirim, dan kamu boleh mencoba kembali.
                  </p>
                </div>
              </div>
            </div>

            {previousResult?.score != null && (
              <div className="mt-4 rounded-2xl border border-[#F0D4CB] bg-[#FFF8F5] p-4 text-sm text-[#6C5C58]">
                Nilai terbaikmu sebelumnya:{" "}
                <strong className="text-[#C45F58]">
                  {previousResult.score}
                </strong>
              </div>
            )}

            <button
              type="button"
              onClick={startQuiz}
              className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#557A59] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(85,122,89,0.22)] transition hover:bg-[#486B4C] active:scale-[0.99]"
            >
              {previousResult ? "Kerjakan kembali" : "Mulai Post Test"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "quiz" && currentQuestion) {
    return (
      <main className="min-h-screen bg-[#FFF9F4] px-4 py-6 sm:px-6 sm:py-10">
        <section className="mx-auto max-w-3xl">
          <header className="mb-5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D9E1D5] bg-white text-[#557A59] transition hover:bg-[#F5F8F2]"
              aria-label="Kembali ke beranda"
            >
              <House className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#6D786E]">
                <span>
                  Pertanyaan {currentIndex + 1} dari {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8EADF]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#E58B7F] to-[#E8B64F] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          <article className="rounded-[2rem] border border-[#F0D8CF] bg-white p-6 shadow-[0_16px_45px_rgba(111,78,62,0.09)] sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#EAF2E6] px-3 py-1 text-xs font-bold text-[#557A59]">
                Chapter {currentQuestion.chapterNumber}
              </span>
              {currentQuestion.type === "TRUE_FALSE" && (
                <span className="rounded-full bg-[#FFF2CE] px-3 py-1 text-xs font-bold text-[#9A7025]">
                  Benar atau salah
                </span>
              )}
            </div>

            <h1 className="mt-5 text-lg font-bold leading-8 text-[#344238] sm:text-xl">
              {currentQuestion.prompt}
            </h1>

            <div className="mt-7 grid gap-3">
              {currentQuestion.options.map((option) => {
                const selected = selectedOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectAnswer(option.id)}
                    aria-pressed={selected}
                    className={`flex min-h-14 w-full items-start gap-3 rounded-2xl border-2 px-4 py-4 text-left text-sm leading-6 transition sm:px-5 ${
                      selected
                        ? "border-[#6D9470] bg-[#EFF6EB] text-[#344C37] shadow-sm"
                        : "border-[#E5E5DD] bg-white text-[#59625A] hover:border-[#BFD0BB] hover:bg-[#FAFCF8]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        selected
                          ? "bg-[#557A59] text-white"
                          : "bg-[#F3F1EC] text-[#6F766F]"
                      }`}
                    >
                      {selected ? <Check className="h-4 w-4" /> : option.id}
                    </span>
                    <span className="pt-0.5 font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mt-5 rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#A84F49]">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((index) => Math.max(0, index - 1))
                }
                disabled={currentIndex === 0 || submitting}
                className="flex min-h-12 items-center gap-2 rounded-full border border-[#D7DED3] bg-white px-5 text-sm font-semibold text-[#566758] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Sebelumnya
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!selectedOptionId || submitting}
                className="flex min-h-12 items-center gap-2 rounded-full bg-[#557A59] px-6 text-sm font-bold text-white transition hover:bg-[#486B4C] disabled:cursor-not-allowed disabled:bg-[#B8C3B7]"
              >
                {submitting
                  ? "Mengirim..."
                  : currentIndex === questions.length - 1
                    ? "Kirim jawaban"
                    : "Selanjutnya"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </article>
        </section>
      </main>
    );
  }

  if (screen === "result" && result) {
    const resultCopy = getResultCopy(result.score);

    return (
      <main className="min-h-screen bg-[#FFF9F4] px-4 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-[2rem] border border-[#F0D8CF] bg-white shadow-[0_18px_55px_rgba(111,78,62,0.10)]">
            <div className="bg-linear-to-br from-[#FBE6DF] via-[#FFF8DF] to-[#E7F1E3] px-6 py-8 text-center sm:px-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B806D]">
                Post Test selesai
              </p>
              <div className="relative mx-auto mt-2 h-48 w-full max-w-sm sm:h-56">
                <Image
                  src={STAR_ASSETS[resultCopy.stars]}
                  alt={`${resultCopy.stars} dari 3 bintang`}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <h1 className="font-jaro text-4xl text-[#B65352] sm:text-5xl">
                {resultCopy.title}
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#5D685F]">
                {resultCopy.message}
              </p>
            </div>

            <div className="p-6 sm:p-9">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#EFF6EB] p-5 text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#708172]">
                    Nilai
                  </span>
                  <strong className="mt-1 block text-4xl text-[#4F7453]">
                    {result.score}
                  </strong>
                </div>
                <div className="rounded-2xl bg-[#FFF4D7] p-5 text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#8B7747]">
                    Jawaban benar
                  </span>
                  <strong className="mt-1 block text-4xl text-[#A3782A]">
                    {result.correctAnswers}/{result.totalQuestions}
                  </strong>
                </div>
              </div>

              {result.recommendedChapters.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-[#F0D6CD] bg-[#FFF9F6] p-5">
                  <h2 className="font-bold text-[#5D4A45]">
                    Materi yang bisa kamu pelajari kembali
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-[#6C625E]">
                    {result.recommendedChapters.map((chapter) => (
                      <li key={chapter} className="flex gap-2">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#D07368]" />
                        Chapter {chapter}: {CHAPTER_TITLES[chapter]}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-[#CFE0CA] bg-[#F1F8EE] p-5 text-sm leading-6 text-[#4F6751]">
                  Semua jawabanmu benar. Kamu sudah memahami seluruh materi
                  dengan sangat baik!
                </div>
              )}

              {wrongAnswers.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-[#344238]">
                    Pembahasan jawaban
                  </h2>
                  <p className="mt-1 text-sm text-[#778078]">
                    Baca kembali bagian yang masih keliru tanpa perlu merasa
                    malu.
                  </p>

                  <div className="mt-4 space-y-4">
                    {wrongAnswers.map((item) => (
                      <article
                        key={item.questionId}
                        className="rounded-2xl border border-[#E8E2DA] bg-[#FFFEFB] p-5"
                      >
                        <p className="text-xs font-bold text-[#C26A61]">
                          Soal {item.order} · Chapter {item.chapterNumber}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold leading-6 text-[#3F4941]">
                          {item.prompt}
                        </h3>
                        <div className="mt-3 space-y-2 text-sm leading-6">
                          <p className="text-[#9A5B55]">
                            Jawabanmu: {item.selectedOptionLabel}
                          </p>
                          <p className="font-semibold text-[#4F7453]">
                            Jawaban tepat: {item.correctOptionLabel}
                          </p>
                          <p className="rounded-xl bg-[#F5F7F1] px-4 py-3 text-[#667067]">
                            {item.explanation}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#CCD7C9] bg-white px-5 text-sm font-bold text-[#557A59]"
                >
                  <House className="h-4 w-4" />
                  Kembali ke beranda
                </button>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#557A59] px-5 text-sm font-bold text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Coba lagi
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return null;
}

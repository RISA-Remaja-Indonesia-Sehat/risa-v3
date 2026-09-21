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
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 px-6">
        <div className="rounded-3xl border-2 border-pink-200 bg-white/90 px-9 py-7 text-center shadow-lg backdrop-blur-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-yellow-200 border-t-pink-500" />
          <p className="mt-4 text-sm font-semibold text-gray-600">
            Menyiapkan soal untukmu...
          </p>
        </div>
      </main>
    );
  }

  if (error && questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 px-6">
        <section className="w-full max-w-md rounded-3xl border-2 border-pink-200 bg-white/90 p-7 text-center shadow-lg backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-pink-500">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-jaro text-3xl text-pink-600">
            Soal belum bisa dibuka
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">{error}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="min-h-12 flex-1 rounded-full border-2 border-pink-200 bg-white px-5 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              Kembali ke beranda
            </button>
            <button
              type="button"
              onClick={() => void loadQuestions()}
              className="min-h-12 flex-1 rounded-full bg-pink-500 px-5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-600"
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
      <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 px-4 py-8 sm:px-6 sm:py-12">
        <div className="pointer-events-none absolute -left-16 top-16 h-44 w-44 rounded-full bg-pink-200/45 blur-2xl" />
        <div className="pointer-events-none absolute -right-12 bottom-10 h-52 w-52 rounded-full bg-yellow-200/55 blur-2xl" />

        <section className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border-2 border-pink-200 bg-white/90 shadow-[0_24px_70px_rgba(190,92,132,0.16)] backdrop-blur-sm">
          <div className="relative overflow-hidden bg-linear-to-br from-pink-100 via-yellow-50 to-yellow-100 px-6 py-11 text-center sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full border-[18px] border-white/35" />
            <div className="pointer-events-none absolute -bottom-12 -right-8 h-36 w-36 rounded-full bg-pink-200/35" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-200 ring-8 ring-white/50">
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.22em] text-pink-600">
              Langkah terakhir perjalanan RISA
            </p>
            <h1 className="relative mt-2 font-jaro text-4xl leading-tight text-pink-600 sm:text-5xl">
              Lihat seberapa jauh kamu bertumbuh
            </h1>
            <p className="relative mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
              Ini bukan tentang harus sempurna. Jawab dengan tenang dan lihat
              hal-hal hebat yang sudah kamu pelajari.
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
                  className="rounded-2xl border border-pink-100 bg-linear-to-br from-pink-50 to-yellow-50 px-4 py-4 text-center"
                >
                  <strong className="block text-xl text-pink-600">
                    {value}
                  </strong>
                  <span className="mt-1 block text-xs font-medium text-gray-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <div className="flex gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-yellow-700" />
                <div>
                  <h2 className="text-sm font-bold text-yellow-900">
                    Kamu tidak perlu terburu-buru
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-yellow-900/70">
                    Jawablah dengan tenang. Pembahasan akan muncul setelah semua
                    jawaban dikirim, dan kamu boleh mencoba kembali.
                  </p>
                </div>
              </div>
            </div>

            {previousResult?.score != null && (
              <div className="mt-4 rounded-2xl border border-pink-200 bg-pink-50 p-4 text-center text-sm text-gray-600">
                Nilai terbaikmu sebelumnya:{" "}
                <strong className="text-pink-600">
                  {previousResult.score}
                </strong>
              </div>
            )}

            <button
              type="button"
              onClick={startQuiz}
              className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-pink-500 px-6 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl active:translate-y-0 active:scale-[0.99]"
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
      <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 px-4 py-6 sm:px-6 sm:py-10">
        <div className="pointer-events-none absolute -left-20 top-20 h-52 w-52 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-16 h-64 w-64 rounded-full bg-yellow-200/45 blur-3xl" />

        <section className="relative mx-auto max-w-3xl">
          <header className="mb-5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pink-200 bg-white/90 text-pink-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-md"
              aria-label="Kembali ke beranda"
            >
              <House className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs font-semibold text-pink-700">
                <span>
                  Pertanyaan {currentIndex + 1} dari {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/80 shadow-inner">
                <div
                  className="h-full rounded-full bg-linear-to-r from-pink-400 via-pink-300 to-yellow-400 transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          <article className="rounded-[2rem] border-2 border-pink-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(244,114,182,0.15)] backdrop-blur-sm sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">
                Chapter {currentQuestion.chapterNumber}
              </span>
              {currentQuestion.type === "TRUE_FALSE" && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                  Benar atau salah
                </span>
              )}
            </div>

            <h1 className="mt-5 text-lg font-bold leading-8 text-gray-800 sm:text-xl">
              {currentQuestion.prompt}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Pilih jawaban yang menurutmu paling tepat.
            </p>

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
                        ? "border-pink-400 bg-pink-50 text-pink-950 shadow-sm shadow-pink-100"
                        : "border-pink-100 bg-white text-gray-600 hover:border-pink-300 hover:bg-yellow-50/60"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        selected
                          ? "bg-pink-500 text-white"
                          : "bg-yellow-100 text-yellow-800"
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
              <p className="mt-5 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-700">
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
                className="flex min-h-12 items-center gap-2 rounded-full border-2 border-pink-200 bg-white px-5 text-sm font-semibold text-pink-600 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Sebelumnya
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!selectedOptionId || submitting}
                className="flex min-h-12 items-center gap-2 rounded-full bg-pink-500 px-6 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-pink-200 disabled:shadow-none"
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
      <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 px-4 py-8 sm:px-6 sm:py-12">
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-yellow-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />

        <section className="relative mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-[2rem] border-2 border-pink-200 bg-white/90 shadow-[0_22px_60px_rgba(244,114,182,0.16)] backdrop-blur-sm">
            <div className="relative overflow-hidden bg-linear-to-br from-pink-100 via-yellow-50 to-yellow-100 px-6 py-8 text-center sm:px-10">
              <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/45" />
              <div className="pointer-events-none absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-pink-200/45" />
              <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
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
              <h1 className="relative font-jaro text-4xl text-pink-600 sm:text-5xl">
                {resultCopy.title}
              </h1>
              <p className="relative mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
                {resultCopy.message}
              </p>
            </div>

            <div className="p-6 sm:p-9">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-pink-700">
                    Nilai
                  </span>
                  <strong className="mt-1 block text-4xl text-pink-600">
                    {result.score}
                  </strong>
                </div>
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-yellow-800">
                    Jawaban benar
                  </span>
                  <strong className="mt-1 block text-4xl text-yellow-700">
                    {result.correctAnswers}/{result.totalQuestions}
                  </strong>
                </div>
              </div>

              {result.recommendedChapters.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-yellow-200 bg-linear-to-r from-yellow-50 to-pink-50 p-5">
                  <h2 className="font-bold text-gray-800">
                    Materi yang bisa kamu pelajari kembali
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {result.recommendedChapters.map((chapter) => (
                      <li key={chapter} className="flex gap-2">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                        Chapter {chapter}: {CHAPTER_TITLES[chapter]}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-800">
                  Semua jawabanmu benar. Kamu sudah memahami seluruh materi
                  dengan sangat baik!
                </div>
              )}

              {wrongAnswers.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-gray-800">
                    Pembahasan jawaban
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Baca kembali bagian yang masih keliru tanpa perlu merasa
                    malu.
                  </p>

                  <div className="mt-4 space-y-4">
                    {wrongAnswers.map((item) => (
                      <article
                        key={item.questionId}
                        className="rounded-2xl border border-pink-100 bg-pink-50/40 p-5"
                      >
                        <p className="text-xs font-bold text-pink-600">
                          Soal {item.order} · Chapter {item.chapterNumber}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold leading-6 text-gray-800">
                          {item.prompt}
                        </h3>
                        <div className="mt-3 space-y-2 text-sm leading-6">
                          <p className="text-pink-700">
                            Jawabanmu: {item.selectedOptionLabel}
                          </p>
                          <p className="font-semibold text-green-700">
                            Jawaban tepat: {item.correctOptionLabel}
                          </p>
                          <p className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-gray-600">
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
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-pink-200 bg-white px-5 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
                >
                  <House className="h-4 w-4" />
                  Kembali ke beranda
                </button>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-pink-500 px-5 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-lg"
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

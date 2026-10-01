"use client";
import { House } from "lucide-react";
import ScoreModal from "@/components/game/ScoreModal";
import { evaluateChapter1 } from "@/lib/game/evaluate/chapter-1";
import Image from "next/image";
import Link from "next/link";
import { game_1 } from "../../data-local/game";
import { useState } from "react";
import { useChildSession } from "@/hooks/useChildSession";
import LoginPrompt from "@/components/auth/LoginPrompt";
import { useRouter } from "next/navigation";
import { completeGuestChapter1 } from "@/lib/game/guest-progress";
import { completeChildChapter } from "@/lib/game/child-progress";
import { hasPassedChapter1 } from "@/lib/game/chapter-rules";

type AnswerKey = "A" | "B" | "C" | "D" | "E" | "F";

const KEYS: AnswerKey[] = ["A", "B", "C", "D", "E", "F"];

const correctAnswers: Record<AnswerKey, string> = {
  A: game_1.answer_A,
  B: game_1.answer_B,
  C: game_1.answer_C,
  D: game_1.answer_D,
  E: game_1.answer_E,
  F: game_1.answer_F,
};

const emptyState = () =>
  Object.fromEntries(KEYS.map((k) => [k, ""])) as Record<AnswerKey, string>;

export default function GamePage() {
  const router = useRouter();
  const { isChildAuthenticated, loading: childLoading } = useChildSession();
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>(emptyState);
  const [submitted, setSubmitted] = useState(false);

  const [results, setResults] = useState<Record<AnswerKey, boolean | null>>(
    () =>
      Object.fromEntries(KEYS.map((k) => [k, null])) as Record<
        AnswerKey,
        boolean | null
      >,
  );
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [validationError, setValidationError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);

  const retryGame = () => {
    setAnswers(emptyState());

    setResults(
      Object.fromEntries(KEYS.map((key) => [key, null])) as Record<
        AnswerKey,
        boolean | null
      >,
    );

    setSubmitted(false);
    setScore(0);
    setShowScore(false);
    setValidationError("");
    setProgressError("");
    setProgressSaved(false);
    setSavingProgress(false);
  };

  const passed = hasPassedChapter1(score);

  const canContinue =
    passed && progressSaved && !savingProgress && !childLoading;

  const goToNextChapter = () => {
    if (!canContinue) {
      return;
    }

    if (isChildAuthenticated) {
      router.push("/chapters/chapter-2");
      return;
    }

    setShowScore(false);
    setShowLoginPrompt(true);
  };

  const handleChange = (key: AnswerKey, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));

    setValidationError("");
  };

  const submitAnswer = async () => {
    if (submitted || childLoading) {
      return;
    }

    setValidationError("");
    setProgressError("");
    setProgressSaved(false);

    const firstEmptyKey = KEYS.find((key) => answers[key].trim() === "");

    if (firstEmptyKey) {
      setValidationError("Lengkapi semua jawaban sebelum dikumpulkan.");

      document.getElementById(`answer_${firstEmptyKey}`)?.focus();

      return;
    }

    const newResults = Object.fromEntries(
      KEYS.map((key) => [
        key,
        answers[key].trim().toLowerCase() ===
          correctAnswers[key].trim().toLowerCase(),
      ]),
    ) as Record<AnswerKey, boolean>;

    const correctCount = Object.values(newResults).filter(Boolean).length;

    const passed = hasPassedChapter1(correctCount);

    setResults(newResults);
    setSubmitted(true);
    setScore(correctCount);
    setShowScore(true);

    // Skor gagal tetap ditampilkan, tetapi tidak disimpan sebagai completed.
    if (!passed) {
      return;
    }

    setSavingProgress(true);

    try {
      if (isChildAuthenticated) {
        await completeChildChapter(1, correctCount);
      } else {
        const saved = completeGuestChapter1(correctCount);

        if (!saved) {
          throw new Error("Progres Chapter 1 tidak dapat disimpan.");
        }
      }

      setProgressSaved(true);
    } catch (error) {
      setProgressError(
        error instanceof Error
          ? error.message
          : "Progres belum berhasil disimpan.",
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const getBorderClass = (key: AnswerKey) => {
    if (results[key] === null) return "border-pink-100";
    return results[key] ? "border-emerald-400" : "border-pink-400";
  };

  const gameResult = evaluateChapter1(score, KEYS.length);

  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 p-4 font-jakarta">
        <div className="pointer-events-none absolute -left-24 top-24 h-56 w-56 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-yellow-200/45 blur-3xl" />

        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-pink-200 bg-white/90 text-pink-600 shadow-sm transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200 md:left-6 md:top-6"
        >
          <House className="h-5 w-5" aria-hidden="true" />
        </Link>

        <section className="relative mt-8 flex w-full max-w-2xl flex-col gap-8 rounded-3xl border-2 border-pink-200 bg-white/95 p-5 shadow-lg md:p-8">
          <div>
            <h1 className="mb-4 text-center font-jaro text-3xl leading-tight text-pink-600 md:text-4xl">
              Tebak Nama Organ Berikut
            </h1>
            <Image
              src="/img/organ-game.png"
              alt="organ game"
              width={600}
              height={400}
              className="w-full rounded-2xl border-2 border-pink-100 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            {KEYS.map((key) => (
              <div key={key} className="flex items-center gap-2 md:gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500 shadow-md md:h-12 md:w-12">
                  <span className="font-jaro text-xl text-white md:text-2xl">
                    {key}
                  </span>
                </div>
                {submitted && results[key] !== null && (
                  <span
                    className={`min-w-28 text-sm font-semibold ${
                      results[key] ? "text-emerald-600" : "text-pink-600"
                    }`}
                  >
                    {results[key] ? "Benar" : "Perlu diperbaiki"}
                  </span>
                )}
                <input
                  type="text"
                  name={`answer_${key}`}
                  id={`answer_${key}`}
                  value={answers[key]}
                  aria-label={`Jawaban bagian ${key}`}
                  aria-invalid={
                    validationError !== "" && answers[key].trim() === ""
                  }
                  className={`w-full max-w-sm rounded-2xl border-2 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-yellow-100 disabled:bg-gray-50 md:px-4 md:py-2.5 md:text-base ${getBorderClass(key)}`}
                  onChange={(event) => handleChange(key, event.target.value)}
                  disabled={submitted}
                />
              </div>
            ))}
          </div>

          {validationError && (
            <p
              role="alert"
              className="rounded-2xl border-2 border-pink-200 bg-pink-50 px-4 py-3 text-center text-sm font-medium text-pink-800"
            >
              {validationError}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={submitAnswer}
              disabled={submitted || childLoading}
              className={`min-h-12 rounded-full px-8 py-3 text-sm font-bold text-white transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200 ${
                submitted || childLoading
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-pink-500 shadow-md shadow-pink-200 hover:bg-pink-600 hover:shadow-lg"
              }`}
            >
              {childLoading
                ? "Memeriksa sesi..."
                : submitted
                  ? "Sudah Dikumpulkan"
                  : "Cek Jawaban"}
            </button>
          </div>
        </section>
      </div>

      <ScoreModal
        open={showScore}
        chapterNumber={1}
        result={gameResult}
        isCompleted={passed}
        nextDisabled={!canContinue}
        errorMessage={progressError}
        onClose={() => setShowScore(false)}
        onRetry={retryGame}
        onNext={goToNextChapter}
        nextLoading={savingProgress || childLoading}
      />

      <LoginPrompt
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          router.push("/child/login?next=/chapters/chapter-2");
        }}
        onCreateAccess={() => {
          const next = "/guardian/consent?source=guest";

          router.push(`/guardian/login?next=${encodeURIComponent(next)}`);
        }}
      />
    </>
  );
}

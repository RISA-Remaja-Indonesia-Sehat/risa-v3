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
import { saveGuestChapter1Progress } from "@/lib/game/guest-progress";
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
        const saved = saveGuestChapter1Progress(correctCount);

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
    if (results[key] === null) return "border-neutral-300";
    return results[key] ? "border-green-500" : "border-red-500";
  };

  const gameResult = evaluateChapter1(score, KEYS.length);

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100">
        <Link href="/" className="absolute top-4 left-4">
          <House className="w-6 h-6 lg:w-8 lg:h-8 text-pink-600 cursor-pointer" />
        </Link>

        <section className="max-w-2xl w-full p-4 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg flex flex-col gap-8 mt-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 leading-6">
              Tebak Nama - Nama Organ Berikut
            </h2>
            <Image
              src="/img/organ-game.png"
              alt="organ game"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            {KEYS.map((key) => (
              <div key={key} className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
                  <h2 className="text-xl md:text-2xl text-white font-bold">
                    {key}
                  </h2>
                </div>
                <input
                  type="text"
                  name={`answer_${key}`}
                  id={`answer_${key}`}
                  value={answers[key]}
                  aria-label={`Jawaban bagian ${key}`}
                  aria-invalid={
                    validationError !== "" && answers[key].trim() === ""
                  }
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={submitted}
                />
              </div>
            ))}
          </div>

          {validationError && (
            <p
              role="alert"
              className="text-center text-sm font-medium text-red-600"
            >
              {validationError}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={submitAnswer}
              disabled={submitted || childLoading}
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
        passed={passed}
        statusLabel={passed ? "Chapter 1 selesai" : "Belum lulus · minimal 4/6"}
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

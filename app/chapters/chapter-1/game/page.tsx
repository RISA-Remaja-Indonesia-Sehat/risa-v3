"use client";
import { House, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { game_1 } from "../../data-local/game";
import { useState } from "react";
import { completeGuestChapter1 } from "@/lib/game/guest-progress";
import { useChildSession } from "@/hooks/useChildSession";
import LoginPrompt from "@/components/auth/LoginPrompt";
import { useRouter } from "next/navigation";

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
  };

  const goToNextChapter = () => {
    if (childLoading) {
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
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // setResults((prev) => ({ ...prev, [key]: null }));
  };

  const submitAnswer = () => {
    const newResults = Object.fromEntries(
      KEYS.map((key) => [
        key,
        answers[key].trim().toLowerCase() ===
          correctAnswers[key].trim().toLowerCase(),
      ]),
    ) as Record<AnswerKey, boolean>;

    const correctCount = Object.values(newResults).filter(Boolean).length;

    setResults(newResults);
    setSubmitted(true);
    setScore(correctCount);
    setShowScore(true);

    // Untuk guest, Chapter 1 sudah dianggap selesai.
    // Nanti untuk child yang login progress akan disimpan ke backend.
    if (!isChildAuthenticated) {
      completeGuestChapter1();
    }
  };

  const getBorderClass = (key: AnswerKey) => {
    if (results[key] === null) return "border-neutral-300";
    return results[key] ? "border-green-500" : "border-red-500";
  };

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
                  className={`border-2 ${getBorderClass(key)} rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300`}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={submitted}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className={`text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ${submitted ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : "bg-pink-500 hover:bg-pink-600"}`}
              onClick={submitAnswer}
              disabled={submitted}
            >
              {submitted ? "Sudah Dikumpulkan" : "Cek Jawaban"}
            </button>
          </div>
        </section>
      </div>

      {showScore && (
        <div
          className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      px-4
    "
        >
          <div
            className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-6
        shadow-xl

        sm:p-7
      "
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowScore(false)}
                aria-label="Tutup"
                className="
            rounded-lg
            p-1.5
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center">
              <p
                className="
            text-sm
            font-semibold
            text-[#637A65]
          "
              >
                Chapter 1 selesai
              </p>

              <h2
                className="
            mt-2
            text-3xl
            font-bold
            text-[#26352A]
          "
              >
                {score} / {KEYS.length}
              </h2>

              <p
                className="
            mx-auto
            mt-3
            max-w-xs
            text-sm
            leading-6
            text-gray-500
          "
              >
                Kamu menjawab {score} dari {KEYS.length} pertanyaan dengan
                benar.
              </p>
            </div>

            <div
              className="
          mt-7
          flex
          flex-col
          gap-3

          sm:flex-row
        "
            >
              <button
                type="button"
                onClick={retryGame}
                className="
            flex-1
            rounded-xl
            border
            border-[#CCD5CA]
            bg-white
            px-4
            py-3
            text-sm
            font-semibold
            text-[#506453]
            transition

            hover:bg-[#F4F6F2]
          "
              >
                Coba lagi
              </button>

              <button
                type="button"
                onClick={goToNextChapter}
                disabled={childLoading}
                className="
            flex-1
            rounded-xl
            bg-[#4F6751]
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition

            hover:bg-[#405642]

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
              >
                {childLoading ? "Memeriksa..." : "Chapter berikutnya"}
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginPrompt
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          router.push("/child/login?next=/chapters/chapter-2");
        }}
        onCreateAccess={() => {
          router.push("/guardian/login");
        }}
      />
    </>
  );
}

"use client";
import { House, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { game_1 } from "../../data-local/game";
import { useState } from "react";

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

const emptyState = () => Object.fromEntries(KEYS.map((k) => [k, ""])) as Record<AnswerKey, string>;

export default function GamePage() {
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>(emptyState);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<AnswerKey, boolean | null>>(
    () => Object.fromEntries(KEYS.map((k) => [k, null])) as Record<AnswerKey, boolean | null>
  );
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false);

  const handleChange = (key: AnswerKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // setResults((prev) => ({ ...prev, [key]: null }));
  };

  const submitAnswer = () => {
    const newResults = Object.fromEntries(
      KEYS.map((k) => [k, answers[k].trim().toLowerCase() === correctAnswers[k].trim().toLowerCase()])
    ) as Record<AnswerKey, boolean>;
    setResults(newResults);
    setSubmitted(true);
    setScore(Object.values(newResults).filter(Boolean).length);
    console.log(`Score: ${score} / ${KEYS.length}`);
    setShowScore(true);
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
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 leading-6">Tebak Nama - Nama Organ Berikut</h2>
          <Image src="/img/organ-game.png" alt="organ game" width={600} height={400} className="rounded-2xl shadow-lg" />
        </div>

        <div className="flex flex-col gap-2 md:gap-4">
          {KEYS.map((key) => (
            <div key={key} className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
                <h2 className="text-xl md:text-2xl text-white font-bold">{key}</h2>
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
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2">
        <div className="bg-white rounded-lg p-6 shadow-lg text-center w-full max-w-sm">
          <div className="w-full flex justify-end">
            <X className="w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setShowScore(false)} />
          </div>
          <h2 className="md:text-2xl font-bold mb-2 md:mb-4 text-lg">Skor Anda</h2>
          <p className="md:text-xl text-sm">Anda mendapatkan {score} dari {KEYS.length} jawaban yang benar.</p>
        </div>
      </div>
    )}
    </>
  );
}

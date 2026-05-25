"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { House, ChevronRight, RotateCcw } from "lucide-react";
import { game_4, SimulationOption } from "../../data-local/game";

type AnswerState = "idle" | "correct" | "wrong";

function OptionButton({ option, answerState, selectedId, onClick }: {
  option: SimulationOption;
  answerState: AnswerState;
  selectedId: string | null;
  onClick: () => void;
}) {
  const isSelected = selectedId === option.id;
  const hasAnswered = answerState !== "idle";

  const colorClass = () => {
    if (!hasAnswered) return "border-white/20 bg-white/10 hover:bg-white/20 text-white";
    if (option.isCorrect) return "border-green-400 bg-green-500/30 text-green-200";
    if (isSelected) return "border-red-400 bg-red-500/30 text-red-200";
    return "border-white/10 bg-white/5 text-white/40";
  };

  return (
    <button
      onClick={onClick}
      disabled={hasAnswered}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm md:text-base transition-all duration-200 backdrop-blur-sm ${colorClass()} ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
    >
      {option.text}
    </button>
  );
}

export default function GamePage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const scene = game_4[sceneIndex];
  const isLast = sceneIndex === game_4.length - 1;
  const hasAnswered = answerState !== "idle";
  const selectedOption = scene.options.find((o) => o.id === selectedId);

  const characterImg = !hasAnswered
    ? scene.character
    : answerState === "correct"
      ? `/img/game-simulation/correct-${scene.id}.png`
      : `/img/game-simulation/wrong-${scene.id}.png`;

  const handleSelect = (option: SimulationOption) => {
    if (hasAnswered) return;
    setSelectedId(option.id);
    setAnswerState(option.isCorrect ? "correct" : "wrong");
    if (option.isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) { setFinished(true); return; }
    setSceneIndex((i) => i + 1);
    setSelectedId(null);
    setAnswerState("idle");
  };

  const handleRestart = () => {
    setSceneIndex(0);
    setSelectedId(null);
    setAnswerState("idle");
    setFinished(false);
    setScore(0);
  };

  if (finished) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100 p-4">
        <div className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center gap-6 text-center">
          <Image src="/img/game-simulation/correct-1.png" alt="result" width={160} height={240} className="w-32 object-contain" />
          <div>
            <h2 className="font-jaro text-3xl text-pink-700 mb-1">Selesai!</h2>
            <p className="text-gray-500 text-sm">Jawaban benar</p>
            <p className="text-5xl font-bold text-pink-600 mt-2">{score}<span className="text-2xl text-gray-400"> / {game_4.length}</span></p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRestart} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-5 rounded-full shadow-md transition duration-300 text-sm">
              <RotateCcw className="w-4 h-4" /> Ulangi
            </button>
            <Link href="/" className="flex items-center gap-2 bg-white border-2 border-pink-300 hover:bg-pink-50 text-pink-600 font-bold py-2 px-5 rounded-full shadow-md transition duration-300 text-sm">
              <House className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">

      {/* Background — dynamic per scene */}
      <Image src={scene.scene} alt="background" fill className="object-cover object-top" priority />
      <div className="absolute inset-0 bg-black/30" />

      {/* Home + progress */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-5">
        <Link href="/"><House className="w-6 h-6 text-white drop-shadow" /></Link>
        <div className="flex gap-1.5 items-center">
          {game_4.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === sceneIndex ? "w-6 bg-white" : i < sceneIndex ? "w-2 bg-white/70" : "w-2 bg-white/25"}`} />
          ))}
        </div>
        <span className="text-white/80 text-sm font-medium">{sceneIndex + 1}/{game_4.length}</span>
      </div>

      {/* Main game area */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">

        {/* Desktop/tablet: character left, dialog right — Mobile: character behind dialog */}
        <div className="flex flex-1 items-end">

          {/* Character */}
          <div className="flex-shrink-0 flex items-end self-end
            w-72 h-[420px]
            md:w-64 md:h-96
            lg:w-72 lg:h-[420px]
            absolute bottom-0 left-0
            md:relative md:bottom-auto md:left-auto
            -z-10 md:z-auto
          ">
            <Image
              key={characterImg}
              src={characterImg}
              alt="character"
              fill
              className="object-contain object-bottom drop-shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Dialog panel */}
          <div className="flex-1 flex flex-col justify-end pb-4 px-3 md:px-4 md:pb-6 w-full">
            <div className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

              {/* Dialog header */}
              <div className="px-4 pt-3 pb-1 border-b border-white/10">
                <span className="font-jaro text-pink-300 text-base md:text-lg tracking-wide">Situasi</span>
              </div>

              <div className="p-4 flex flex-col gap-3 h-[150px] sm:h-auto sm:max-h-[40vh] overflow-y-auto">
                {!hasAnswered ? (
                  <>
                    {/* Situation text */}
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">{scene.situation}</p>
                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {scene.options.map((option) => (
                        <OptionButton
                          key={option.id}
                          option={option}
                          answerState={answerState}
                          selectedId={selectedId}
                          onClick={() => handleSelect(option)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Feedback */}
                    <div className={`rounded-xl px-4 py-3 text-sm md:text-base leading-relaxed border ${
                      answerState === "correct"
                        ? "bg-green-500/20 border-green-400/40 text-green-200"
                        : "bg-red-500/20 border-red-400/40 text-red-200"
                    }`}>
                      {selectedOption?.feedback}
                    </div>
                    <button
                      onClick={handleNext}
                      className="self-end flex items-center gap-2 text-white font-bold py-2 px-5 text-sm"
                    >
                      {isLast ? "Lihat Hasil" : "Lanjut"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

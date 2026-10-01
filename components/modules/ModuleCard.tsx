"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import Button from "@/components/button";

import ModuleRenderer from "@/components/modules/ModuleRenderer";

import { useButtonGameState } from "@/lib/game/useButtonGame";

import type { ModuleCardData } from "@/lib/modules/types";

type Props = {
  cards: ModuleCardData[];
};

const navButtonClass =
  "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-pink-200 bg-white text-pink-600 shadow-sm transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:active:scale-100";

export default function ModuleCard({ cards }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const totalCards = cards.length;

  const currentCard = cards[currentIndex];

  const isFirstCard = currentIndex === 0;

  const isLastCard = currentIndex === totalCards - 1;

  const progress = totalCards ? ((currentIndex + 1) / totalCards) * 100 : 0;

  const nextCard = () => {
    if (!isLastCard) {
      setCurrentIndex((current) => current + 1);
    }
  };

  const prevCard = () => {
    if (!isFirstCard) {
      setCurrentIndex((current) => current - 1);
    }
  };

  const showGamePage = () => {
    useButtonGameState.getState().activateButtonGame();

    router.push(`${pathname}/game`);
  };

  if (!currentCard) {
    return null;
  }

  return (
    <div>
      <header className="mb-7 space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm font-semibold">
          <p className="text-pink-500">
            Materi {currentIndex + 1} / {totalCards}
          </p>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-pink-100"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalCards}
          aria-label="Progres materi"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-pink-400 to-yellow-300 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="pt-1 font-jaro text-3xl leading-tight text-pink-600 md:text-4xl">
          {currentCard.title}
        </h2>
      </header>

      <ModuleRenderer blocks={currentCard.content} />

      {isLastCard && (
        <div className="my-8 flex justify-center">
          <Button onClick={showGamePage}>Ayo main! 🎮</Button>
        </div>
      )}

      <nav
        className="mt-8 flex items-center justify-between gap-4"
        aria-label="Navigasi materi"
      >
        <button
          type="button"
          onClick={prevCard}
          disabled={isFirstCard}
          aria-label="Materi sebelumnya"
          className={navButtonClass}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="text-sm font-medium text-gray-500">
          {currentIndex + 1} / {totalCards}
        </span>

        <button
          type="button"
          onClick={nextCard}
          disabled={isLastCard}
          aria-label="Materi berikutnya"
          className={navButtonClass}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}

"use client";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import Button
  from "@/components/button";

import ModuleRenderer
  from "@/components/modules/ModuleRenderer";

import {
  useButtonGameState,
} from "@/lib/game/useButtonGame";

import type {
  ModuleCardData,
} from "@/lib/modules/types";

type Props = {
  cards: ModuleCardData[];
};

export default function ModuleCard({
  cards,
}: Props) {
  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const totalCards =
    cards.length;

  const currentCard =
    cards[currentIndex];

  const isFirstCard =
    currentIndex === 0;

  const isLastCard =
    currentIndex ===
    totalCards - 1;

  const nextCard = () => {
    if (!isLastCard) {
      setCurrentIndex(
        (current) =>
          current + 1
      );
    }
  };

  const prevCard = () => {
    if (!isFirstCard) {
      setCurrentIndex(
        (current) =>
          current - 1
      );
    }
  };

  const showGamePage = () => {
    useButtonGameState
      .getState()
      .activateButtonGame();

    router.push(
      `${pathname}/game`
    );
  };

  if (!currentCard) {
    return null;
  }

  return (
    <div>
      <header
        className="
          mb-7
          space-y-2
        "
      >
        <p
          className="
            text-sm
            font-semibold
            text-pink-400
          "
        >
          Materi{" "}
          {currentIndex + 1}
          {" / "}
          {totalCards}
        </p>

        <h2
          className="
            font-jaro

            text-2xl
            leading-tight
            text-pink-600

            md:text-3xl
          "
        >
          {currentCard.title}
        </h2>
      </header>

      <ModuleRenderer
        blocks={
          currentCard.blocks
        }
      />

      {isLastCard && (
        <div
          className="
            my-8
            flex
            justify-center
          "
        >
          <Button
            onClick={
              showGamePage
            }
          >
            Ayo main! 🎮
          </Button>
        </div>
      )}

      <nav
        className="
          mt-8

          flex
          items-center
          justify-between

          gap-4
        "
        aria-label="Navigasi materi"
      >
        <button
          type="button"

          onClick={prevCard}

          disabled={
            isFirstCard
          }

          aria-label=
            "Materi sebelumnya"

          className="
            flex
            h-11 w-11

            items-center
            justify-center

            rounded-full

            border-2
            border-pink-200

            bg-white
            text-pink-600

            shadow-sm

            transition

            hover:bg-pink-50

            active:scale-95

            disabled:
              cursor-not-allowed

            disabled:opacity-30
          "
        >
          <ArrowLeft
            className="h-5 w-5"
          />
        </button>

        <span
          className="
            text-sm
            font-medium
            text-gray-500
          "
        >
          {currentIndex + 1}
          {" / "}
          {totalCards}
        </span>

        <button
          type="button"

          onClick={nextCard}

          disabled={
            isLastCard
          }

          aria-label=
            "Materi berikutnya"

          className="
            flex
            h-11 w-11

            items-center
            justify-center

            rounded-full

            border-2
            border-pink-200

            bg-white
            text-pink-600

            shadow-sm

            transition

            hover:bg-pink-50

            active:scale-95

            disabled:
              cursor-not-allowed

            disabled:opacity-30
          "
        >
          <ArrowRight
            className="h-5 w-5"
          />
        </button>
      </nav>
    </div>
  );
}
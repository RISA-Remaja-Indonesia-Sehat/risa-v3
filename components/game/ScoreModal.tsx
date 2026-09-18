"use client";

import Image from "next/image";
import { X } from "lucide-react";

import type {
  GameResult,
  StarRating,
} from "@/types/game-result";

type ScoreModalProps = {
  open: boolean;

  chapterNumber: number;
  result: GameResult;

  onClose: () => void;
  onRetry: () => void;
  onNext: () => void;

  nextLoading?: boolean;
};

const STAR_ASSETS: Record<
  StarRating,
  string
> = {
  0: "/img/game-result/stars-0.png",
  1: "/img/game-result/stars-1.png",
  2: "/img/game-result/stars-2.png",
  3: "/img/game-result/stars-3.png",
};

export default function ScoreModal({
  open,
  chapterNumber,
  result,
  onClose,
  onRetry,
  onNext,
  nextLoading = false,
}: ScoreModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-pink-950/20
        px-4

        backdrop-blur-sm
      "
    >
      <div
        className="
          relative

          w-full
          max-w-md

          overflow-hidden

          rounded-3xl
          border-2
          border-pink-200

          bg-linear-to-br
          from-white
          via-pink-50
          to-yellow-50

          p-6

          shadow-xl

          sm:p-8
        "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup hasil"
          className="
            absolute
            right-4
            top-4
            z-10

            flex
            h-10
            w-10

            items-center
            justify-center

            rounded-full

            bg-white/90
            text-gray-400

            shadow-sm

            transition

            cursor-pointer

            hover:bg-white
            hover:text-pink-600

            active:scale-95
          "
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="
            flex
            flex-col
            items-center

            text-center
          "
        >
          <span
            className="
              rounded-full

              bg-green-50

              px-4
              py-1.5

              text-xs
              font-semibold
              text-green-700
            "
          >
            Chapter {chapterNumber} selesai
          </span>

          <div
            className="
              relative

              mt-4

              h-44
              w-full

              sm:h-52
            "
          >
            <Image
              src={
                STAR_ASSETS[
                  result.stars
                ]
              }
              alt={`${result.stars} dari 3 bintang`}
              fill
              priority
              className="object-contain"
            />
          </div>

          <h2
            className="
              mt-2

              font-jaro

              text-3xl
              text-pink-600

              sm:text-4xl
            "
          >
            {result.title}
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xs

              text-sm
              leading-6
              text-gray-600
            "
          >
            {result.message}
          </p>

          {result.score !== undefined &&
            result.total !== undefined && (
              <div
                className="
                  mt-5

                  rounded-2xl

                  border
                  border-yellow-200

                  bg-white/80

                  px-5
                  py-3

                  text-sm
                  text-gray-600
                "
              >
                Kamu menjawab{" "}
                <span
                  className="
                    font-semibold
                    text-pink-600
                  "
                >
                  {result.score}
                </span>{" "}
                dari{" "}
                <span className="font-semibold">
                  {result.total}
                </span>{" "}
                dengan benar.
              </div>
            )}
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
            onClick={onRetry}
            className="
              flex
              min-h-12
              flex-1

              items-center
              justify-center

              rounded-full

              border-2
              border-pink-200

              bg-white

              px-5
              py-3

              text-sm
              font-semibold
              text-pink-600

              shadow-sm

              transition

              cursor-pointer

              hover:border-pink-300
              hover:bg-pink-50

              active:scale-[0.98]
            "
          >
            Coba lagi
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={nextLoading}
            className="
              flex
              min-h-12
              flex-1

              items-center
              justify-center

              rounded-full

              bg-pink-500

              px-5
              py-3

              text-sm
              font-semibold
              text-white

              shadow-md

              transition

              cursor-pointer

              hover:bg-pink-600
              hover:shadow-lg

              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:bg-pink-500
              disabled:active:scale-100
            "
          >
            {nextLoading
              ? "Memeriksa..."
              : "Chapter berikutnya"}
          </button>
        </div>
      </div>
    </div>
  );
}
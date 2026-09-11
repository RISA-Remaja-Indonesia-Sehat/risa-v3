import Link from "next/link";
import Image from "next/image";

import type { Chapter } from "./data-local";
import type { ProgressStatus } from "@/lib/game/progress";

type ChapterLeafProps = {
  chapter: Chapter;
  status: ProgressStatus;

  showFtue?: boolean;
  onStartFtue?: () => void;
};

export default function ChapterLeaf({
  chapter,
  status,
  showFtue = false,
  onStartFtue,
}: ChapterLeafProps) {
  const isRight = chapter.side === "right";

  const position = chapter.bottom
    ? { bottom: chapter.bottom }
    : { top: chapter.top };

  const content = (
    <div
      className="
        relative
        aspect-3/2
        w-full
      "
    >
      <Image
        src="/img/leaf.png"
        alt=""
        fill
        sizes="
          (max-width: 640px) 47vw,
          (max-width: 1024px) 44vw,
          520px
        "
        className={`
          object-contain

          drop-shadow-[0_7px_7px_rgba(52,85,12,0.16)]

          transition-all
          duration-300

          ${isRight ? "" : "-scale-x-100"}

          ${status === "locked" ? "brightness-75 opacity-70" : ""}

          ${
            showFtue
              ? "brightness-110 drop-shadow-[0_0_18px_rgba(250,204,21,0.95)]"
              : ""
          }
        `}
      />

      <div
        className={`
          absolute
          inset-y-[18%]

          flex
          flex-col
          items-center
          justify-center

          text-center

          ${isRight ? "left-[20%] right-[10%]" : "left-[10%] right-[20%]"}
        `}
      >
        <span
          className="
            font-jaro

            text-[clamp(16px,2vw,26px)]
            leading-none

            text-[#25440D]
          "
        >
          {status === "completed" && "✓ "}

          {status === "current" && "▶ "}

          {status === "locked" && "🔒 "}

          {chapter.label}
        </span>

        <span
          className="
            mt-1

            text-[clamp(9px,1vw,13px)]
            font-semibold

            text-[#365512]
          "
        >
          {chapter.tagline}
        </span>
      </div>
    </div>
  );

  const wrapperClassName = `
    absolute

    ${showFtue ? "z-60" : "z-20"}

    w-[clamp(180px,42vw,520px)]

    ${isRight ? "left-[calc(50%-18px)]" : "right-[calc(50%-18px)]"}
  `;

  const leafClassName = `
    block
    w-full

    transition-transform
    duration-300

    ${isRight ? "origin-left" : "origin-right"}

    hover:scale-[1.025]
    active:scale-[0.98]
  `;

  return (
    <div
      id={chapter.number === 1 ? "chapter-1-ftue-target" : undefined}
      style={position}
      className={wrapperClassName}
    >
      {status === "locked" ? (
        <button
          type="button"
          disabled
          className="
            block
            w-full
            cursor-not-allowed
          "
        >
          {content}
        </button>
      ) : (
        <Link href={chapter.href} prefetch={false} className={leafClassName}>
          {content}
        </Link>
      )}

      {/* FTUE Chapter 1 */}
      {showFtue && chapter.number === 1 && (
        <div
          className="
              absolute

              bottom-[calc(100%+14px)]
              right-0

              z-70

              w-[min(280px,82vw)]

              rounded-2xl

              border-2
              border-yellow-200

              bg-[#FFFBEA]

              p-5

              text-left

              shadow-xl

              md:bottom-auto
              md:right-[calc(100%+24px)]
              md:top-1/2

              md:w-72

              md:-translate-y-1/2
            "
        >
          <h3
            className="
                font-jaro

                text-2xl

                text-[#52731C]
              "
          >
            Mulai dari sini 🌱
          </h3>

          <p
            className="
                mt-2

                text-sm
                leading-6

                text-gray-600
              "
          >
            Chapter 1 adalah langkah pertamamu. Pelajari materinya lalu selesaikan
            game untuk membuka perjalanan berikutnya.
          </p>

          <button
            type="button"
            onClick={onStartFtue}
            className="
                mt-4
                w-full

                rounded-full

                bg-pink-500

                px-4
                py-3

                text-sm
                font-bold
                text-white

                shadow

                transition

                hover:bg-pink-600
              "
          >
            Mulai Chapter 1
          </button>

          <p
            className="mt-3 text-center text-xs font-medium text-gray-400"
          >
            2 / 2
          </p>
        </div>
      )}
    </div>
  );
}
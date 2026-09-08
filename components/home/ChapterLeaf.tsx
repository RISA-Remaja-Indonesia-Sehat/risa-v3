import Link from "next/link";
import Image from "next/image";

import type { Chapter } from "./data-local";
import type { ProgressStatus } from "@/lib/game/progress";

type ChapterLeafProps = {
  chapter: Chapter;
  status: ProgressStatus;
};

export default function ChapterLeaf({ chapter, status }: ChapterLeafProps) {
  const isRight = chapter.side === "right";

  const position = chapter.bottom
    ? { bottom: chapter.bottom }
    : { top: chapter.top };

  const content = (
    <div className="relative aspect-3/2 w-full">
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

          ${isRight ? "" : "-scale-x-100"}

          ${status === "locked" ? "brightness-75 opacity-70" : ""}
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

  const commonClassName = `
    group
    absolute
    z-20

    w-[clamp(180px,42vw,520px)]

    transition-transform
    duration-300

    ${
      isRight
        ? "left-[calc(50%-18px)] origin-left"
        : "right-[calc(50%-18px)] origin-right"
    }
  `;

  if (status === "locked") {
    return (
      <button
        type="button"
        style={position}
        className={`${commonClassName} cursor-not-allowed`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={chapter.href}
      prefetch={false}
      style={position}
      className={`
        ${commonClassName}

        hover:scale-[1.025]
        active:scale-[0.98]
      `}
    >
      {content}
    </Link>
  );
}

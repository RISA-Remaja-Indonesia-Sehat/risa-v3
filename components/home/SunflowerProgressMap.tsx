import ChapterLeaf from "./ChapterLeaf";
import PostTestFlower from "./PostTestFlower";
import Image from "next/image";

import { CHAPTERS } from "./data-local";
import { getChapterStatus, getPostTestStatus } from "@/lib/game/progress";

type SunflowerProgressMapProps = {
  isAuthenticated: boolean;
  completedChapters: number[];
  postTestCompleted: boolean;
};

export default function SunflowerProgressMap({
  isAuthenticated,
  completedChapters,
  postTestCompleted,
}: SunflowerProgressMapProps) {
  const postTestStatus = getPostTestStatus({
    isAuthenticated,
    completedChapters,
    postTestCompleted,
  });

  return (
    <section
      className="
        relative
        left-1/2
        mt-12
        h-[clamp(1280px,145vw,2050px)]
        w-screen
        -translate-x-1/2
      "
    >
      <div
        className="
          absolute inset-0
          mx-auto
          w-full
          max-w-[1100px]
          px-3
          sm:px-6
        "
      >
        {/* Batang */}
        <div
          aria-hidden="true"
          className="
    absolute
    left-1/2
    top-[8.5%]
    bottom-[1%]
    z-30
    w-3
    -translate-x-1/2
    rounded-full
    sm:w-4
    lg:w-5
    shadow-[0_2px_4px_rgba(63,88,10,0.18)]
  "
          style={{
            background:
              "linear-gradient(90deg, #597416 0%, #78951B 30%, #B1D43A 52%, #78951B 68%, #526C13 100%)",
          }}
        />

        {/* Bunga */}
        <PostTestFlower status={postTestStatus} />

        {/* Semua daun */}
        {CHAPTERS.map((chapter) => {
          const status = getChapterStatus({
            chapterNumber: chapter.number,
            isAuthenticated,
            completedChapters,
          });

          return (
            <ChapterLeaf
              key={chapter.number}
              chapter={chapter}
              status={status}
            />
          );
        })}
      </div>

      {/* Tanah */}
      <div
        className="
          absolute
          bottom-0
          left-0
          z-40
          h-[clamp(80px,10vw,155px)]
          w-full
          overflow-hidden
        "
      >
        <Image
          src="/img/ground.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}

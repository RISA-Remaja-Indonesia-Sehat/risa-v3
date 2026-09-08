import Link from "next/link";
import Image from "next/image";
import type { ProgressStatus } from "@/lib/game/progress";

type PostTestFlowerProps = {
  status: ProgressStatus;
};

export default function PostTestFlower({ status }: PostTestFlowerProps) {
  return (
    <Link
      href="/post-test"
      prefetch={false}
      aria-label="Buka Ujian Akhir atau Post Test"
      className="
              group
              absolute
              left-1/2
              top-0
              z-30

              w-[clamp(220px,42vw,460px)]

              -translate-x-1/2

              transition-transform
              duration-300
              ease-out

              hover:scale-[1.025]
              active:scale-[0.98]

              focus-visible:outline-none
            "
    >
      <div className="relative aspect-square w-full">
        <Image
          src="/img/sunflower.png"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 42vw, 460px"
          className="
                  object-contain
                  drop-shadow-[0_10px_12px_rgba(88,65,16,0.18)]
                "
        />

        {/* Tulisan di bagian tengah bunga */}
        <div
          className="
                  absolute
                  left-1/2
                  top-1/2

                  flex
                  h-[39%]
                  w-[39%]
                  -translate-x-1/2
                  -translate-y-1/2
                  flex-col
                  items-center
                  justify-center

                  text-center
                "
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
        </span>

          <span
            className="
                    mt-1
                    text-[clamp(8px,1.1vw,13px)]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-yellow-300

                    drop-shadow-[0_1px_1px_rgba(45,20,4,0.9)]
                  "
          >
            Post Test
          </span>
        </div>
      </div>
    </Link>
  );
}

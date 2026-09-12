"use client";

import { useState } from "react";
import Link from "next/link";

import { Clock3, House } from "lucide-react";

import Button from "@/components/button";
import ModuleCard from "./ModuleCard";

import type {
  ChapterModuleData,
} from "@/lib/modules/types";

type Props = {
  module: ChapterModuleData;
};

export default function ChapterModulePage({
  module,
}: Props) {
  const [showModule, setShowModule] =
    useState(false);

  return (
    <main
      className={`
        min-h-screen
        w-full

        bg-linear-to-br
        from-pink-50
        via-yellow-50
        to-pink-100

        px-4
        py-6

        font-jakarta

        ${
          !showModule
            ? "flex items-center justify-center"
            : ""
        }
      `}
    >
      {!showModule ? (
        <section
          className="
            mx-auto
            flex
            w-full
            max-w-md
            flex-col
            items-center

            rounded-3xl
            border-2 border-pink-200

            bg-white/85

            p-6
            text-center

            shadow-lg
            backdrop-blur-sm

            md:p-8
          "
        >
          <span
            className="
              text-sm
              font-semibold
              text-pink-500
            "
          >
            Chapter {module.chapterNumber}
          </span>

          <h1
            className="
              mt-2
              font-jaro
              text-3xl
              text-pink-600

              md:text-4xl
            "
          >
            {module.title}
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-6
              text-gray-600

              md:text-base
              md:leading-7
            "
          >
            {module.objective}
          </p>

          <div
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800"
          >
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            <span>
              {module.durationLabel}
            </span>
          </div>

          <div className="mt-6">
            <Button
              onClick={() =>
                setShowModule(true)
              }
            >
              Mulai belajar
            </Button>
          </div>
        </section>
      ) : (
        <div
          className="
            mx-auto
            w-full
            max-w-3xl
          "
        >
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="
              mb-5

              inline-flex
              h-11 w-11

              items-center
              justify-center

              rounded-full

              bg-white/80

              text-pink-600

              shadow-sm

              transition

              hover:bg-white
            "
          >
            <House className="h-5 w-5" />
          </Link>

          <section
            className="
              rounded-3xl
              border-2 border-pink-200

              bg-white/85

              p-5

              shadow-lg
              backdrop-blur-sm

              md:p-8
            "
          >
            <ModuleCard cards={module.cards} />
          </section>
        </div>
      )}
    </main>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Clock3, House } from "lucide-react";

import Button from "@/components/button";
import ModuleCard from "./ModuleCard";

import type { ChapterModuleData, ModuleCardData } from "@/lib/modules/types";

type Props = {
  module: ChapterModuleData;
  cards: ModuleCardData[];
};

export default function ChapterModulePage({ module, cards }: Props) {
  const [showModule, setShowModule] = useState(false);

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 px-4 py-6 font-jakarta ${
        !showModule ? "flex items-center justify-center" : ""
      }`}
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-pink-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-yellow-200/45 blur-3xl" />

      {!showModule ? (
        <section className="relative mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border-2 border-pink-200 bg-white/95 px-6 py-8 text-center shadow-2xl sm:px-8 sm:py-9">
          <Image
            src="/img/icon-risa.png"
            alt="Icon RISA"
            width={88}
            height={88}
            priority
          />

          <span className="mt-4 rounded-full bg-pink-100 px-4 py-1 text-sm font-bold text-pink-600">
            Chapter {module.chapterNumber}
          </span>

          <h1 className="mt-3 font-jaro text-3xl text-pink-600 sm:text-4xl">
            {module.title}
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            {module.objective}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800">
            <Clock3 className="h-5 w-5" aria-hidden="true" />
            <span>{module.durationLabel}</span>
          </div>

          <div className="mt-7 w-full">
            <Button onClick={() => setShowModule(true)}>Mulai belajar</Button>
          </div>
        </section>
      ) : (
        <div className="relative mx-auto w-full max-w-3xl">
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-pink-200 bg-white/90 text-pink-600 shadow-sm transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200"
          >
            <House className="h-5 w-5" aria-hidden="true" />
          </Link>

          <section className="rounded-3xl border-2 border-pink-200 bg-white/95 p-5 shadow-lg md:p-8">
            <ModuleCard cards={cards} />
          </section>
        </div>
      )}
    </main>
  );
}

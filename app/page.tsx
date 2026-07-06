"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Pencil } from "lucide-react";

const CHARACTERS = [
  "/img/avatar/avatar-1.png",
  "/img/avatar/avatar-2.png",
  "/img/avatar/avatar-3.png",
  "/img/avatar/avatar-4.png",
  "/img/avatar/avatar-5.png",
  "/img/avatar/avatar-6.png",
  "/img/avatar/avatar-7.png",
  "/img/avatar/avatar-8.png",
  "/img/avatar/avatar-9.png",
  "/img/avatar/avatar-10.png",
  "/img/avatar/avatar-11.png",
  "/img/avatar/avatar-12.png",
];

const CHAPTERS = [
  { href: "/chapters/chapter-7", label: "Chapter 7", side: "right" },
  { href: "/chapters/chapter-6", label: "Chapter 6", side: "left" },
  { href: "/chapters/chapter-5", label: "Chapter 5", side: "right" },
  { href: "/chapters/chapter-4", label: "Chapter 4", side: "left" },
  { href: "/chapters/chapter-3", label: "Chapter 3", side: "right" },
  { href: "/chapters/chapter-2", label: "Chapter 2", side: "left" },
  { href: "/chapters/chapter-1", label: "Chapter 1", side: "right" },
];

export default function Home() {
  const [selectedChar, setSelectedChar] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="bg-[url(/img/sunflower.png)] bg-no-repeat bg-cover bg-center bg-scroll w-full h-full px-5 py-80 md:py-120 m-0">
      {/* User profile — character + signboard */}
      <div className="relative -mt-85 -ml-4 md:-mt-135 flex items-center">
        {/* Character avatar */}
        <div
          className="relative w-12 h-12 md:w-24 md:h-24 z-10 shrink-0 cursor-pointer drop-shadow-lg"
          onClick={() => setShowPicker(true)}
          title="Ganti karakter"
        >
          <Image
            src={CHARACTERS[selectedChar]}
            alt="karakter"
            fill
            className="object-contain object-bottom"
          />
          <div className="absolute -bottom-1 -right-1 bg-yellow-300 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow">
            <Pencil className="w-3 h-3 text-gray-600" />
          </div>
        </div>

        {/* Signboard */}
        <div className="aspect-3/2 w-40 md:w-90 relative overflow-hidden -ml-8 md:-ml-16">
          <div className="bg-[url(/img/wooden-signboard.png)] bg-no-repeat bg-contain bg-center absolute inset-0"></div>
          <div className="absolute inset-0 flex justify-center items-center">
            <h2 className="text-lg md:text-2xl font-bold text-[#211510] font-jaro drop-shadow">
              User123
            </h2>
          </div>
        </div>
      </div>

      {/* Character picker modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-jaro text-2xl text-pink-600">
              Pilih Karaktermu
            </h3>
            <div className="flex gap-3 flex-wrap justify-center">
              {CHARACTERS.map((src, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedChar(i);
                    setShowPicker(false);
                  }}
                  className={`relative w-12 h-12 md:w-24 md:h-24 rounded-2xl border-4 transition-all overflow-hidden
                    ${selectedChar === i ? "border-pink-400 scale-110 shadow-lg" : "border-transparent hover:border-pink-200"}
                  `}
                >
                  <Image
                    src={src}
                    alt={`karakter ${i + 1}`}
                    fill
                    className="object-contain object-bottom"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPicker(false)}
              className="text-sm text-gray-400 hover:text-gray-600 mt-1"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Post Test — sunflower */}

      <div className="w-full h-full mt-40 md:mt-60 lg:mt-90 flex items-center justify-center group cursor-pointer">
          <Link href="/post-test" className="w-1/2 h-1/2 aspect-square rounded-full bg-yellow-800 md:border-4 border-yellow-600 shadow-inner flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-yellow-200 font-jaro text-xs md:text-2xl lg:text-5xl text-center leading-tight">
                Post Test
              </span>
          </Link>
      </div>

      {/* Chapter leaves — progress map */}
      {CHAPTERS.map((ch) => (
        <div
          key={ch.href}
          className={`${ch.side === "right" ? "overflow-x-hidden" : ""} ${ch.side === "right" ? "mt-30" : ""}`}
        >
          <Link
            href={ch.href}
            className={`relative w-3/4 aspect-3/2 flex justify-center items-center group
              ${ch.side === "right" ? "ml-28 md:ml-72 lg:ml-135" : "-ml-10 md:-ml-20 lg:-ml-40"}
            `}
          >
            <div
              className={ch.side === "right" ? "right-leaf" : "left-leaf"}
            ></div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <p className="text-2xl md:text-3xl font-jaro drop-shadow-sm group-hover:scale-105 transition-transform duration-200">
                {ch.label}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

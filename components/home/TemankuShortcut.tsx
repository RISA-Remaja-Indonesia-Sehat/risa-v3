"use client";

import { UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemankuShortcut() {
  const router = useRouter();

  return (
    <div className="fixed bottom-5 right-4 z-50 ">
      <button
        type="button"
        onClick={() => router.push("/temanku")}
        aria-label="Buka Temanku"
        className="min-h-12 items-center gap-2 rounded-full bg-pink-500 px-4 py-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(108,74,95,0.28)] transition hover:-translate-y-0.5 hover:bg-pink-600 md:bottom-7 md:right-7 md:px-5"
      >
        <span className="flex h-fit w-fit items-center justify-center">
          <UsersRound className="h-6 w-6" aria-hidden="true" />
        </span>
      <span className="rounded-full absolute -top-1.5 -right-1.5 bg-[#FFE477] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#6A5122]">
        Baru
      </span>
      </button>
    </div>
  );
}

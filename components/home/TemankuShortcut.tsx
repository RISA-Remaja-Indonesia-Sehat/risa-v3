"use client";

import { MessageCircleHeart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemankuShortcut() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/temanku")}
      aria-label="Buka Temanku"
      className="fixed bottom-5 right-4 z-50 flex min-h-12 items-center gap-2 rounded-full border-2 border-white/80 bg-[#F76C9A] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(108,74,95,0.28)] transition hover:-translate-y-0.5 hover:bg-[#E95F8E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 md:bottom-7 md:right-7 md:px-5"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <MessageCircleHeart className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>Temanku</span>
      <span className="rounded-full bg-[#FFE477] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#6A5122]">
        Baru
      </span>
    </button>
  );
}

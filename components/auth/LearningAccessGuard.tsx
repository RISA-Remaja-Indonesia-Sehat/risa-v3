"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useChildSession } from "@/hooks/useChildSession";

import { getChapterStatus, getPostTestStatus } from "@/lib/game/progress";

type Props = {
  children: ReactNode;
  mode: "chapters" | "post-test";
};

export default function LearningAccessGuard({ children, mode }: Props) {
  const pathname = usePathname();

  const router = useRouter();

  const {
    loading,
    sessionError,
    refreshChild,
    isChildAuthenticated,
    completedChapters,
    postTestCompleted,
  } = useChildSession();

  const chapterMatch = pathname.match(/\/chapters\/chapter-(\d+)/);

  const chapterNumber = chapterMatch ? Number(chapterMatch[1]) : null;

  /*
   * Chapter 1 tetap public.
   */
  const chapterNeedsProtection =
    mode === "chapters" && chapterNumber !== null && chapterNumber >= 2;

  let canAccess = true;

  if (chapterNeedsProtection && chapterNumber !== null) {
    const status = getChapterStatus({
      chapterNumber,
      isChildAuthenticated,
      completedChapters,
    });

    canAccess = status !== "locked";
  }

  if (mode === "post-test") {
    const status = getPostTestStatus({
      isChildAuthenticated,
      completedChapters,
      postTestCompleted,
    });

    canAccess = status !== "locked";
  }

  useEffect(() => {
    const requiresProtection = chapterNeedsProtection || mode === "post-test";

    if (!requiresProtection || loading || canAccess) {
      return;
    }

    /*
     * Belum login:
     * arahkan ke login dan simpan
     * tujuan awal.
     */
    if (!isChildAuthenticated) {
      router.replace(`/child/login?next=${encodeURIComponent(pathname)}`);

      return;
    }

    /*
     * Sudah login tetapi chapter
     * sebelumnya belum selesai.
     */
    router.replace("/");
  }, [
    canAccess,
    chapterNeedsProtection,
    isChildAuthenticated,
    loading,
    mode,
    pathname,
    router,
  ]);

  if (!chapterNeedsProtection || loading || canAccess || sessionError) {
    return;
  }

  /*
   * Chapter 1 tidak perlu menunggu
   * pemeriksaan session.
   */
  if (mode === "chapters" && !chapterNeedsProtection) {
    return children;
  }

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center

          bg-pink-50
        "
      >
        <p className="text-sm text-gray-500">Memeriksa progres...</p>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
        <section className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Sesi belum dapat diperiksa
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {sessionError === "network"
              ? "Server tidak dapat dihubungi. Periksa koneksi internetmu."
              : "Server sedang mengalami masalah. Silakan coba lagi."}
          </p>

          <button
            type="button"
            onClick={() => void refreshChild()}
            className="mt-5 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-600"
          >
            Coba lagi
          </button>
        </section>
      </main>
    );
  }

  if (!canAccess) {
    return null;
  }

  return children;
}

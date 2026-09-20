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

  if (!canAccess) {
    return null;
  }

  return children;
}

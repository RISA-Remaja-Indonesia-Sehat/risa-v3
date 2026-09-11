"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useChildSession,
} from "@/hooks/useChildSession";

export default function PostTestContent() {
  const router = useRouter();

  const {
    isChildAuthenticated,
    completedChapters,
    postTestCompleted,
    loading,
  } = useChildSession();

  const allChaptersCompleted = [
    1, 2, 3, 4, 5, 6, 7,
  ].every((chapter) =>
    completedChapters.includes(
      chapter
    )
  );

  const canAccess =
    isChildAuthenticated &&
    allChaptersCompleted;

  useEffect(() => {
    if (loading) return;

    if (canAccess) return;

    router.replace("/");
  }, [
    loading,
    canAccess,
    router,
  ]);

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
        "
      >
        <p>
          Memeriksa progres...
        </p>
      </main>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <main>
      {/* Post Test nanti di sini */}
      Post Test
    </main>
  );
}
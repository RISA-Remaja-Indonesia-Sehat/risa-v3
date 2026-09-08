"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type Child = {
  id: string;
  username: string;
  avatarId: string;
};

type ChildSessionData = {
  child: Child;
  completedChapters: number[];
  postTestCompleted: boolean;
};

type ChildMeResponse = {
  success: boolean;
  data: ChildSessionData;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export function useChildSession() {
  const [session, setSession] =
    useState<ChildSessionData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshChild = useCallback(
    async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/child/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.status === 401) {
          setSession(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Gagal memeriksa session anak.",
          );
        }

        const result =
          (await response.json()) as ChildMeResponse;

        setSession(result.data);
      } catch (error) {
        console.error(
          "Child session error:",
          error,
        );

        setSession(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void refreshChild();
  }, [refreshChild]);

  return {
    child: session?.child ?? null,
    loading,
    refreshChild,

    completedChapters:
      session?.completedChapters ?? [],

    postTestCompleted:
      session?.postTestCompleted ?? false,

    isChildAuthenticated:
      session !== null,
  };
}
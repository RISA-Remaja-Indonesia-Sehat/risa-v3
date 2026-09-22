"use client";

import { useCallback, useEffect, useState } from "react";

import {
  type ChildSessionData,
  isChildMeResponse,
} from "@/types/child-session";

type ChildSessionError = "network" | "server" | null;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useChildSession() {
  const [session, setSession] = useState<ChildSessionData | null>(null);

  const [sessionError, setSessionError] = useState<ChildSessionError>(null);

  const [loading, setLoading] = useState(true);

  const refreshChild = useCallback(async () => {
    try {
      setLoading(true);
      setSessionError(null);

      const response = await fetch(`${API_URL}/api/child/me`, {
        method: "GET",
        credentials: "include",
      });

      /*
       * Hanya 401 yang berarti belum login.
       */
      if (response.status === 401) {
        setSession(null);
        return;
      }

      if (!response.ok) {
        setSessionError("server");
        return;
      }

      const result: unknown = await response.json();

      if (!isChildMeResponse(result)) {
        setSessionError("server");
        return;
      }

      setSession(result.data);
    } catch (error) {
      console.error("Child session error:", error);

      setSessionError(error instanceof TypeError ? "network" : "server");
    } finally {
      setLoading(false);
    }
  }, []);

  const logoutChild = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/child/logout`, {
      method: "POST",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message ?? "Gagal keluar dari akun.");
    }

    setSession(null);
  }, []);

  useEffect(() => {
    void refreshChild();
  }, [refreshChild]);

  return {
    child: session?.child ?? null,
    loading,
    sessionError,
    refreshChild,
    logoutChild,
    completedChapters: session?.completedChapters ?? [],
    postTestCompleted: session?.postTestCompleted ?? false,
    isChildAuthenticated: session !== null,
  };
}

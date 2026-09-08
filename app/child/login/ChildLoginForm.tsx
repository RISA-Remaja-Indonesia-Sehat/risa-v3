"use client";

import { useState, type FormEvent } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { childApiFetch } from "@/lib/api/child-client";
import { getSafeNext } from "@/lib/navigation/safe-next";

export default function ChildLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = getSafeNext(searchParams.get("next"), "/");

  const created = searchParams.get("created") === "true";

  const [username, setUsername] = useState("");

  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      await childApiFetch("/api/child/login", {
        method: "POST",

        body: JSON.stringify({
          username,
          pin,
        }),
      });

      router.push(next);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-[#DFE1DA] bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667D68]">
          RISA
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#253029]">
          Masuk ke RISA
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#667068]">
          Gunakan username dan PIN yang sudah dibuat bersama orang tua atau
          wali.
        </p>

        {created && (
          <div className="mt-6 rounded-xl border border-[#CADCC8] bg-[#F5FAF4] px-4 py-3 text-sm text-[#476548]">
            Profil berhasil dibuat. Sekarang kamu dapat masuk.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-semibold text-[#344238]"
            >
              Username
            </label>

            <input
              id="username"
              required
              autoComplete="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="mb-1.5 block text-sm font-semibold text-[#344238]"
            >
              PIN
            </label>

            <input
              id="pin"
              type="password"
              required
              inputMode="numeric"
              maxLength={6}
              autoComplete="current-password"
              placeholder="6 angka"
              value={pin}
              onChange={(event) =>
                setPin(event.target.value.replace(/\D/g, ""))
              }
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-[#E7C7C7] bg-[#FFF7F7] px-4 py-3 text-sm text-[#9B4545]"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#4F6751] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#405642] disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ChildApiError, childApiFetch } from "@/lib/api/child-client";

import { isChildMeResponse } from "@/types/child-session";

import { getSafeNext } from "@/lib/navigation/safe-next";

type LoginPhase = "credentials" | "session";

function getLoginErrorMessage(error: unknown, phase: LoginPhase) {
  /*
   * Fetch gagal sebelum mendapat respons.
   * Biasanya karena internet terputus,
   * backend mati, atau DNS bermasalah.
   */
  if (error instanceof TypeError) {
    return "Server tidak dapat dihubungi. Periksa koneksi internet lalu coba lagi.";
  }

  /*
   * Kredensial ditolak oleh endpoint login.
   */
  if (
    phase === "credentials" &&
    error instanceof ChildApiError &&
    error.status === 401
  ) {
    return "Username atau PIN salah.";
  }

  /*
   * Login berhasil, tetapi cookie tidak dapat
   * digunakan untuk mengambil session anak.
   */
  if (
    phase === "session" &&
    error instanceof ChildApiError &&
    error.status === 401
  ) {
    return "Login berhasil, tetapi sesi anak gagal dibuat. Silakan coba masuk kembali.";
  }

  /*
   * /me merespons error lain atau bentuk
   * responsnya tidak sesuai kontrak.
   */
  if (phase === "session") {
    return "Sesi anak tidak dapat diverifikasi. Silakan coba masuk kembali.";
  }

  /*
   * Backend menerima request login,
   * tetapi mengalami internal error.
   */
  return "Terjadi masalah saat masuk. Silakan coba lagi.";
}

const inputClass =
  "w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-3.5 text-[15px] text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-yellow-100";

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

    let phase: LoginPhase = "credentials";

    try {
      await childApiFetch("/api/child/login", {
        method: "POST",

        body: JSON.stringify({
          username,
          pin,
        }),
      });

      /*
       * Kredensial sudah diterima.
       * Selanjutnya verifikasi session.
       */
      phase = "session";

      const sessionResponse = await childApiFetch<unknown>("/api/child/me", {
        method: "GET",
      });

      /*
       * Jangan redirect jika respons /me
       * tidak berisi profil dan progres valid.
       */
      if (!isChildMeResponse(sessionResponse)) {
        throw new Error("INVALID_CHILD_SESSION_RESPONSE");
      }

      router.replace(next);
      router.refresh();
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error, phase));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#CDE6FB_0%,#FFF6DC_52%,#FDE3EC_100%)] px-4 py-10 font-jakarta">
      {/* Biru hanya tersisa di bagian atas sebagai jembatan ke Home */}
      <div className="pointer-events-none absolute -left-24 bottom-16 h-64 w-64 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border-2 border-pink-200 bg-white/95 p-6 text-center shadow-2xl sm:p-8">
        <div className="mx-auto w-fit leading-none">
          <Image
            src="/img/icon-risa.png"
            alt="Icon RISA"
            width={88}
            height={88}
            priority
          />
        </div>

        <h1 className="mt-4 font-jaro text-4xl text-pink-600">Masuk ke RISA</h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
          Gunakan username dan PIN yang sudah dibuat bersama orang tua atau
          wali.
        </p>

        {created && (
          <div
            role="status"
            className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-800"
          >
            Profil berhasil dibuat. Sekarang kamu dapat masuk.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5 text-left">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
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
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
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
              onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
              className={inputClass}
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-2xl border-2 border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-800"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-500 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:bg-pink-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}

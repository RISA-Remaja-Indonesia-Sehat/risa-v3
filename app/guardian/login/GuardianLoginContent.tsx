"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api/client";
import { getSafeNext } from "@/lib/navigation/safe-next";
import { guardianUi as ui } from "@/lib/ui/guardian-theme";
import { BrandDots, GuardianLogo } from "@/components/guardian/GuardianBrand";

type MeResponse = {
  success: boolean;
  data: {
    guardian: {
      id: string;
      email: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export default function GuardianLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = getSafeNext(searchParams.get("next"), "/guardian/dashboard");
  const emailConfirmed = searchParams.get("confirmed") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Email atau password tidak valid.");
        return;
      }

      if (!data.session) {
        setErrorMessage(
          "Sesi tidak ditemukan. Pastikan email Anda sudah diverifikasi.",
        );
        return;
      }

      // Memastikan profil guardian dapat diambil sebelum pindah halaman.
      await apiFetch<MeResponse>("/api/me");

      router.push(next);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`${ui.page} relative overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:flex lg:items-center lg:justify-center lg:px-8`}
    >
      {/* Dekorasi halus pink-kuning di latar */}
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />

      <div
        className={`${ui.card} relative mx-auto grid w-full max-w-5xl overflow-hidden lg:grid-cols-[0.8fr_1.2fr]`}
      >
        {/* Panel informasi */}
        <section className="relative flex flex-col justify-between overflow-hidden border-b-2 border-[#E1E8DB] bg-[#EEF3E9] p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/60" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-pink-200/50" />

          <div className="relative">
            <GuardianLogo size={132} />

            <h1 className="mt-8 max-w-sm font-jaro text-4xl leading-tight text-[#2F3A31] sm:text-5xl">
              Selamat datang kembali
            </h1>

            <BrandDots className="mt-4" />

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#566159] sm:text-[15px]">
              Masuk menggunakan akun orang tua atau wali untuk mengelola izin,
              akses, dan progres belajar anak di RISA.
            </p>
          </div>

          <div className="relative mt-8 flex gap-3 border-t-2 border-white/70 pt-5 text-sm leading-6 text-[#566159] lg:mt-12">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#4F6751]"
              aria-hidden="true"
            />
            <p>
              Akses akun hanya diberikan kepada pengguna yang telah
              terautentikasi. Informasi akun dan data anak tidak ditampilkan
              secara publik.
            </p>
          </div>
        </section>

        {/* Form login */}
        <section className="flex items-center p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-8">
              <h2 className="font-jaro text-3xl text-[#2F3A31]">
                Masuk ke akun
              </h2>
              <p className={`mt-2 text-sm leading-6 ${ui.muted}`}>
                Masukkan email dan password yang digunakan saat membuat akun.
              </p>
            </div>

            {emailConfirmed && (
              <div role="status" className={`mb-6 ${ui.success}`}>
                Email berhasil diverifikasi. Anda sekarang dapat masuk ke akun.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={ui.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={ui.input}
                />
              </div>

              <div>
                <label htmlFor="password" className={ui.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={ui.input}
                />
              </div>

              {errorMessage && (
                <div role="alert" aria-live="polite" className={ui.error}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`${ui.btnPrimary} mt-2 w-full`}
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <div className="mt-7 border-t-2 border-[#F0EEE6] pt-6 text-center">
              <p className="text-sm text-[#747C75]">
                Belum punya akun?{" "}
                <Link
                  href="/guardian/register"
                  className="font-bold text-[#4F6751] underline decoration-pink-300 decoration-2 underline-offset-4 hover:decoration-pink-500"
                >
                  Buat akun
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

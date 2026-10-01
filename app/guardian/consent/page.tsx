"use client";

import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api/client";
import { guardianUi as ui } from "@/lib/ui/guardian-theme";
import { BrandDots, GuardianLogo } from "@/components/guardian/GuardianBrand";

type ApproveConsentResponse = {
  success: boolean;

  data: {
    consentRequest: {
      id: string;
      status: string;
      expiresAt: string;
    };
  };
};

export default function GuardianConsentPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function checkGuardian() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/guardian/login?next=/guardian/consent");

        return;
      }

      setCheckingAuth(false);
    }

    void checkGuardian();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!agreed) {
      setErrorMessage("Silakan berikan persetujuan terlebih dahulu.");

      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const result = await apiFetch<ApproveConsentResponse>(
        "/api/consent/approve",
        {
          method: "POST",
        },
      );

      const requestId = result.data.consentRequest.id;

      const source = new URLSearchParams(window.location.search).get("source");

      const setupSource =
        source === "dashboard"
          ? "&from=dashboard"
          : source === "guest"
            ? "&from=guest"
            : "";

      router.push(
        `/child/setup?consentRequestId=${encodeURIComponent(
          requestId,
        )}${setupSource}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan persetujuan.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className={`${ui.page} flex items-center justify-center px-4`}>
        <section className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-yellow-200 border-t-[#4F6751]"
            aria-hidden="true"
          />
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 text-sm font-medium ${ui.muted}`}
          >
            Memeriksa akun...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={`${ui.page} relative overflow-hidden px-4 py-10 sm:px-6`}>
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />

      <section
        className={`${ui.card} relative mx-auto max-w-2xl p-6 sm:p-8 lg:p-10`}
      >
        <GuardianLogo size={120} />

        <h1 className="mt-6 font-jaro text-4xl leading-tight text-[#2F3A31] sm:text-5xl">
          Persetujuan orang tua atau wali
        </h1>

        <BrandDots className="mt-4" />

        <p className={`mt-4 text-sm leading-6 ${ui.muted}`}>
          Sebelum membuat profil anak, kami membutuhkan persetujuan orang tua
          atau wali.
        </p>

        <div
          className={`${ui.panel} mt-8 space-y-4 p-5 text-sm leading-6 text-[#566159]`}
        >
          <p>
            RISA akan menyimpan informasi yang diperlukan untuk menjalankan
            pengalaman belajar anak, seperti username, avatar, dan progres
            chapter.
          </p>

          <p>
            Informasi tersebut digunakan untuk menyimpan progres dan mengelola
            akses anak ke RISA.
          </p>

          <p>
            Orang tua atau wali nantinya dapat melihat progres belajar anak yang
            terhubung ke akun mereka.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
              agreed
                ? "border-yellow-300 bg-yellow-50"
                : "border-[#E1E6DA] bg-[#FFFEFB] hover:border-[#C9D3C3]"
            }`}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#4F6751]"
            />

            <span className="text-sm leading-6 text-[#475349]">
              Saya adalah orang tua atau wali dan saya memberikan izin untuk
              membuat profil anak di RISA.
            </span>
          </label>

          {errorMessage && (
            <p role="alert" className={`mt-5 ${ui.error}`}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !agreed}
            className={`${ui.btnPrimary} mt-7 w-full`}
          >
            {loading ? "Menyimpan..." : "Berikan persetujuan"}
          </button>
        </form>

        <p className="mt-6 text-xs leading-5 text-[#8A928B]">
          Teks ini hanya demo. Sebelum RISA digunakan secara publik, teks
          persetujuan dan kebijakan privasi sebaiknya ditinjau secara khusus.
        </p>
      </section>
    </main>
  );
}

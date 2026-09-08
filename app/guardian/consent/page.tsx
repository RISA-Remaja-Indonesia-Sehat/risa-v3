"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api/client";

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

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [agreed, setAgreed] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function checkGuardian() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        router.replace(
          "/guardian/login?next=/guardian/consent"
        );

        return;
      }

      setCheckingAuth(false);
    }

    void checkGuardian();
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!agreed) {
      setErrorMessage(
        "Silakan berikan persetujuan terlebih dahulu."
      );

      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const result =
        await apiFetch<ApproveConsentResponse>(
          "/api/consent/approve",
          {
            method: "POST",
          }
        );

      const requestId =
        result.data.consentRequest.id;

      router.push(
        `/child/setup?consentRequestId=${encodeURIComponent(
          requestId
        )}`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan persetujuan."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE]">
        <p className="text-sm text-[#667068]">
          Memeriksa akun...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F3EE] px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-2xl rounded-3xl border border-[#DFE1DA] bg-white p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667D68]">
          RISA
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#253029]">
          Persetujuan orang tua atau wali
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#667068]">
          Sebelum membuat profil anak,
          kami membutuhkan persetujuan
          orang tua atau wali.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl bg-[#F6F7F3] p-5 text-sm leading-6 text-[#566159]">
          <p>
            RISA akan menyimpan informasi
            yang diperlukan untuk menjalankan
            pengalaman belajar anak, seperti
            username, avatar, dan progres
            chapter.
          </p>

          <p>
            Informasi tersebut digunakan
            untuk menyimpan progres dan
            mengelola akses anak ke RISA.
          </p>

          <p>
            Orang tua atau wali nantinya
            dapat melihat progres belajar
            anak yang terhubung ke akun mereka.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) =>
                setAgreed(
                  event.target.checked
                )
              }
              className="mt-1 h-4 w-4"
            />

            <span className="text-sm leading-6 text-[#475349]">
              Saya adalah orang tua atau
              wali dan saya memberikan izin
              untuk membuat profil anak
              di RISA.
            </span>
          </label>

          {errorMessage && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-[#E7C7C7] bg-[#FFF7F7] px-4 py-3 text-sm text-[#9B4545]"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading || !agreed
            }
            className="mt-7 w-full rounded-xl bg-[#4F6751] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#405642] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : "Berikan persetujuan"}
          </button>
        </form>

        <p className="mt-6 text-xs leading-5 text-[#8A928B]">
          Teks ini cocok untuk demo.
          Sebelum RISA digunakan secara
          publik, teks persetujuan dan
          kebijakan privasi sebaiknya
          ditinjau secara khusus.
        </p>
      </section>
    </main>
  );
}
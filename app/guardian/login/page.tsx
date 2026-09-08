"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api/client";

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

export default function GuardianLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const emailConfirmed =
    searchParams.get("confirmed") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setErrorMessage(
          "Email atau password tidak valid."
        );
        return;
      }

      if (!data.session) {
        setErrorMessage(
          "Sesi tidak ditemukan. Pastikan email Anda sudah diverifikasi."
        );
        return;
      }

      const profile =
        await apiFetch<MeResponse>("/api/me");

      console.log(
        "Guardian profile:",
        profile.data.guardian
      );

      router.push(next);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Terjadi kesalahan. Silakan coba kembali."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `
    w-full
    rounded-xl
    border
    border-[#D8DDD4]
    bg-white
    px-4
    py-3.5
    text-[15px]
    text-[#243027]
    outline-none
    transition

    placeholder:text-[#A2AAA3]

    hover:border-[#BCC7BC]

    focus:border-[#758A72]
    focus:ring-4
    focus:ring-[#758A72]/10
  `;

  const labelClass = `
    mb-1.5
    block
    text-sm
    font-semibold
    text-[#344238]
  `;

  return (
    <main
      className="
        min-h-screen
        bg-[#F4F3EE]
        px-4
        py-8

        sm:px-6
        sm:py-12

        lg:flex
        lg:items-center
        lg:justify-center
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-5xl
          overflow-hidden
          rounded-3xl
          border
          border-[#DFE1DA]
          bg-white

          lg:grid-cols-[0.8fr_1.2fr]
        "
      >
        {/* Left information panel */}
        <section
          className="
            flex
            flex-col
            justify-between
            border-b
            border-[#E4E6DF]
            bg-[#E9EDE6]
            p-6

            sm:p-8

            lg:border-b-0
            lg:border-r
            lg:p-10
          "
        >
          <div>
            <Link
              href="/"
              className="
                inline-flex
                items-center
                text-sm
                font-bold
                tracking-[0.18em]
                text-[#5D735D]
              "
            >
              RISA
            </Link>

            <h1
              className="
                mt-8
                max-w-sm
                text-3xl
                font-semibold
                leading-tight
                tracking-tight
                text-[#253029]

                sm:text-4xl
              "
            >
              Selamat datang kembali
            </h1>

            <p
              className="
                mt-4
                max-w-sm
                text-sm
                leading-6
                text-[#637067]

                sm:text-[15px]
              "
            >
              Masuk menggunakan akun orang tua
              atau wali untuk mengelola izin,
              akses, dan progres belajar anak
              di RISA.
            </p>
          </div>

          <div
            className="
              mt-8
              border-t
              border-[#D1D8CE]
              pt-5
              text-sm
              leading-6
              text-[#667269]

              lg:mt-12
            "
          >
            Akses akun hanya diberikan kepada
            pengguna yang telah terautentikasi.
            Informasi akun dan data anak tidak
            ditampilkan secara publik.
          </div>
        </section>

        {/* Login form */}
        <section
          className="
            flex
            items-center
            p-6

            sm:p-8

            lg:p-10
            xl:p-12
          "
        >
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-8">
              <h2
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-[#253029]
                "
              >
                Masuk ke akun
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#778078]
                "
              >
                Masukkan email dan password yang
                digunakan saat membuat akun.
              </p>
            </div>

            {/* Confirmation message */}
            {emailConfirmed && (
              <div
                role="status"
                className="
                  mb-6
                  rounded-xl
                  border
                  border-[#CADCC8]
                  bg-[#F5FAF4]
                  px-4
                  py-3
                  text-sm
                  leading-5
                  text-[#476548]
                "
              >
                Email berhasil diverifikasi.
                Anda sekarang dapat masuk ke akun.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={labelClass}
                >
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
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className={labelClass}
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              {/* Error */}
              {errorMessage && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="
                    rounded-xl
                    border
                    border-[#E7C7C7]
                    bg-[#FFF7F7]
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-[#9B4545]
                  "
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#4F6751]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition

                  hover:bg-[#405642]

                  focus-visible:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-[#4F6751]/20

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Memproses..."
                  : "Masuk"}
              </button>
            </form>

            <div
              className="
                mt-7
                border-t
                border-[#ECEDE8]
                pt-6
                text-center
              "
            >
              <p className="text-sm text-[#747C75]">
                Belum punya akun?{" "}
                <Link
                  href="/guardian/register"
                  className="
                    font-semibold
                    text-[#526B55]
                    underline-offset-4

                    hover:underline
                  "
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
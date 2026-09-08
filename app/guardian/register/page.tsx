"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { supabase } from "@/lib/supabase/client";

export default function GuardianRegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Password harus memiliki minimal 8 karakter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Konfirmasi password tidak sesuai."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signUp({
          email,
          password,

          options: {
            emailRedirectTo:
              `${window.location.origin}/guardian/login?confirmed=true`,

            data: {
              name,
              phone,
            },
          },
        });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        "Akun berhasil dibuat. Kami telah mengirimkan tautan verifikasi ke email Anda."
      );

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage(
        "Terjadi kesalahan. Silakan coba kembali."
      );
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
        {/* Intro */}
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
              Buat akun orang tua atau wali
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
              Akun ini digunakan untuk
              memberikan izin, mengelola akses,
              dan melihat progres belajar anak
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
            Data akun digunakan untuk keperluan
            akses dan pengelolaan profil anak.
            Informasi pribadi anak tidak
            ditampilkan secara publik.
          </div>
        </section>

        {/* Form */}
        <section
          className="
            p-6

            sm:p-8

            lg:p-10
            xl:p-12
          "
        >
          <div className="mx-auto max-w-xl">
            <div className="mb-8">
              <h2
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-[#253029]
                "
              >
                Informasi akun
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#778078]
                "
              >
                Gunakan email yang aktif karena
                kami akan mengirimkan tautan
                verifikasi.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={labelClass}
                >
                  Nama lengkap
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className={labelClass}
                >
                  Nomor telepon
                </label>

                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0812 3456 7890"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  className={inputClass}
                />

                <p
                  className="
                    mt-1.5
                    text-xs
                    leading-5
                    text-[#8A928B]
                  "
                >
                  Opsional. Gunakan nomor yang
                  dapat dihubungi.
                </p>
              </div>

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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />

                <p
                  className="
                    mt-1.5
                    text-xs
                    leading-5
                    text-[#8A928B]
                  "
                >
                  Gunakan minimal 8 karakter.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className={labelClass}
                >
                  Konfirmasi password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Masukkan kembali password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
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

              {/* Success */}
              {successMessage && (
                <div
                  role="status"
                  className="
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
                  {successMessage}
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
                  ? "Membuat akun..."
                  : "Buat akun"}
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
                Sudah punya akun?{" "}
                <Link
                  href="/guardian/login"
                  className="
                    font-semibold
                    text-[#526B55]
                    underline-offset-4

                    hover:underline
                  "
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
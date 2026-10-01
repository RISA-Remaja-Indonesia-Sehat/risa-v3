"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { guardianUi as ui } from "@/lib/ui/guardian-theme";
import { BrandDots, GuardianLogo } from "@/components/guardian/GuardianBrand";

export default function GuardianRegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("Password harus memiliki minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak sesuai.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,

        options: {
          emailRedirectTo: `${window.location.origin}/guardian/login?confirmed=true`,

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
        "Akun berhasil dibuat. Kami telah mengirimkan tautan verifikasi ke email Anda.",
      );

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("Terjadi kesalahan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  const hintClass = "mt-1.5 text-xs leading-5 text-[#8A928B]";

  return (
    <main
      className={`${ui.page} relative overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:flex lg:items-center lg:justify-center lg:px-8`}
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />

      <div
        className={`${ui.card} relative mx-auto grid w-full max-w-5xl overflow-hidden lg:grid-cols-[0.8fr_1.2fr]`}
      >
        {/* Intro */}
        <section className="relative flex flex-col justify-between overflow-hidden border-b-2 border-[#E1E8DB] bg-[#EEF3E9] p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/60" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-pink-200/50" />

          <div className="relative">
            <GuardianLogo size={132} />

            <h1 className="mt-8 max-w-sm font-jaro text-4xl leading-tight text-[#2F3A31] sm:text-5xl">
              Buat akun orang tua atau wali
            </h1>

            <BrandDots className="mt-4" />

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#566159] sm:text-[15px]">
              Akun ini digunakan untuk memberikan izin, mengelola akses, dan
              melihat progres belajar anak di RISA.
            </p>
          </div>

          <div className="relative mt-8 flex gap-3 border-t-2 border-white/70 pt-5 text-sm leading-6 text-[#566159] lg:mt-12">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#4F6751]"
              aria-hidden="true"
            />
            <p>
              Data akun digunakan untuk keperluan akses dan pengelolaan profil
              anak. Informasi pribadi anak tidak ditampilkan secara publik.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="mx-auto max-w-xl">
            <div className="mb-8">
              <h2 className="font-jaro text-3xl text-[#2F3A31]">
                Informasi akun
              </h2>

              <p className={`mt-2 text-sm leading-6 ${ui.muted}`}>
                Gunakan email yang aktif karena kami akan mengirimkan tautan
                verifikasi.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className={ui.label}>
                  Nama lengkap
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={ui.input}
                />
              </div>

              <div>
                <label htmlFor="phone" className={ui.label}>
                  Nomor telepon
                </label>

                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0812 3456 7890"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={ui.input}
                />

                <p className={hintClass}>
                  Opsional. Gunakan nomor yang dapat dihubungi.
                </p>
              </div>

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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={ui.input}
                />

                <p className={hintClass}>Gunakan minimal 8 karakter.</p>
              </div>

              <div>
                <label htmlFor="confirm-password" className={ui.label}>
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
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={ui.input}
                />
              </div>

              {errorMessage && (
                <div role="alert" className={ui.error}>
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div role="status" className={ui.success}>
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`${ui.btnPrimary} mt-2 w-full`}
              >
                {loading ? "Membuat akun..." : "Buat akun"}
              </button>
            </form>

            <div className="mt-7 border-t-2 border-[#F0EEE6] pt-6 text-center">
              <p className="text-sm text-[#747C75]">
                Sudah punya akun?{" "}
                <Link
                  href="/guardian/login"
                  className="font-bold text-[#4F6751] underline decoration-pink-300 decoration-2 underline-offset-4 hover:decoration-pink-500"
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

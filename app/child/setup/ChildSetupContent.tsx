"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import CharacterPicker from "@/components/profile/CharacterPicker";

import { apiFetch } from "@/lib/api/client";
import { supabase } from "@/lib/supabase/client";

import {
  clearGuestChapter1Progress,
  isGuestChapter1Completed,
} from "@/lib/game/guest-progress";

type SetupResponse = {
  success: boolean;

  data: {
    child: {
      id: string;
      username: string;
      avatarId: string;
    };
  };
};

export default function ChildSetupContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const consentRequestId =
    searchParams.get(
      "consentRequestId"
    );

  const [username, setUsername] =
    useState("");

  const [pin, setPin] =
    useState("");

  const [
    confirmPin,
    setConfirmPin,
  ] = useState("");

  const [avatarId, setAvatarId] =
    useState("avatar-01");

  const [
    showPicker,
    setShowPicker,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!consentRequestId) {
      setErrorMessage(
        "Persetujuan tidak ditemukan."
      );

      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setErrorMessage(
        "PIN harus terdiri dari 6 angka."
      );

      return;
    }

    if (pin !== confirmPin) {
      setErrorMessage(
        "Konfirmasi PIN tidak sama."
      );

      return;
    }

    setLoading(true);

    try {
      await apiFetch<SetupResponse>(
        "/api/child/setup",
        {
          method: "POST",

          body: JSON.stringify({
            consentRequestId,
            username,
            pin,
            avatarId,

            guestChapter1Completed:
              isGuestChapter1Completed(),
          }),
        }
      );

      /*
       * Progress guest sudah aman
       * tersimpan di database.
       */
      clearGuestChapter1Progress();

      /*
       * Guardian logout sebelum
       * perangkat kembali ke anak.
       */
      await supabase.auth.signOut();

      router.push(
        "/child/login?created=true&next=/chapters/chapter-2/game"
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal membuat profil anak."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F3EE] px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-xl rounded-3xl border border-[#DFE1DA] bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667D68]">
          Profil anak
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#253029]">
          Buat akses untuk anak
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#667068]">
          Username dan PIN akan digunakan
          anak untuk masuk ke RISA.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
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
              minLength={3}
              maxLength={24}
              autoComplete="username"
              placeholder="Contoh: Naya27"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />

            <p className="mt-1.5 text-xs text-[#8A928B]">
              Gunakan 3–24 karakter:
              huruf, angka, atau underscore.
            </p>
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
              autoComplete="new-password"
              placeholder="6 angka"
              value={pin}
              onChange={(event) =>
                setPin(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-pin"
              className="mb-1.5 block text-sm font-semibold text-[#344238]"
            >
              Konfirmasi PIN
            </label>

            <input
              id="confirm-pin"
              type="password"
              required
              inputMode="numeric"
              maxLength={6}
              autoComplete="new-password"
              placeholder="Masukkan kembali PIN"
              value={confirmPin}
              onChange={(event) =>
                setConfirmPin(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#344238]">
              Avatar
            </p>

            <button
              type="button"
              onClick={() =>
                setShowPicker(true)
              }
              className="rounded-xl border border-[#CBD2C9] px-4 py-3 text-sm font-semibold text-[#4F6751] hover:bg-[#F5F6F2]"
            >
              Pilih avatar
            </button>

            <p className="mt-2 text-xs text-[#8A928B]">
              Avatar terpilih: {avatarId}
            </p>
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
            {loading
              ? "Membuat profil..."
              : "Buat profil anak"}
          </button>
        </form>
      </section>

      {showPicker && (
        <CharacterPicker
          currentAvatarId={
            avatarId
          }
          onSelect={(id) => {
            setAvatarId(id);
            setShowPicker(false);
          }}
          onClose={() =>
            setShowPicker(false)
          }
        />
      )}
    </main>
  );
}
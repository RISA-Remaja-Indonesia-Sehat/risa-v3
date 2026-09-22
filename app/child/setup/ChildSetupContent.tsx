"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CharacterPicker from "@/components/profile/CharacterPicker";
import Image from "next/image";
import { apiFetch } from "@/lib/api/client";
import { supabase } from "@/lib/supabase/client";
import { CHARACTERS } from "@/components/profile/data-local";

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

type ConsentValidationResponse = {
  success: true;

  data: {
    consentRequest: {
      id: string;
      status: "APPROVED";
      expiresAt: string;
    };
  };
};

type ConsentValidationState =
  | {
      status: "checking";
    }
  | {
      status: "valid";
    }
  | {
      status: "invalid";
      message: string;
    };

export default function ChildSetupContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const consentRequestId = searchParams.get("consentRequestId");

  const [consentValidation, setConsentValidation] =
    useState<ConsentValidationState>(() =>
      consentRequestId
        ? {
            status: "checking",
          }
        : {
            status: "invalid",
            message: "ID persetujuan tidak ditemukan.",
          },
    );

  const fromDashboard = searchParams.get("from") === "dashboard";

  const fromGuest = searchParams.get("from") === "guest";

  const [username, setUsername] = useState("");

  const [pin, setPin] = useState("");

  const [confirmPin, setConfirmPin] = useState("");

  const [avatarId, setAvatarId] = useState("avatar-01");

  const selectedAvatar =
    CHARACTERS.find((character) => character.id === avatarId) ?? CHARACTERS[0];

  const [showPicker, setShowPicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!consentRequestId) {
      setConsentValidation({
        status: "invalid",
        message: "ID persetujuan tidak ditemukan.",
      });

      return;
    }

    const controller = new AbortController();

    setConsentValidation({
      status: "checking",
    });

    async function validateConsent() {
      try {
        await apiFetch<ConsentValidationResponse>(
          `/api/consent/${encodeURIComponent(consentRequestId!)}/validate`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!controller.signal.aborted) {
          setConsentValidation({
            status: "valid",
          });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof TypeError
            ? "Server tidak dapat dihubungi. Periksa koneksi internet lalu coba lagi."
            : error instanceof Error
              ? error.message
              : "Gagal memeriksa persetujuan.";

        setConsentValidation({
          status: "invalid",
          message,
        });
      }
    }

    void validateConsent();

    return () => {
      controller.abort();
    };
  }, [consentRequestId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!consentRequestId) {
      setErrorMessage("Persetujuan tidak ditemukan.");

      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setErrorMessage("PIN harus terdiri dari 6 angka.");

      return;
    }

    if (pin !== confirmPin) {
      setErrorMessage("Konfirmasi PIN tidak sama.");

      return;
    }

    setLoading(true);

    const shouldTransferGuestChapter1 = fromGuest && isGuestChapter1Completed();

    try {
      await apiFetch<SetupResponse>("/api/child/setup", {
        method: "POST",

        body: JSON.stringify({
          consentRequestId,
          username,
          pin,
          avatarId,

          guestChapter1Completed: shouldTransferGuestChapter1,
        }),
      });

      /*
       * Progress guest sudah aman
       * tersimpan di database.
       */
      if (shouldTransferGuestChapter1) {
        clearGuestChapter1Progress();
      }

      if (fromDashboard) {
        router.replace("/guardian/dashboard");

        return;
      }

      /*
       * Guardian logout sebelum
       * perangkat kembali ke anak.
       */
      await supabase.auth.signOut();

      const nextPath = shouldTransferGuestChapter1
        ? "/chapters/chapter-2"
        : "/";

      router.push(
        `/child/login?created=true&next=${encodeURIComponent(nextPath)}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal membuat profil anak.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (consentValidation.status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE] px-4">
        <section className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D8DDD4] border-t-[#4F6751]"
            aria-hidden="true"
          />

          <p
            role="status"
            aria-live="polite"
            className="mt-4 text-sm font-medium text-[#667068]"
          >
            Memeriksa persetujuan...
          </p>
        </section>
      </main>
    );
  }

  if (consentValidation.status === "invalid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE] px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border border-[#E7C7C7] bg-white p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9B4545]">
            Persetujuan tidak valid
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#253029]">
            Profil anak belum dapat dibuat
          </h1>

          <p role="alert" className="mt-3 text-sm leading-6 text-[#667068]">
            {consentValidation.message}
          </p>

          <button
            type="button"
            onClick={() => router.replace("/guardian/dashboard")}
            className="mt-6 w-full rounded-xl bg-[#4F6751] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#405642]"
          >
            Kembali ke dashboard
          </button>
        </section>
      </main>
    );
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
          Username dan PIN akan digunakan anak untuk masuk ke RISA.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />

            <p className="mt-1.5 text-xs text-[#8A928B]">
              Gunakan 3–24 karakter: huruf, angka, atau underscore.
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
                setPin(event.target.value.replace(/\D/g, ""))
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
                setConfirmPin(event.target.value.replace(/\D/g, ""))
              }
              className="w-full rounded-xl border border-[#D8DDD4] px-4 py-3.5 outline-none focus:border-[#758A72] focus:ring-4 focus:ring-[#758A72]/10"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#344238]">Avatar</p>

            <button
              type="button"
              onClick={() => setShowPicker(true)}
              aria-haspopup="dialog"
              aria-expanded={showPicker}
              className="
      flex
      w-full
      items-center
      gap-4

      rounded-2xl
      border
      border-[#CBD2C9]

      bg-[#F8F9F6]
      p-4

      text-left
      transition

      hover:border-[#AEBBAA]
      hover:bg-[#F2F5EF]

      focus-visible:outline-none
      focus-visible:ring-4
      focus-visible:ring-[#758A72]/10
    "
            >
              <span
                className="
        relative
        h-20
        w-20
        shrink-0
        overflow-hidden
        rounded-2xl
        bg-[#F5E5DF]
      "
              >
                <Image
                  src={selectedAvatar.src}
                  alt={selectedAvatar.name}
                  fill
                  sizes="80px"
                  className="object-contain object-bottom"
                />
              </span>

              <span className="min-w-0">
                <span
                  className="
          block
          text-sm
          font-semibold
          text-[#344238]
        "
                >
                  Avatar terpilih
                </span>

                <span
                  className="
          mt-1
          block
          text-xs
          leading-5
          text-[#778078]
        "
                >
                  {selectedAvatar.name}
                </span>

                <span
                  className="
          mt-2
          block
          text-sm
          font-semibold
          text-[#4F6751]
        "
                >
                  Ganti avatar
                </span>
              </span>
            </button>
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
            {loading ? "Membuat profil..." : "Buat profil anak"}
          </button>
        </form>
      </section>

      {showPicker && (
        <CharacterPicker
          currentAvatarId={avatarId}
          onSelect={(id) => {
            setAvatarId(id);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </main>
  );
}

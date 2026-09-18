"use client";

import { LogOut } from "lucide-react";

type ChildLogoutPromptProps = {
  open: boolean;
  loading: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ChildLogoutPrompt({
  open,
  loading,
  errorMessage,
  onClose,
  onConfirm,
}: ChildLogoutPromptProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/40 px-4 py-6
        backdrop-blur-[2px]
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="child-logout-title"
        className="
          w-full max-w-sm
          rounded-3xl
          border-2 border-pink-200
          bg-white/95
          p-6 text-center
          shadow-xl
          sm:p-8
        "
      >
        <div
          className="
            mx-auto
            flex h-14 w-14
            items-center justify-center
            rounded-full
            bg-pink-100
          "
        >
          <LogOut
            className="h-7 w-7 text-pink-600"
          />
        </div>

        <h2
          id="child-logout-title"
          className="
            mt-4
            font-jaro
            text-3xl
            text-pink-600
          "
        >
          Keluar dari akun?
        </h2>

        <p
          className="
            mt-3
            text-sm leading-6
            text-gray-600
          "
        >
          Progres belajarmu tetap tersimpan.
          Kamu perlu username dan PIN untuk
          masuk kembali.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="
              mt-4 rounded-xl
              border border-red-200
              bg-red-50
              px-4 py-3
              text-sm text-red-700
            "
          >
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={onConfirm}
          className="
            mt-6 w-full rounded-full
            bg-pink-600
            px-5 py-3
            text-sm font-bold text-white
            hover:bg-pink-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Sedang keluar..." : "Ya, keluar"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="
            mt-3 w-full py-2
            text-sm font-medium
            text-gray-500
            hover:text-gray-700
            disabled:opacity-50
          "
        >
          Tetap di sini
        </button>
      </div>
    </div>
  );
}
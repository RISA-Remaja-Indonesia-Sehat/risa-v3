"use client";

import { CheckCircle2, LogIn, Users } from "lucide-react";

type LoginPromptProps = {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onCreateAccess: () => void;
};

export default function LoginPrompt({
  open,
  onClose,
  onLogin,
  onCreateAccess,
}: LoginPromptProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/40
        px-4 py-6
        backdrop-blur-[2px]
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        className="
          w-full
          max-w-md

          rounded-3xl
          border-2
          border-pink-200

          bg-white/95
          p-6
          shadow-xl
          backdrop-blur-sm

          sm:p-8
        "
      >
        {/* Success */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-full
              bg-pink-100
            "
          >
            <CheckCircle2
              className="
                h-8 w-8
                text-pink-500
              "
            />
          </div>

          <h2
            id="login-prompt-title"
            className="
              mt-4
              font-jaro
              text-3xl
              text-pink-600

              sm:text-4xl
            "
          >
            Chapter 1 selesai!
          </h2>

          <p
            className="
              mt-3
              max-w-xs
              text-sm
              leading-6
              text-gray-600
            "
          >
            Untuk melanjutkan ke chapter berikutnya, masuk dengan akun RISA.
          </p>
        </div>

        {/* Login */}
        <button
          type="button"
          onClick={onLogin}
          className="
            mt-6
            flex w-full
            items-center justify-center
            gap-2

            rounded-full
            bg-pink-500
            px-5 py-3.5

            text-sm
            font-bold
            text-white

            shadow-md
            transition

            hover:bg-pink-600
            hover:shadow-lg

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-pink-200
          "
        >
          <LogIn className="h-4 w-4" />
          Saya sudah punya akun
        </button>

        {/* Divider */}
        <div
          className="
            my-6
            h-px
            bg-pink-100
          "
        />

        {/* Parent help */}
        <div className="text-center">
          <p
            className="
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Belum punya akun?
          </p>

          <p
            className="
              mx-auto
              mt-1
              max-w-xs
              text-sm
              leading-6
              text-gray-500
            "
          >
            Minta bantuan orang tua atau wali untuk membuat akses.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateAccess}
          className="
            mt-4
            flex w-full
            items-center justify-center
            gap-2

            rounded-full
            border-2
            border-pink-200

            bg-yellow-50
            px-5 py-3.5

            text-sm
            font-bold
            text-pink-600

            transition

            hover:border-pink-300
            hover:bg-yellow-100

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-pink-100
          "
        >
          <Users className="h-4 w-4" />
          Minta bantuan orang tua/wali
        </button>

        {/* Later */}
        <button
          type="button"
          onClick={onClose}
          className="
            mt-5
            w-full
            py-2

            text-sm
            font-medium
            text-gray-400

            transition

            hover:text-gray-600
            focus-visible:outline-none
          "
        >
          Nanti saja
        </button>
      </div>
    </div>
  );
}

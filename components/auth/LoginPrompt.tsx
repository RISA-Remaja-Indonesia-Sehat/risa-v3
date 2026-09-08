"use client";

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
        bg-black/30
        px-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-[#DFE1DA]
          bg-white
          p-6
          shadow-xl

          sm:p-7
        "
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[#6B806C]
          "
        >
          Chapter 1 selesai
        </p>

        <h2
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-tight
            text-[#253029]
          "
        >
          Simpan progresmu
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-6
            text-[#667068]
          "
        >
          Masuk untuk menyimpan progres
          dan melanjutkan ke chapter
          berikutnya.
        </p>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={onLogin}
            className="
              w-full
              rounded-xl
              bg-[#4F6751]
              px-4 py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#405642]
            "
          >
            Saya sudah punya akun
          </button>

          <button
            type="button"
            onClick={onCreateAccess}
            className="
              w-full
              rounded-xl
              border
              border-[#CBD2C9]
              bg-white
              px-4 py-3
              text-sm
              font-semibold
              text-[#425347]
              transition
              hover:bg-[#F5F6F2]
            "
          >
            Belum punya akun? Daftar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              py-2
              text-sm
              text-[#7A827C]
              hover:text-[#4C5750]
            "
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { X } from "lucide-react";

type AgeGateProps = {
  open: boolean;
  onClose: () => void;
  onMinor: () => void;
  onAdult: () => void;
};

export default function AgeGate({
  open,
  onClose,
  onMinor,
  onAdult,
}: AgeGateProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-110
        flex items-center justify-center
        bg-black/40
        px-4 py-6
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
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
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="
              rounded-lg
              p-1.5
              text-[#8A928B]
              transition

              hover:bg-[#F3F4F0]
              hover:text-[#4C5750]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#758A72]/15
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="-mt-1">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#667D68]
            "
          >
            Sebelum membuat akses
          </p>

          <h2
            id="age-gate-title"
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-tight
              text-[#253029]
            "
          >
            Pilih kelompok usiamu
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#687269]
            "
          >
            Informasi ini digunakan untuk
            menentukan proses pembuatan akses
            yang sesuai.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={onMinor}
            className="
              w-full
              rounded-xl
              border
              border-[#D5DAD2]
              bg-white
              px-4 py-4
              text-left
              transition

              hover:border-[#AEBBAE]
              hover:bg-[#F6F8F4]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#758A72]/15
            "
          >
            <span
              className="
                block
                text-sm
                font-semibold
                text-[#344238]
              "
            >
              Di bawah 18 tahun
            </span>

            <span
              className="
                mt-1
                block
                text-xs
                leading-5
                text-[#7B847D]
              "
            >
              Orang tua atau wali perlu membantu
              memberikan izin.
            </span>
          </button>

          <button
            type="button"
            onClick={onAdult}
            className="
              w-full
              rounded-xl
              border
              border-[#D5DAD2]
              bg-white
              px-4 py-4
              text-left
              transition

              hover:border-[#AEBBAE]
              hover:bg-[#F6F8F4]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#758A72]/15
            "
          >
            <span
              className="
                block
                text-sm
                font-semibold
                text-[#344238]
              "
            >
              18 tahun atau lebih
            </span>

            <span
              className="
                mt-1
                block
                text-xs
                leading-5
                text-[#7B847D]
              "
            >
              Kamu dapat melanjutkan proses
              pembuatan akses sendiri.
            </span>
          </button>
        </div>

        <p
          className="
            mt-6
            border-t
            border-[#ECEDE8]
            pt-5
            text-xs
            leading-5
            text-[#8A928B]
          "
        >
          RISA hanya meminta kelompok usia pada
          tahap ini, bukan tanggal lahir lengkap.
        </p>
      </div>
    </div>
  );
}
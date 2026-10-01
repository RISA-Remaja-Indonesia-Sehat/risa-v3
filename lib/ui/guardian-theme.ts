/**
 * Token gaya untuk seluruh area wali (login, register, consent, dashboard).
 *
 * Komposisi warna:
 *  - 70% cream / putih hangat  -> page, card
 *  - 20% sage green            -> tombol utama, ikon, teks sekunder
 *  - 10% pink + kuning RISA    -> progress bar, highlight, dekorasi kecil
 *
 * Bentuk mengikuti HomeScreen: tombol rounded-full, kartu rounded-3xl,
 * judul memakai font-jaro, ikon lucide h-5 w-5.
 */
export const guardianUi = {
  page: "min-h-screen bg-[#FBF7EF] font-jakarta text-[#2F3A31]",

  card: "rounded-3xl border-2 border-[#E6E9DD] bg-white shadow-[0_10px_30px_rgba(79,103,81,0.08)]",

  /** Panel sage lembut, dipakai untuk panel info dan panduan. */
  panel: "rounded-3xl border-2 border-[#D9E2D3] bg-[#EEF3E9]",

  heading: "font-jaro text-[#2F3A31]",

  muted: "text-[#667068]",

  btnPrimary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#4F6751] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#4F6751]/20 transition hover:bg-[#405642] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200 disabled:cursor-not-allowed disabled:opacity-50",

  btnSecondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-[#D5DDCF] bg-white px-5 py-2.5 text-sm font-semibold text-[#4F6751] transition hover:bg-[#F3F6EF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-100 disabled:cursor-not-allowed disabled:opacity-50",

  label: "mb-1.5 block text-sm font-semibold text-[#344238]",

  input:
    "w-full rounded-2xl border-2 border-[#E1E6DA] bg-[#FFFEFB] px-4 py-3.5 text-[15px] text-[#243027] outline-none transition placeholder:text-[#A2AAA3] hover:border-[#C9D3C3] focus:border-[#7C9A7B] focus:ring-4 focus:ring-yellow-100",

  error:
    "rounded-2xl border-2 border-pink-200 bg-pink-50 px-4 py-3 text-sm leading-5 text-pink-800",

  success:
    "rounded-2xl border-2 border-[#CFE0CB] bg-[#F3F9F1] px-4 py-3 text-sm leading-5 text-[#3F5F40]",

  /** Progress bar: track sage muda, isi pink -> kuning. */
  progressTrack: "h-3 overflow-hidden rounded-full bg-[#E9EEE4]",
  progressFill:
    "h-full rounded-full bg-linear-to-r from-pink-400 to-yellow-300 transition-[width] duration-500",
} as const;

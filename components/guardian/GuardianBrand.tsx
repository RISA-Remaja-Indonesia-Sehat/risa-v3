import Image from "next/image";
import Link from "next/link";

/**
 * Logo RISA (heart + wordmark). Simpan LogoRisa.png ke public/img/logo-risa.png
 * (rasio asli sekitar 850 x 380).
 */
export function GuardianLogo({ size = 128 }: { size?: number }) {
  return (
    <Link href="/" aria-label="RISA, kembali ke beranda" className="inline-block">
      <Image
        src="/img/logo-risa.png"
        alt="RISA"
        width={size}
        height={Math.round(size * (380 / 850))}
        priority
        className="h-auto"
        style={{ width: size }}
      />
    </Link>
  );
}

/** Tiga titik kecil pink-kuning sebagai "pengikat brand". */
export function BrandDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} aria-hidden="true">
      <span className="h-2 w-2 rounded-full bg-pink-400" />
      <span className="h-2 w-2 rounded-full bg-yellow-300" />
      <span className="h-2 w-2 rounded-full bg-[#7C9A7B]" />
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  ready: boolean;
};

export default function CloudCurtain({ ready }: Props) {
  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  const bothCloudsLoaded = leftLoaded && rightLoaded;

  useEffect(() => {
    if (!ready || !bothCloudsLoaded) return;

    // Sedikit delay agar user sempat melihat awan sebelum terbuka
    const openTimer = window.setTimeout(() => setOpening(true), 300);

    // Setelah animasi selesai (~900ms), hapus dari DOM sepenuhnya
    const goneTimer = window.setTimeout(() => setGone(true), 1400);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(goneTimer);
    };
  }, [ready, bothCloudsLoaded]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex pointer-events-none"
      style={{ transition: "opacity 500ms ease", opacity: opening ? 0 : 1 }}
    >
      {/* Awan kiri */}
      <div
        className="relative h-full w-1/2 overflow-hidden"
        style={{
          transform: opening ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Image
          src="/img/cloud-left.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover object-right"
          priority
          onLoad={() => setLeftLoaded(true)}
        />

        {!opening && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="animate-pulse rounded-full bg-white/60 px-5 py-2 text-sm font-semibold text-sky-700 backdrop-blur-sm">
              Memuat...
            </p>
          </div>
        )}
      </div>

      {/* Awan kanan */}
      <div
        className="relative h-full w-1/2 overflow-hidden"
        style={{
          transform: opening ? "translateX(100%)" : "translateX(0)",
          transition: "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Image
          src="/img/cloud-right.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover object-left"
          priority
          onLoad={() => setRightLoaded(true)}
        />
      </div>
    </div>
  );
}

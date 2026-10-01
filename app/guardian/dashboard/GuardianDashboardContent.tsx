"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";

import { CHARACTERS } from "@/components/profile/data-local";
import { apiFetch } from "@/lib/api/client";
import { supabase } from "@/lib/supabase/client";
import { guardianUi as ui } from "@/lib/ui/guardian-theme";
import { BrandDots, GuardianLogo } from "@/components/guardian/GuardianBrand";

type GuardianChild = {
  id: string;
  username: string;
  avatarId: string;
  accessStatus: "ACTIVE" | "REVOKED";
  linkedAt: string;
  completedChapters: number[];
  completedChapterCount: number;
  totalChapters: number;
  postTestCompleted: boolean;
  consent: {
    policyVersion: string;
    consentedAt: string;
    revokedAt: string | null;
  } | null;
};

type DashboardResponse = {
  success: boolean;
  data: {
    guardian: {
      id: string;
      email: string | null;
    };
    children: GuardianChild[];
  };
};

export default function GuardianDashboardContent() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/guardian/login?next=/guardian/dashboard");
        return;
      }

      const result = await apiFetch<DashboardResponse>("/api/guardian/dashboard");

      setDashboard(result.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Dashboard tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  function handleAddChild() {
    router.push("/guardian/consent?source=dashboard");
  }

  async function handleLogout() {
    setLoggingOut(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage("Gagal keluar dari akun. Silakan coba lagi.");
      setLoggingOut(false);
      return;
    }

    router.replace("/guardian/login");
    router.refresh();
  }

  if (loading) {
    return <DashboardLoading />;
  }

  if (!dashboard) {
    return (
      <main className={`${ui.page} flex items-center justify-center px-4`}>
        <section className={`${ui.card} w-full max-w-md p-7 text-center`}>
          <GuardianLogo size={112} />
          <h1 className="mt-5 font-jaro text-3xl text-[#2F3A31]">
            Dashboard belum dapat dimuat
          </h1>
          <p className={`mt-2 text-sm leading-6 ${ui.muted}`}>
            {errorMessage || "Silakan coba kembali."}
          </p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className={`${ui.btnPrimary} mt-6`}
          >
            Coba lagi
          </button>
        </section>
      </main>
    );
  }

  const activeChildren = dashboard.children.filter(
    (child) => child.accessStatus === "ACTIVE",
  ).length;

  return (
    <main className={`${ui.page} relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8`}>
      <div className="pointer-events-none absolute -right-28 -top-24 h-72 w-72 rounded-full bg-yellow-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-72 h-64 w-64 rounded-full bg-pink-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b-2 border-[#EBE8DD] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GuardianLogo size={112} />
            <h1 className="mt-4 font-jaro text-4xl text-[#2F3A31] sm:text-5xl">
              Dashboard orang tua
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <BrandDots />
              <p className={`text-sm ${ui.muted}`}>
                {dashboard.guardian.email ?? "Akun guardian"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            className={`${ui.btnSecondary} self-start sm:self-auto`}
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </header>

        {errorMessage && (
          <p role="alert" className={`mt-5 ${ui.error}`}>
            {errorMessage}
          </p>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryCard
            icon={<Users className="h-5 w-5" />}
            tone="sage"
            label="Akun anak"
            value={dashboard.children.length}
          />
          <SummaryCard
            icon={<ShieldCheck className="h-5 w-5" />}
            tone="yellow"
            label="Akses aktif"
            value={activeChildren}
          />
        </section>

        <GuidePanel initiallyOpen={dashboard.children.length === 0} />

        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-jaro text-3xl text-[#2F3A31]">
                Anak yang terhubung
              </h2>
              <p className={`mt-1 text-sm ${ui.muted}`}>
                Lihat progres belajar setiap anak di satu tempat.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddChild}
              className={ui.btnPrimary}
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Tambah akun anak
            </button>
          </div>

          {dashboard.children.length === 0 ? (
            <EmptyChildren onAddChild={handleAddChild} />
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {dashboard.children.map((child) => (
                <ChildProgressCard key={child.id} child={child} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const chipTone = {
  sage: "bg-[#E4EDDF] text-[#4F6751]",
  yellow: "bg-yellow-100 text-yellow-800",
  pink: "bg-pink-100 text-pink-600",
} as const;

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: keyof typeof chipTone;
}) {
  return (
    <article className={`${ui.card} p-5`}>
      <div className="flex items-center gap-4">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${chipTone[tone]}`}
        >
          {icon}
        </span>
        <div>
          <p className={`text-sm ${ui.muted}`}>{label}</p>
          <p className="font-jaro text-4xl leading-none text-[#2F3A31]">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

function GuideStep({
  number,
  title,
  description,
  badgeClass,
}: {
  number: string;
  title: string;
  description: string;
  badgeClass: string;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badgeClass}`}
      >
        {number}
      </span>
      <span>
        <strong className="block text-[#344238]">{title}</strong>
        {description}
      </span>
    </li>
  );
}

function GuidePanel({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <section className={`${ui.panel} mt-6`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="guardian-dashboard-guide"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 rounded-3xl px-5 py-4 text-left text-sm font-bold text-[#405642] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200"
      >
        <span>Bagaimana menggunakan dashboard ini?</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ol
          id="guardian-dashboard-guide"
          className="grid gap-4 border-t-2 border-white/70 px-5 py-5 text-sm leading-6 text-[#566159] md:grid-cols-3"
        >
          <GuideStep
            number="1"
            badgeClass="bg-[#4F6751] text-white"
            title="Berikan persetujuan"
            description="Mulai dari tombol Tambah akun anak dan baca informasi persetujuan."
          />
          <GuideStep
            number="2"
            badgeClass="bg-pink-500 text-white"
            title="Buat akses anak"
            description="Pilih avatar, username, dan PIN enam angka untuk digunakan anak."
          />
          <GuideStep
            number="3"
            badgeClass="bg-yellow-300 text-yellow-900"
            title="Pantau progres"
            description="Chapter yang selesai akan muncul otomatis pada kartu anak."
          />
        </ol>
      )}
    </section>
  );
}

function ChildProgressCard({ child }: { child: GuardianChild }) {
  const character =
    CHARACTERS.find((item) => item.id === child.avatarId) ?? CHARACTERS[0];

  const progress = child.totalChapters
    ? Math.round((child.completedChapterCount / child.totalChapters) * 100)
    : 0;

  const consentDate = child.consent
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(child.consent.consentedAt))
    : null;

  return (
    <article className={`${ui.card} p-5 sm:p-6`}>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-pink-50 to-yellow-100">
          <Image
            src={character.src}
            alt={character.name}
            fill
            sizes="64px"
            className="object-contain object-bottom"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold">{child.username}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                child.accessStatus === "ACTIVE"
                  ? "bg-[#E4EDDF] text-[#3F5F40]"
                  : "bg-pink-100 text-pink-700"
              }`}
            >
              {child.accessStatus === "ACTIVE" ? "Aktif" : "Dicabut"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#778078]">
            {child.completedChapterCount} dari {child.totalChapters} chapter
            selesai
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-[#475349]">Progres belajar</span>
          <span className="font-bold text-pink-600">{progress}%</span>
        </div>
        <div
          className={`mt-2 ${ui.progressTrack}`}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progres belajar ${child.username}`}
        >
          <div className={ui.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-[#858E86]">
          {child.completedChapters.length > 0
            ? `Selesai: Chapter ${child.completedChapters.join(", ")}`
            : "Belum ada chapter yang diselesaikan."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 border-t-2 border-[#F0EEE6] pt-5 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          {child.postTestCompleted ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4F6751]" />
          ) : (
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
          )}
          <span>
            <span className="block font-semibold text-[#475349]">Post-test</span>
            <span className="text-[#778078]">
              {child.postTestCompleted ? "Sudah selesai" : "Belum selesai"}
            </span>
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#4F6751]" />
          <span>
            <span className="block font-semibold text-[#475349]">
              Persetujuan
            </span>
            <span className="text-[#778078]">
              {child.consent?.revokedAt
                ? "Sudah dicabut"
                : consentDate
                  ? `Diberikan ${consentDate}`
                  : "Belum ditemukan"}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

function EmptyChildren({ onAddChild }: { onAddChild: () => void }) {
  return (
    <div className="mt-5 rounded-3xl border-2 border-dashed border-[#D5DDCF] bg-white px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-pink-600">
        <Users className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-jaro text-2xl text-[#2F3A31]">
        Belum ada akun anak
      </h3>
      <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${ui.muted}`}>
        Mulai dengan memberikan persetujuan, kemudian buat username dan PIN
        untuk anak.
      </p>
      <button
        type="button"
        onClick={onAddChild}
        className={`${ui.btnPrimary} mt-6`}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Buat akun anak
      </button>
    </div>
  );
}

function DashboardLoading() {
  return (
    <main className={`${ui.page} px-4 py-8 sm:px-6`}>
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-10 w-72 rounded-full bg-[#EDE9DC]" />
        <div className="mt-3 h-4 w-44 rounded-full bg-[#F1EEE3]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="h-24 rounded-3xl bg-white" />
          <div className="h-24 rounded-3xl bg-white" />
        </div>
        <div className="mt-8 h-72 rounded-3xl bg-white" />
      </div>
    </main>
  );
}

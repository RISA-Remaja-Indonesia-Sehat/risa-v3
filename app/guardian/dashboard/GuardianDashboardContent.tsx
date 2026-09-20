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

const SETUP_ORIGIN_KEY =
  "risa-child-setup-origin";

export default function GuardianDashboardContent() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardResponse["data"] | null>(null);
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
        router.replace(
          "/guardian/login?next=/guardian/dashboard",
        );
        return;
      }

      const result =
        await apiFetch<DashboardResponse>(
          "/api/guardian/dashboard",
        );

      setDashboard(result.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Dashboard tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  function handleAddChild() {
    sessionStorage.setItem(
      SETUP_ORIGIN_KEY,
      "guardian-dashboard",
    );

    router.push("/guardian/consent");
  }

  async function handleLogout() {
    setLoggingOut(true);
    setErrorMessage("");

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      setErrorMessage(
        "Gagal keluar dari akun. Silakan coba lagi.",
      );
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
      <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE] px-4">
        <section className="w-full max-w-md rounded-3xl border border-[#DFE1DA] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#253029]">
            Dashboard belum dapat dimuat
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#667068]">
            {errorMessage || "Silakan coba kembali."}
          </p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-5 rounded-xl bg-[#4F6751] px-5 py-3 text-sm font-semibold text-white hover:bg-[#405642]"
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
    <main className="min-h-screen bg-[#F4F3EE] px-4 py-6 text-[#253029] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#DDE1D9] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667D68]">
              RISA
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard orang tua
            </h1>
            <p className="mt-2 text-sm text-[#667068]">
              {dashboard.guardian.email ?? "Akun guardian"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-[#CBD2C9] bg-white px-4 py-2.5 text-sm font-semibold text-[#4F6751] transition hover:bg-[#F7F8F5] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </header>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-[#E7C7C7] bg-[#FFF7F7] px-4 py-3 text-sm text-[#9B4545]"
          >
            {errorMessage}
          </p>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryCard
            icon={<Users className="h-5 w-5" />}
            label="Akun anak"
            value={dashboard.children.length}
          />
          <SummaryCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Akses aktif"
            value={activeChildren}
          />
        </section>

        <GuidePanel
          initiallyOpen={dashboard.children.length === 0}
        />

        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Anak yang terhubung
              </h2>
              <p className="mt-1 text-sm text-[#707A72]">
                Lihat progres belajar setiap anak di satu tempat.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddChild}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#4F6751] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#405642]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah akun anak
            </button>
          </div>

          {dashboard.children.length === 0 ? (
            <EmptyChildren onAddChild={handleAddChild} />
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {dashboard.children.map((child) => (
                <ChildProgressCard
                  key={child.id}
                  child={child}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-[#DFE1DA] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-[#5D735D]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF0E7]">
          {icon}
        </span>
        <div>
          <p className="text-sm text-[#707A72]">{label}</p>
          <p className="text-2xl font-semibold text-[#253029]">{value}</p>
        </div>
      </div>
    </article>
  );
}

function GuideStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F6751] text-xs font-bold text-white">
        {number}
      </span>
      <span>
        <strong className="block text-[#344238]">{title}</strong>
        {description}
      </span>
    </li>
  );
}

function GuidePanel({
  initiallyOpen,
}: {
  initiallyOpen: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <section className="mt-6 rounded-2xl border border-[#D8DFD4] bg-[#EAF0E7]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="guardian-dashboard-guide"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[#405642]"
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
          className="grid gap-3 border-t border-[#D5DED1] px-5 py-5 text-sm leading-6 text-[#566159] md:grid-cols-3"
        >
          <GuideStep
            number="1"
            title="Berikan persetujuan"
            description="Mulai dari tombol Tambah akun anak dan baca informasi persetujuan."
          />
          <GuideStep
            number="2"
            title="Buat akses anak"
            description="Pilih avatar, username, dan PIN enam angka untuk digunakan anak."
          />
          <GuideStep
            number="3"
            title="Pantau progres"
            description="Chapter yang selesai akan muncul otomatis pada kartu anak."
          />
        </ol>
      )}
    </section>
  );
}

function ChildProgressCard({
  child,
}: {
  child: GuardianChild;
}) {
  const character =
    CHARACTERS.find(
      (item) => item.id === child.avatarId,
    ) ?? CHARACTERS[0];

  const progress = Math.round(
    (child.completedChapterCount /
      child.totalChapters) *
      100,
  );

  const consentDate = child.consent
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(child.consent.consentedAt))
    : null;

  return (
    <article className="rounded-3xl border border-[#DFE1DA] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F5E5DF]">
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
            <h3 className="truncate text-lg font-semibold">
              {child.username}
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                child.accessStatus === "ACTIVE"
                  ? "bg-[#E8F2E5] text-[#466447]"
                  : "bg-[#F3E7E7] text-[#8A4A4A]"
              }`}
            >
              {child.accessStatus === "ACTIVE"
                ? "Aktif"
                : "Dicabut"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#778078]">
            {child.completedChapterCount} dari {child.totalChapters} chapter selesai
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-[#475349]">Progres belajar</span>
          <span className="font-semibold text-[#4F6751]">{progress}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E8EBE5]">
          <div
            className="h-full rounded-full bg-[#7A9878] transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#858E86]">
          {child.completedChapters.length > 0
            ? `Selesai: Chapter ${child.completedChapters.join(", ")}`
            : "Belum ada chapter yang diselesaikan."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 border-t border-[#ECEEE9] pt-5 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          {child.postTestCompleted ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5F815E]" />
          ) : (
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#A58A4B]" />
          )}
          <span>
            <span className="block font-medium text-[#475349]">Post-test</span>
            <span className="text-[#778078]">
              {child.postTestCompleted ? "Sudah selesai" : "Belum selesai"}
            </span>
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#5F815E]" />
          <span>
            <span className="block font-medium text-[#475349]">Persetujuan</span>
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

function EmptyChildren({
  onAddChild,
}: {
  onAddChild: () => void;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed border-[#C8D0C5] bg-white px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F6E7E2] text-[#9A685B]">
        <Users className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">
        Belum ada akun anak
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#707A72]">
        Mulai dengan memberikan persetujuan, kemudian buat username dan PIN untuk anak.
      </p>
      <button
        type="button"
        onClick={onAddChild}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#4F6751] px-5 py-3 text-sm font-semibold text-white hover:bg-[#405642]"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Buat akun anak
      </button>
    </div>
  );
}

function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#F4F3EE] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-9 w-64 rounded-lg bg-[#DFE3DA]" />
        <div className="mt-3 h-4 w-44 rounded bg-[#E5E7E1]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="h-24 rounded-2xl bg-white" />
          <div className="h-24 rounded-2xl bg-white" />
        </div>
        <div className="mt-8 h-72 rounded-3xl bg-white" />
      </div>
    </main>
  );
}

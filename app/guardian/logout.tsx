"use client";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function GuardianLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push(
      "/guardian/login"
    );

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
    >
      Keluar
    </button>
  );
}
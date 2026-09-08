import { Suspense } from "react";
import GuardianLoginContent from "./GuardianLoginContent";

export default function GuardianLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE]">
          <p className="text-sm text-[#667068]">
            Memuat halaman...
          </p>
        </main>
      }
    >
      <GuardianLoginContent />
    </Suspense>
  );
}
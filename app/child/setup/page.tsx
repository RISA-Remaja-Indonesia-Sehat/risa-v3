import { Suspense } from "react";
import ChildSetupContent from "./ChildSetupContent";

export default function ChildSetupPage() {
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
      <ChildSetupContent />
    </Suspense>
  );
}
import { Suspense } from "react";
import ChildLoginForm from "./ChildLoginForm";

export default function ChildLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F4F3EE]">
          <p className="text-sm text-[#667068]">
            Memuat halaman login...
          </p>
        </main>
      }
    >
      <ChildLoginForm />
    </Suspense>
  );
}
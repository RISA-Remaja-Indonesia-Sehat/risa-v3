"use client";

import { useState } from "react";
import Button from "@/app/component/button";
import ModuleCard from "../ModuleCard";

export default function Page() {
  const [showModule, setShowModule] = useState(false);
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100">
      {!showModule && (
        <div className="max-w-md w-full p-6 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg flex flex-col gap-4">
        <h2 className="font-jaro text-center text-3xl md:text-4xl text-pink-600">
          Kenalan dengan Tubuhku
        </h2>
        <p className="text-center text-gray-700 leading-relaxed">
          Tujuan : memahami bagian tubuh reproduksi, fungsinya, perubahan
          pubertas, dan mengenali kondisi normal serta tidak normal.
        </p>
        <p className="text-center text-sm text-gray-600">
          Durasi : ±10–15 menit
        </p>

        <div className="w-fit mx-auto" onClick={() => setShowModule(true)}>
          <Button />
        </div>
      </div>
      )}

      {showModule && (
        <div className="max-w-2xl w-full p-6 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg flex flex-col gap-4">
          <ModuleCard />
        </div>
      )}
    </div>
  );
}

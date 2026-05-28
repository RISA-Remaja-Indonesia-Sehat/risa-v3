"use client";

import { useState } from "react";
import Button from "@/app/component/button";
import ModuleCard from "../../component/ModuleCard";
import { moduleData_7 } from "../data-local/module";
import Link from "next/link";
import { House } from "lucide-react";

export default function Page() {
  const [showModule, setShowModule] = useState(false);
  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-4 bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100 ${!showModule ? 'justify-center' : ''}`}>
      <Link href="/" className={`mb-6 w-full max-w-3xl ${showModule ? 'flex justify-start' : 'hidden'}`}>
        <House className="w-6 h-6 lg:w-8 lg:h-8 text-pink-600 cursor-pointer" />
      </Link>
      {!showModule && (
        <div className="max-w-md w-full p-6 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg flex flex-col gap-4">
        <h2 className="font-jaro text-center text-3xl md:text-4xl text-pink-600">
          Infeksi Menular Seksual (IMS)
        </h2>
        <p className="text-center text-gray-700 leading-relaxed">
          Tujuan : memahami apa itu infeksi menular seksual (IMS), mengenali tanda umum yang perlu diwaspadai, serta mengetahui pentingnya dukungan tenaga kesehatan dan sikap yang tidak menghakimi.
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
          <ModuleCard moduleData={moduleData_7} />
        </div>
      )}
    </div>
  );
}

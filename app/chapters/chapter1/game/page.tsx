import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function GamePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100">
      <Link href='/' className="absolute top-4 left-4">
        <House className="w-6 h-6 lg:w-8 lg:h-8 text-pink-600 cursor-pointer"/>
      </Link>

      <section className="max-w-2xl w-full p-4 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg flex flex-col gap-8 mt-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 leading-6">Tebak Nama - Nama Organ Berikut</h2>
          <Image src='/img/organ-game.png' alt='organ game' width={600} height={400} className="rounded-2xl shadow-lg"/>
        </div>

        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
              <h2 className="text-xl md:text-2xl text-white font-bold">A</h2>
            </div>
            <input type="text" name="answer-A" id="answer-A" className="border-2 border-neutral-300 rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300"/>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
              <h2 className="text-xl md:text-2xl text-white font-bold">B</h2>
            </div>
            <input type="text" name="answer-B" id="answer-B" className="border-2 border-neutral-300 rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300"/>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
              <h2 className="text-xl md:text-2xl text-white font-bold">C</h2>
            </div>
            <input type="text" name="answer-C" id="answer-C" className="border-2 border-neutral-300 rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300"/>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
              <h2 className="text-xl md:text-2xl text-white font-bold">D</h2>
            </div>
            <input type="text" name="answer-D" id="answer-D" className="border-2 border-neutral-300 rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300"/>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
              <h2 className="text-xl md:text-2xl text-white font-bold">E</h2>
            </div>
            <input type="text" name="answer-E" id="answer-E" className="border-2 border-neutral-300 rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300"/>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pink-500 flex justify-around items-center shadow-md">
              <h2 className="text-xl md:text-2xl text-white font-bold">F</h2>
            </div>
            <input type="text" name="answer-F" id="answer-F" className="border-2 border-neutral-300 rounded-lg p-1 md:p-2 w-full max-w-sm shadow-gray-300 focus:shadow-md focus:outline-pink-300"/>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300">
            Cek Jawaban
          </button>
        </div>
      </section>
    </div>
  )
}
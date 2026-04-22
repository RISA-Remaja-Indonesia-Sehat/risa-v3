'use client';

import { useState } from "react";
import { DndContext, DragEndEvent, useDroppable, useDraggable, useSensors, useSensor, PointerSensor, TouchSensor } from "@dnd-kit/core";
import { House, X } from "lucide-react";
import Link from "next/link";
import { game_2 } from "../../data-local/game";

type Statement = typeof game_2[number];
type Zone = "myth" | "fact";

function DraggableCard({ statement, disabled }: { statement: Statement; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: statement.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`border-2 border-pink-300 bg-white rounded-xl p-3 text-sm text-center shadow-sm select-none touch-none
        ${isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"}
        ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
      `}
    >
      {statement.text}
    </div>
  );
}

function DropZone({ id, label, color, children }: { id: Zone; label: string; color: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-36 rounded-2xl border-2 p-3 flex flex-col gap-2 transition-colors
        ${color} ${isOver ? "brightness-95" : ""}
      `}
    >
      <p className="font-bold text-center text-sm">{label}</p>
      {children}
    </div>
  );
}

export default function GamePage() {
  const [unplaced, setUnplaced] = useState<Statement[]>(game_2);
  const [zones, setZones] = useState<Record<Zone, Statement[]>>({ myth: [], fact: [] });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as number;
    const targetZone = over.id as Zone;

    const draggedItem =
      unplaced.find((s) => s.id === draggedId) ??
      zones.myth.find((s) => s.id === draggedId) ??
      zones.fact.find((s) => s.id === draggedId);

    if (!draggedItem) return;

    // Remove from current location
    setUnplaced((prev) => prev.filter((s) => s.id !== draggedId));
    setZones((prev) => ({
      myth: prev.myth.filter((s) => s.id !== draggedId),
      fact: prev.fact.filter((s) => s.id !== draggedId),
    }));

    if (targetZone === "myth" || targetZone === "fact") {
      setZones((prev) => ({ ...prev, [targetZone]: [...prev[targetZone], draggedItem] }));
    } else {
      setUnplaced((prev) => [...prev, draggedItem]);
    }
  };

  const handleSubmit = () => {
    const correct = [
      ...zones.myth.filter((s) => s.isMyth),
      ...zones.fact.filter((s) => !s.isMyth),
    ].length;
    setScore(correct);
    setSubmitted(true);
    setShowScore(true);
  };

  const allPlaced = unplaced.length === 0;

  return (
    <>
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-pink-50 via-yellow-50 to-pink-100">
      <Link href="/" className="absolute top-4 left-4">
        <House className="w-6 h-6 lg:w-8 lg:h-8 text-pink-600 cursor-pointer" />
      </Link>

      <section className="max-w-2xl w-full p-4 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl shadow-lg flex flex-col gap-6 mt-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-1 leading-6">Mitos vs Fakta</h2>
          <p className="text-center text-sm text-gray-500">Seret pernyataan berikut ke dalam kotak Mitos atau Fakta</p>
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {/* Unplaced cards */}
          <DropZone id={"myth" as Zone} label="" color="bg-transparent border-transparent">
            <div className="flex flex-col gap-2">
              {unplaced.map((s) => (
                <DraggableCard key={s.id} statement={s} disabled={submitted}/>
              ))}
            </div>
          </DropZone>

          {/* Drop zones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <DropZone id="myth" label="🚫 Mitos" color="bg-red-50 border-red-300">
              {zones.myth.map((s) => (
                <DraggableCard key={s.id} statement={s} disabled={submitted} />
              ))}
            </DropZone>
            <DropZone id="fact" label="✅ Fakta" color="bg-green-50 border-green-300">
              {zones.fact.map((s) => (
                <DraggableCard key={s.id} statement={s} disabled={submitted} />
              ))}
            </DropZone>
          </div>
        </DndContext>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!allPlaced || submitted}
            className={`font-bold py-2 px-6 rounded-full shadow-md transition duration-300 text-white
              ${!allPlaced || submitted ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}
            `}
          >
            {submitted ? "Sudah Dikumpulkan" : "Cek Jawaban"}
          </button>
        </div>
      </section>
    </div>

    {showScore && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center w-full max-w-sm">
              <div className="w-full flex justify-end">
                <X className="w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setShowScore(false)} />
              </div>
              <h2 className="md:text-2xl font-bold mb-2 md:mb-4 text-lg">Skor Anda</h2>
              <p className="md:text-xl text-sm">Anda mendapatkan {score} dari {game_2.length} jawaban yang benar.</p>
            </div>
          </div>
        )}
      </>
  );
}

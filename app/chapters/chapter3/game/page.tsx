"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { House, Timer, RotateCcw } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { game_3, GameItem } from "../../data-local/game";

const TOTAL_TIME = 60;

function DraggableItem({ item, disabled }: { item: GameItem; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-center p-1 rounded-xl bg-white/80 border-2 border-pink-200 select-none
        ${isDragging ? "opacity-50 cursor-grabbing z-50" : "cursor-grab"}
        ${disabled ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <Image src={item.image} alt={item.label} width={100} height={100} className="w-15 h-15 md:w-[100px] md:h-[100px] object-contain" />
    </div>
  );
}

function BagDropZone({ submitted, bagCount, disabled }: { submitted: boolean; bagCount: number; disabled: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "bag" });
  return (
    <div ref={setNodeRef} className="relative flex justify-center items-end">
      <div className={`absolute inset-0 rounded-2xl transition-colors ${isOver && !disabled ? "bg-pink-200/40" : ""}`} />
      <Image
        src={submitted ? "/img/close-bag.png" : "/img/open-bag.png"}
        alt="bag"
        width={280}
        height={280}
        className="w-sm lg:w-md object-contain relative z-10 pointer-events-none"
      />
      {!submitted && bagCount > 0 && (
        <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-20">
          {bagCount}
        </div>
      )}
    </div>
  );
}

function ScatterArea() {
  const { setNodeRef } = useDroppable({ id: "items" });
  return (
    <div ref={setNodeRef} className="absolute inset-0 -z-10" />
  );
}

export default function GamePage() {
  const [bagItems, setBagItems] = useState<GameItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [itemZones] = useState<Record<number, "left" | "right">>(() => {
    const shuffled = [...game_3].sort(() => Math.random() - 0.5);
    return Object.fromEntries(
      shuffled.map((item, i) => [item.id, i < Math.ceil(shuffled.length / 2) ? "left" : "right"])
    );
  });

  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isGameDone = submitted || gameOver;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    if (submitted) clearInterval(intervalRef.current!);
  }, [submitted]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const unplacedItems = game_3.filter((item) => !bagItems.find((b) => b.id === item.id));

  const handleDragEnd = (event: DragEndEvent) => {
    if (isGameDone) return;
    const { active, over } = event;
    if (!over) return;
    const draggedItem = game_3.find((item) => item.id === active.id);
    if (!draggedItem) return;

    if (over.id === "bag") {
      setBagItems((prev) => prev.find((b) => b.id === draggedItem.id) ? prev : [...prev, draggedItem]);
    } else if (over.id === "items") {
      setBagItems((prev) => prev.filter((b) => b.id !== draggedItem.id));
    }
  };

  const handleSubmit = () => {
    const correctCount = game_3.filter((i) => i.isCorrect).length;
    const correctInBag = bagItems.filter((i) => i.isCorrect).length;
    const wrongInBag = bagItems.filter((i) => !i.isCorrect).length;
    const score = Math.max(0, correctInBag - wrongInBag);
    console.log(`Score: ${score} / ${correctCount} (Benar: ${correctInBag}, Salah: ${wrongInBag})`);
    setSubmitted(true);
  };

  const handleReset = () => setBagItems([]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Background */}
      <Image src="/img/background-mobile.png"  alt="bg" fill className="object-cover block md:hidden" priority />
      <Image src="/img/background-tablet.png"  alt="bg" fill className="object-cover hidden md:block lg:hidden" priority />
      <Image src="/img/background-desktop.png" alt="bg" fill className="object-cover hidden lg:block" priority />

      {/* Home */}
      <Link href="/" className="absolute top-4 left-4 z-30">
        <House className="w-6 h-6 lg:w-8 lg:h-8 text-pink-600" />
      </Link>

      {/* Game layout */}
      <div className="relative z-10 flex flex-col h-screen p-4 pt-4 gap-3">
        {/* Header */}
        <div className="items-center justify-between mt-8">
          <div className="text-center flex-1 mb-2">
            <h2 className="text-lg md:text-xl font-bold text-pink-700 drop-shadow">Siapkan Tas Menstruasimu!</h2>
            <p className="text-xs md:text-sm text-pink-600 font-medium drop-shadow">
              {gameOver ? "Waktu habis! Game Over." : submitted ? "Tas sudah dicek!" : "Seret item ke dalam tas"}
            </p>
          </div>
          <div className={`flex w-fit items-center gap-1 font-mono font-bold text-sm px-3 py-1 mb-4 rounded-xl bg-white/80 border-2 pointer-events-auto float-end
            ${isUrgent ? "border-red-400 text-red-500 animate-bounce" : "border-pink-200 text-pink-700"}
          `}>
            <Timer className={`w-4 h-4 ${isUrgent ? "text-red-500" : "text-pink-500"}`} />
            {minutes} : {seconds}
          </div>
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <ScatterArea />
          {/* Mobile: items atas, bag bawah */}
          <div className="flex-1 flex flex-col gap-3 sm:hidden">
            <div className="flex flex-wrap gap-2 justify-center">
              {unplacedItems.map((item) => (
                <DraggableItem key={item.id} item={item} disabled={isGameDone} />
              ))}
            </div>
            <div className="flex flex-col items-center gap-2 mt-4">
              <BagDropZone submitted={submitted} bagCount={bagItems.length} disabled={isGameDone} />
              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={bagItems.length === 0 || isGameDone} className={`font-bold py-2 px-6 rounded-full shadow-md transition duration-300 text-white ${bagItems.length === 0 || isGameDone ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}`}>
                  {submitted ? "Sudah Dicek!" : "Cek Isi Tas"}
                </button>
                <button onClick={handleReset} disabled={bagItems.length === 0 || isGameDone} className={`p-2 rounded-full shadow-md transition duration-300 ${bagItems.length === 0 || isGameDone ? "bg-gray-300 cursor-not-allowed text-gray-400" : "bg-white hover:bg-pink-100 text-pink-500"}`} title="Kosongkan tas">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* md+: Items kiri | Bag | Items kanan */}
          <div className="flex-1 hidden sm:grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            {/* Left items */}
            <div className="flex flex-col gap-2 items-end">
              {unplacedItems.filter((i) => itemZones[i.id] === "left").map((item) => (
                <DraggableItem key={item.id} item={item} disabled={isGameDone} />
              ))}
            </div>

            {/* Bag center */}
            <div className="flex flex-col items-center gap-2">
              <BagDropZone submitted={submitted} bagCount={bagItems.length} disabled={isGameDone} />
              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={bagItems.length === 0 || isGameDone} className={`font-bold py-2 px-6 rounded-full shadow-md transition duration-300 text-white ${bagItems.length === 0 || isGameDone ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}`}>
                  {submitted ? "Sudah Dicek!" : "Cek Isi Tas"}
                </button>
                <button onClick={handleReset} disabled={bagItems.length === 0 || isGameDone} className={`p-2 rounded-full shadow-md transition duration-300 ${bagItems.length === 0 || isGameDone ? "bg-gray-300 cursor-not-allowed text-gray-400" : "bg-white hover:bg-pink-100 text-pink-500"}`} title="Kosongkan tas">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right items */}
            <div className="flex flex-col gap-2 items-start">
              {unplacedItems.filter((i) => itemZones[i.id] === "right").map((item) => (
                <DraggableItem key={item.id} item={item} disabled={isGameDone} />
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}

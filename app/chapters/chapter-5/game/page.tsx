"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { House } from "lucide-react";
import { game_5, SnackItem } from "../../data-local/game";
import { useRouter } from "next/navigation";
import ScoreModal from "@/components/game/ScoreModal";
import { evaluateChapter5 } from "@/lib/game/evaluate/chapter-5";

const TOTAL_TIME = 60;
const ITEM_SIZE = 72;
const BASKET_WIDTH = 140;
const BASKET_HEIGHT = 100;
const BASKET_STEP = 20;
const SPAWN_INTERVAL = 1400;

type FallingItem = {
  uid: number;
  snack: SnackItem;
  x: number;
  y: number;
  speed: number;
  caught: boolean;
};

export default function GamePage() {
  const router = useRouter();

  const areaRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    basketX: 50,
    items: [] as FallingItem[],
    score: 0,
    timeLeft: TOTAL_TIME,
    gameOver: false,
    uidCounter: 0,
  });

  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);

  const rafRef = useRef<number>(0);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const keysRef = useRef<Set<string>>(new Set());

  const spawnItem = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;
    const snack = game_5[Math.floor(Math.random() * game_5.length)];
    const uid = ++s.uidCounter;
    const x = 5 + Math.random() * 90;
    const speed = 1.5 + Math.random() * 2;
    const newItem: FallingItem = {
      uid,
      snack,
      x,
      y: -ITEM_SIZE,
      speed,
      caught: false,
    };
    s.items = [...s.items, newItem];
    setItems([...s.items]);
  }, []);

  const gameLoop = useCallback(function runGameLoop() {
    const s = stateRef.current;
    if (s.gameOver) return;

    const areaH = areaRef.current?.clientHeight ?? 600;
    const areaW = areaRef.current?.clientWidth ?? 400;

    if (keysRef.current.has("ArrowLeft")) {
      const minX = (BASKET_WIDTH / 2 / areaW) * 100;
      s.basketX = Math.max(minX, s.basketX - (BASKET_STEP / areaW) * 100);
      setBasketX(s.basketX);
    }
    if (keysRef.current.has("ArrowRight")) {
      const maxX = ((areaW - BASKET_WIDTH / 2) / areaW) * 100;
      s.basketX = Math.min(maxX, s.basketX + (BASKET_STEP / areaW) * 100);
      setBasketX(s.basketX);
    }

    const basketPx = (s.basketX / 100) * areaW;
    const basketTop = areaH - BASKET_HEIGHT;

    let scoreChanged = false;
    s.items = s.items
      .map((item) => {
        if (item.caught) return item;
        const newY = item.y + item.speed;
        const itemPx = (item.x / 100) * areaW;

        if (
          newY + ITEM_SIZE >= basketTop &&
          newY <= basketTop + BASKET_HEIGHT &&
          itemPx + ITEM_SIZE / 2 >= basketPx - BASKET_WIDTH / 2 &&
          itemPx - ITEM_SIZE / 2 <= basketPx + BASKET_WIDTH / 2
        ) {
          s.score += item.snack.points;
          scoreChanged = true;
          return { ...item, y: newY, caught: true };
        }

        return { ...item, y: newY };
      })
      .filter((item) => item.y < areaH + ITEM_SIZE);

    if (scoreChanged) setScore(s.score);
    setItems([...s.items]);

    rafRef.current = requestAnimationFrame(runGameLoop);
  }, []);

  const startTimers = useCallback(() => {
    const s = stateRef.current;

    cancelAnimationFrame(rafRef.current);

    if (spawnRef.current) {
      clearInterval(spawnRef.current);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    rafRef.current = requestAnimationFrame(gameLoop);

    spawnRef.current = setInterval(spawnItem, SPAWN_INTERVAL);

    timerRef.current = setInterval(() => {
      s.timeLeft -= 1;

      setTimeLeft(s.timeLeft);

      if (s.timeLeft <= 0) {
        s.timeLeft = 0;
        s.gameOver = true;

        // Pastikan ScoreModal
        // mendapatkan skor final.
        setScore(s.score);
        setTimeLeft(0);
        setGameOver(true);

        if (spawnRef.current) {
          clearInterval(spawnRef.current);
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        cancelAnimationFrame(rafRef.current);
      }
    }, 1000);
  }, [gameLoop, spawnItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    startTimers();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(rafRef.current);
      clearInterval(spawnRef.current!);
      clearInterval(timerRef.current!);
    };
  }, [startTimers]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.gameOver) return;
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(
      (BASKET_WIDTH / 2 / rect.width) * 100,
      Math.min(((rect.width - BASKET_WIDTH / 2) / rect.width) * 100, x),
    );
    stateRef.current.basketX = clamped;
    setBasketX(clamped);
  };

  const handleRestart = () => {
    const s = stateRef.current;
    s.basketX = 50;
    s.items = [];
    s.score = 0;
    s.timeLeft = TOTAL_TIME;
    s.gameOver = false;
    s.uidCounter = 0;
    setBasketX(50);
    setItems([]);
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setGameOver(false);
    startTimers();
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const isUrgent = timeLeft <= 10;

  const gameResult = evaluateChapter5(score);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Soft pastel gradient background overlay */}
      <Image
        src="/img/snack-dash/kitchen.png"
        alt="bg"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-pink-100/30" />

      {/* HUD */}
      {!gameOver && (
        <div className="relative z-20 flex items-center justify-between px-4 pt-4 gap-3">
          <Link href="/">
            <House className="w-6 h-6 text-pink-500 drop-shadow" />
          </Link>

          {/* Score */}
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border-2 border-pink-200 rounded-2xl px-4 py-1.5 shadow-sm">
            <span className="text-xs text-pink-400 font-medium">Skor</span>
            <span
              className={`font-bold text-lg ${score < 0 ? "text-red-400" : "text-pink-600"}`}
            >
              {score}
            </span>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border-2 rounded-2xl px-4 py-1.5 shadow-sm font-mono font-bold text-lg
          ${isUrgent ? "border-red-300 text-red-400 animate-scale-pulse" : "border-pink-200 text-pink-600"}
        `}
          >
            {minutes}:{seconds}
          </div>
        </div>
      )}

      {/* Game area */}
      <div
        ref={areaRef}
        className="relative flex-1 z-10 touch-none cursor-none"
        onPointerMove={handlePointerMove}
      >
        {items.map((item) => (
          <div
            key={item.uid}
            className={`absolute transition-opacity duration-200 ${item.caught ? "opacity-0" : "opacity-100"}`}
            style={{
              left: `calc(${item.x}% - ${ITEM_SIZE / 2}px)`,
              top: item.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
            }}
          >
            <Image
              src={item.snack.image}
              alt="item"
              width={ITEM_SIZE}
              height={ITEM_SIZE}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-5 transition-none"
          style={{
            left: `calc(${basketX}% - ${BASKET_WIDTH / 2}px)`,
            width: BASKET_WIDTH,
            height: BASKET_HEIGHT,
          }}
        >
          <Image
            src="/img/snack-dash/basket.png"
            alt="basket"
            width={BASKET_WIDTH}
            height={BASKET_HEIGHT}
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        <ScoreModal
          open={gameOver}
          chapterNumber={5}
          result={gameResult}
          onClose={() => {}}
          onRetry={handleRestart}
          onNext={() => router.push("/chapters/chapter-6")}
          closable={false}
        />
      </div>
    </div>
  );
}

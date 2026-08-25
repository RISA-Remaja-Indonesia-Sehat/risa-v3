"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  House,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { game_7 } from "../../data-local/game";

const GRID_SIZE = 10;
const MAX_HINTS_PER_WORD = 2;

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(""),
  );
}

/*
 * Math.random dipisahkan dari component React.
 */
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

type WordResult = {
  userAnswer: string;
  isCorrect: boolean;
};

export default function Chapter7TtsGamePage() {
  const [userGrid, setUserGrid] = useState<string[][]>(
    createEmptyGrid,
  );

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [activeWordId, setActiveWordId] =
    useState<number | null>(null);

  const [hintCount, setHintCount] = useState<
    Record<number, number>
  >({});

  const [hintedCells, setHintedCells] = useState<Set<string>>(
    new Set(),
  );

  const [feedback, setFeedback] = useState("");

  const [isFinished, setIsFinished] = useState(false);

  const [score, setScore] = useState(0);

  const [wordResults, setWordResults] = useState<
    Record<number, WordResult>
  >({});

  const [showSubmitWarning, setShowSubmitWarning] =
    useState(false);

  /*
   * ========================================
   * VALID CELLS
   * ========================================
   */

  const validCells = useMemo(() => {
    const valid = new Set<string>();

    game_7.words.forEach((word) => {
      word.cells.forEach(([row, col]) => {
        valid.add(`${row}-${col}`);
      });
    });

    return valid;
  }, []);

  /*
   * Huruf jawaban asli untuk setiap kotak.
   * Digunakan SETELAH submit untuk menentukan
   * kotak benar / salah.
   */
  const solutionCells = useMemo(() => {
    const solutions = new Map<string, string>();

    game_7.words.forEach((word) => {
      word.cells.forEach(([row, col], index) => {
        solutions.set(
          `${row}-${col}`,
          word.answer[index],
        );
      });
    });

    return solutions;
  }, []);

  /*
   * Nomor kecil pada awal kata.
   */
  const clueNumbers = useMemo(() => {
    const numbers = new Map<string, number>();

    game_7.words.forEach((word) => {
      const [row, col] = word.cells[0];

      numbers.set(
        `${row}-${col}`,
        word.number,
      );
    });

    return numbers;
  }, []);

  const activeWord =
    game_7.words.find(
      (word) => word.id === activeWordId,
    ) ?? null;

  const acrossClues = game_7.words.filter((word) =>
    word.direction
      .toLowerCase()
      .includes("mendatar"),
  );

  const downClues = game_7.words.filter((word) =>
    word.direction
      .toLowerCase()
      .includes("menurun"),
  );

  /*
   * ========================================
   * MENGETIK HURUF
   * ========================================
   */

  const handleCellChange = (
    row: number,
    col: number,
    value: string,
  ) => {
    /*
     * Setelah submit, jawaban tidak boleh diubah.
     */
    if (isFinished) return;

    const letter = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "");

    if (letter.length > 1) return;

    /*
     * Huruf yang dibuka menggunakan hint
     * juga tidak boleh diubah.
     */
    if (hintedCells.has(`${row}-${col}`)) {
      return;
    }

    setUserGrid((prev) => {
      const newGrid = prev.map((currentRow) => [
        ...currentRow,
      ]);

      newGrid[row][col] = letter;

      return newGrid;
    });

    setFeedback("");
  };

  /*
   * ========================================
   * PILIH KOTAK
   * ========================================
   */

  const handleCellClick = (
    row: number,
    col: number,
  ) => {
    if (isFinished) return;

    setSelectedCell({
      row,
      col,
    });

    const matchedWords = game_7.words.filter(
      (word) =>
        word.cells.some(
          ([wordRow, wordCol]) =>
            wordRow === row &&
            wordCol === col,
        ),
    );

    if (matchedWords.length === 0) return;

    /*
     * Kalau kotak hanya milik satu kata.
     */
    if (matchedWords.length === 1) {
      setActiveWordId(
        matchedWords[0].id,
      );

      setFeedback("");

      return;
    }

    /*
     * Kalau kotak merupakan persilangan,
     * klik berulang akan berganti kata.
     */
    const currentIndex =
      matchedWords.findIndex(
        (word) =>
          word.id === activeWordId,
      );

    const nextWord =
      currentIndex === -1
        ? matchedWords[0]
        : matchedWords[
            (currentIndex + 1) %
              matchedWords.length
          ];

    setActiveWordId(nextWord.id);

    setFeedback("");
  };

  /*
   * ========================================
   * HINT
   * ========================================
   */

  const handleHint = () => {
    if (isFinished) return;

    if (!activeWord) {
      setFeedback(
        "Pilih salah satu pertanyaan atau kotak TTS dulu 💡",
      );

      return;
    }

    const usedHints =
      hintCount[activeWord.id] ?? 0;

    if (
      usedHints >= MAX_HINTS_PER_WORD
    ) {
      setFeedback(
        "Kamu sudah memakai 2 hint untuk kata ini ✨",
      );

      return;
    }

    /*
     * Cari kotak yang:
     * - belum berisi huruf yang benar
     * - belum pernah diberi hint
     */
    const availableCells =
      activeWord.cells
        .map(
          ([row, col], index) => ({
            row,
            col,
            index,
          }),
        )
        .filter(
          ({
            row,
            col,
            index,
          }) => {
            const correctLetter =
              activeWord.answer[index];

            const currentLetter =
              userGrid[row][col];

            const cellKey =
              `${row}-${col}`;

            return (
              currentLetter !==
                correctLetter &&
              !hintedCells.has(
                cellKey,
              )
            );
          },
        );

    if (
      availableCells.length === 0
    ) {
      setFeedback(
        "Semua huruf pada kata ini sudah benar ✨",
      );

      return;
    }

    const selectedHint =
      getRandomItem(
        availableCells,
      );

    const {
      row,
      col,
      index,
    } = selectedHint;

    const correctLetter =
      activeWord.answer[index];

    /*
     * Masukkan huruf benar.
     */
    setUserGrid((prev) => {
      const newGrid = prev.map(
        (currentRow) => [
          ...currentRow,
        ],
      );

      newGrid[row][col] =
        correctLetter;

      return newGrid;
    });

    /*
     * Tandai kotak sebagai hasil hint.
     */
    setHintedCells((prev) => {
      const next = new Set(prev);

      next.add(`${row}-${col}`);

      return next;
    });

    /*
     * Tambah penggunaan hint.
     */
    setHintCount((prev) => ({
      ...prev,

      [activeWord.id]:
        (prev[activeWord.id] ??
          0) + 1,
    }));

    setSelectedCell({
      row,
      col,
    });

    setFeedback(
      `Hint membuka huruf "${correctLetter}" 💡`,
    );
  };

  /*
   * ========================================
   * HITUNG KOTAK KOSONG
   * ========================================
   */

  const getEmptyCellCount = () => {
    let count = 0;

    validCells.forEach(
      (cellKey) => {
        const [row, col] =
          cellKey
            .split("-")
            .map(Number);

        if (!userGrid[row][col]) {
          count += 1;
        }
      },
    );

    return count;
  };

  /*
   * ========================================
   * FINAL CHECK
   * ========================================
   */

  const finalizeSubmit = () => {
    let correct = 0;

    const results: Record<
      number,
      WordResult
    > = {};

    game_7.words.forEach(
      (word) => {
        /*
         * "_" digunakan agar pemain bisa melihat
         * posisi huruf yang belum diisi.
         */
        const displayAnswer =
          word.cells
            .map(
              ([row, col]) =>
                userGrid[row][col] ||
                "_",
            )
            .join("");

        const actualAnswer =
          word.cells
            .map(
              ([row, col]) =>
                userGrid[row][col] ||
                "",
            )
            .join("")
            .toUpperCase();

        const isCorrect =
          actualAnswer ===
          word.answer.toUpperCase();

        if (isCorrect) {
          correct += 1;
        }

        results[word.id] = {
          userAnswer:
            displayAnswer,
          isCorrect,
        };
      },
    );

    setWordResults(results);

    setScore(correct);

    setIsFinished(true);

    setShowSubmitWarning(false);

    setSelectedCell(null);

    setActiveWordId(null);

    if (
      correct ===
      game_7.words.length
    ) {
      setFeedback(
        "Semua jawaban benar! Hebat ✨",
      );
    } else {
      setFeedback(
        `${correct} dari ${game_7.words.length} jawaban benar. Yuk, lihat pembahasannya di samping / bawah.`,
      );
    }
  };

  /*
   * ========================================
   * TOMBOL CEK JAWABAN
   * ========================================
   */

  const handleSubmit = () => {
    if (isFinished) return;

    const emptyCells =
      getEmptyCellCount();

    /*
     * Kalau ada kotak kosong,
     * jangan langsung submit.
     */
    if (emptyCells > 0) {
      setShowSubmitWarning(
        true,
      );

      return;
    }

    finalizeSubmit();
  };

  /*
   * ========================================
   * COBA LAGI
   * ========================================
   */

  const handleRetry = () => {
    setUserGrid(
      createEmptyGrid(),
    );

    setSelectedCell(null);

    setActiveWordId(null);

    setHintCount({});

    setHintedCells(
      new Set(),
    );

    setFeedback("");

    setIsFinished(false);

    setScore(0);

    setWordResults({});

    setShowSubmitWarning(
      false,
    );
  };

  /*
   * ========================================
   * RENDER CLUE
   * ========================================
   */

  const renderClue = (
    word: (typeof game_7.words)[number],
    type: "across" | "down",
  ) => {
    const isActive =
      activeWordId === word.id;

    const result =
      wordResults[word.id];

    const activeStyle =
      type === "across"
        ? "bg-pink-50 ring-1 ring-pink-200"
        : "bg-sky-50 ring-1 ring-sky-200";

    const numberColor =
      type === "across"
        ? "text-pink-600"
        : "text-sky-600";

    return (
      <button
        key={word.id}
        type="button"
        disabled={isFinished}
        onClick={() => {
          if (isFinished) return;

          setActiveWordId(
            word.id,
          );

          const [row, col] =
            word.cells[0];

          setSelectedCell({
            row,
            col,
          });

          setFeedback("");
        }}
        className={[
          "w-full rounded-xl p-2 text-left text-sm transition",

          !isFinished
            ? "hover:bg-slate-50"
            : "cursor-default",

          isActive &&
          !isFinished
            ? activeStyle
            : "",

          isFinished &&
          result?.isCorrect
            ? "bg-emerald-50"
            : "",

          isFinished &&
          result &&
          !result.isCorrect
            ? "bg-rose-50"
            : "",
        ].join(" ")}
      >
        <div>
          <span
            className={`font-bold ${numberColor}`}
          >
            {word.number}.{" "}
          </span>

          <span className="text-slate-600">
            {word.clue}
          </span>
        </div>

        {/* HASIL SETELAH SUBMIT */}
        {isFinished && result && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            {result.isCorrect ? (
              <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />

                Benar
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-rose-600">
                  <XCircle className="h-4 w-4" />

                  Belum tepat
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Jawabanmu:
                </p>

                <p className="font-bold tracking-wider text-rose-600">
                  {result.userAnswer}
                </p>
              </div>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Jawaban benar
            </p>

            <p className="font-bold tracking-wider text-slate-700">
              {word.answer}
            </p>

            <div className="mt-3 rounded-lg bg-white/70 p-2.5 text-xs leading-5 text-slate-600">
              {word.explanation}
            </div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 px-3 py-6 text-slate-700 md:px-4">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-3 py-2 text-sm font-medium text-pink-600 shadow-sm transition hover:bg-pink-50"
          >
            <House className="h-4 w-4" />

            Home
          </Link>

          <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-sky-700 uppercase">
            TTS IMS
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-500 uppercase">
            Challenge
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-700 md:text-3xl">
            Teka-Teki Silang
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Isi kotak dengan jawaban yang tepat!
          </p>
        </div>

        {/* HASIL UTAMA */}
        {isFinished && (
          <div
            className={[
              "mx-auto mb-6 max-w-xl rounded-2xl border p-4 text-center",

              score ===
              game_7.words.length
                ? "border-emerald-200 bg-emerald-50"
                : "border-yellow-200 bg-yellow-50",
            ].join(" ")}
          >
            {score ===
              game_7.words.length && (
              <CheckCircle2 className="mx-auto mb-2 h-9 w-9 text-emerald-500" />
            )}

            <p className="text-lg font-bold text-slate-700">
              {score}/
              {game_7.words.length}{" "}
              jawaban benar
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {score ===
              game_7.words.length
                ? "Hebat! Semua jawabanmu tepat ✨"
                : "Lihat jawaban dan penjelasannya di samping."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

          {/* ================= GRID ================= */}

          <div className="mx-auto lg:col-span-2">
            <div className="overflow-x-auto rounded-3xl border-2 border-pink-200 bg-white p-4 shadow-lg md:p-6">
              <div className="inline-block overflow-hidden border-2 border-slate-300">

                {userGrid.map(
                  (
                    row,
                    rowIndex,
                  ) => (
                    <div
                      key={
                        rowIndex
                      }
                      className="flex"
                    >
                      {row.map(
                        (
                          cell,
                          colIndex,
                        ) => {
                          const cellKey =
                            `${rowIndex}-${colIndex}`;

                          const isValid =
                            validCells.has(
                              cellKey,
                            );

                          const clueNumber =
                            clueNumbers.get(
                              cellKey,
                            );

                          const isSelected =
                            selectedCell?.row ===
                              rowIndex &&
                            selectedCell?.col ===
                              colIndex;

                          const isHinted =
                            hintedCells.has(
                              cellKey,
                            );

                          const isActiveCell =
                            activeWord?.cells.some(
                              ([
                                wordRow,
                                wordCol,
                              ]) =>
                                wordRow ===
                                  rowIndex &&
                                wordCol ===
                                  colIndex,
                            );

                          const correctLetter =
                            solutionCells.get(
                              cellKey,
                            );

                          const isCorrectCell =
                            isFinished &&
                            isValid &&
                            cell ===
                              correctLetter;

                          const isWrongCell =
                            isFinished &&
                            isValid &&
                            cell !==
                              correctLetter;

                          return (
                            <div
                              key={
                                cellKey
                              }
                              className="relative"
                            >
                              <input
                                type="text"
                                maxLength={
                                  1
                                }
                                value={
                                  cell
                                }
                                disabled={
                                  !isValid ||
                                  isFinished
                                }
                                readOnly={
                                  isHinted
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleCellChange(
                                    rowIndex,
                                    colIndex,
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                onClick={() =>
                                  isValid &&
                                  handleCellClick(
                                    rowIndex,
                                    colIndex,
                                  )
                                }
                                className={[
                                  "h-9 w-9 border border-slate-300 text-center text-sm font-bold uppercase outline-none transition disabled:opacity-100 md:h-11 md:w-11",

                                  !isValid
                                    ? "cursor-default bg-slate-200"
                                    : "bg-white text-slate-700",

                                  isActiveCell &&
                                  !isFinished
                                    ? "bg-pink-50"
                                    : "",

                                  isSelected &&
                                  !isFinished
                                    ? "relative z-10 ring-2 ring-pink-400"
                                    : "",

                                  isHinted &&
                                  !isFinished
                                    ? "bg-amber-50 text-amber-600"
                                    : "",

                                  isCorrectCell
                                    ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                    : "",

                                  isWrongCell
                                    ? "border-rose-300 bg-rose-100 text-rose-700"
                                    : "",
                                ].join(
                                  " ",
                                )}
                              />

                              {clueNumber &&
                                isValid && (
                                  <span className="pointer-events-none absolute top-0.5 left-0.5 z-20 text-[8px] font-bold leading-none text-pink-500 md:text-[9px]">
                                    {
                                      clueNumber
                                    }
                                  </span>
                                )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* FEEDBACK */}
            {feedback && (
              <div className="mt-4 rounded-xl border border-pink-100 bg-white px-4 py-3 text-center text-sm text-slate-600 shadow-sm">
                {feedback}
              </div>
            )}

            {/* WARNING JIKA MASIH ADA KOTAK KOSONG */}
            {showSubmitWarning &&
              !isFinished && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-semibold text-amber-800">
                    Masih ada{" "}
                    {getEmptyCellCount()}{" "}
                    kotak yang belum diisi.
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    Kamu masih bisa
                    melengkapinya, atau tetap
                    cek jawaban sekarang.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowSubmitWarning(
                          false,
                        )
                      }
                      className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      Lanjut Isi
                    </button>

                    <button
                      type="button"
                      onClick={
                        finalizeSubmit
                      }
                      className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
                    >
                      Tetap Cek Jawaban
                    </button>
                  </div>
                </div>
              )}
          </div>

          {/* ================= SOAL ================= */}

          <div className="space-y-4">

            {/* MENDATAR */}
            <div className="rounded-2xl border-2 border-pink-200 bg-white p-4 shadow-md">
              <h2 className="mb-3 font-bold text-pink-600">
                Mendatar
              </h2>

              <div className="space-y-3">
                {acrossClues.map(
                  (word) =>
                    renderClue(
                      word,
                      "across",
                    ),
                )}
              </div>
            </div>

            {/* MENURUN */}
            <div className="rounded-2xl border-2 border-sky-200 bg-white p-4 shadow-md">
              <h2 className="mb-3 font-bold text-sky-600">
                Menurun
              </h2>

              <div className="space-y-3">
                {downClues.map(
                  (word) =>
                    renderClue(
                      word,
                      "down",
                    ),
                )}
              </div>
            </div>

            {/* HINT */}
            {!isFinished && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50/70 p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />

                  <p className="text-sm font-semibold text-slate-700">
                    Hint
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Pilih pertanyaan terlebih
                  dahulu. Kamu bisa membuka
                  maksimal 2 huruf untuk setiap
                  kata.
                </p>

                {activeWord && (
                  <p className="mt-2 text-xs font-medium text-amber-600">
                    Kata{" "}
                    {activeWord.number}:{" "}
                    {hintCount[
                      activeWord.id
                    ] ?? 0}
                    /
                    {
                      MAX_HINTS_PER_WORD
                    }{" "}
                    hint digunakan
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleHint}
                  disabled={
                    !activeWord ||
                    (activeWord &&
                      (hintCount[
                        activeWord.id
                      ] ?? 0) >=
                        MAX_HINTS_PER_WORD)
                  }
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Lightbulb className="h-4 w-4" />

                  Buka 1 Huruf
                </button>
              </div>
            )}

            {/* SUBMIT / RETRY */}

            {!isFinished ? (
              <button
                type="button"
                onClick={
                  handleSubmit
                }
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
              >
                Selesai & Cek Jawaban
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleRetry
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-pink-300 bg-white py-3 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
              >
                <RotateCcw className="h-4 w-4" />

                Coba Lagi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
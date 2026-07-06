"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import patients, {
  type ChatOption,
  type Patient,
} from "../../data-local/game-6";
import Link from "next/link";
import { House } from "lucide-react";

type Message = {
  id: number;
  sender: "patient" | "doctor";
  text: string;
};

type Phase =
  | "intro"
  | "patient-typing"
  | "waiting-choice"
  | "feedback"
  | "patient-closing"
  | "result"
  | "final";

const DOCTOR_AVATAR = "/img/game-doctor/doctor.png";

function playSound(src: string, volume = 0.3) {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
}

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium text-zinc-600">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0" />
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  const [patientIndex, setPatientIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [turnIndex, setTurnIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgCounter, setMsgCounter] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [pendingPatientMsgs, setPendingPatientMsgs] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<ChatOption | null>(null);
  const [totalAccuracy, setTotalAccuracy] = useState(0);
  const [totalEmpathy, setTotalEmpathy] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [patientResults, setPatientResults] = useState<
    { accuracy: number; empathy: number }[]
  >([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const patient: Patient = patients[patientIndex];
  const isLastPatient = patientIndex === patients.length - 1;

  const addMessage = (
    sender: "patient" | "doctor",
    text: string,
    id?: number,
  ) => {
    const newId = id ?? Date.now() + Math.random();
    setMessages((prev) => [...prev, { id: newId, sender, text }]);
    setMsgCounter((c) => c + 1);
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  // Start intro
  useEffect(() => {
    if (phase === "intro") {
      setMessages([]);
      setTurnIndex(0);
      setTotalAccuracy(0);
      setTotalEmpathy(0);
      setTurnCount(0);
      const timer = setTimeout(() => {
        setShowTyping(true);
        setTimeout(() => {
          setShowTyping(false);
          addMessage("patient", patient.intro);
          playSound("/audio/bubblepop.mp3", 0.3);
          // Queue first turn messages
          const firstTurn = patient.turns[0];
          setPendingPatientMsgs(firstTurn.patientMessages);
          setPhase("patient-typing");
        }, 1500);
      }, 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, patientIndex]);

  // Process pending patient messages one by one
  useEffect(() => {
    if (phase !== "patient-typing" || pendingPatientMsgs.length === 0) return;
    setShowTyping(true);
    const timer = setTimeout(
      () => {
        setShowTyping(false);
        const [next, ...rest] = pendingPatientMsgs;
        addMessage("patient", next);
        playSound("/audio/bubblepop.mp3", 0.3);
        setPendingPatientMsgs(rest);
        if (rest.length === 0) {
          setPhase("waiting-choice");
        }
      },
      1200 + Math.random() * 600,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pendingPatientMsgs]);

  const handleChoice = (option: ChatOption) => {
    playSound("/audio/tick-sound.mp3", 0.5);
    addMessage("doctor", option.text);
    setSelectedOption(option);
    setTotalAccuracy((a) => a + option.accuracy);
    setTotalEmpathy((e) => e + option.empathy);
    setTurnCount((t) => t + 1);
    setPhase("feedback");
  };

  const handleNextTurn = () => {
    const nextTurnIndex = turnIndex + 1;
    if (nextTurnIndex < patient.turns.length) {
      setTurnIndex(nextTurnIndex);
      setSelectedOption(null);
      setPendingPatientMsgs(patient.turns[nextTurnIndex].patientMessages);
      setPhase("patient-typing");
    } else {
      // All turns done — show closing patient message
      setSelectedOption(null);
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        addMessage("patient", patient.closingPatient);
        playSound("/audio/bubblepop.mp3", 0.3);
        setPhase("patient-closing");
      }, 1400);
    }
  };

  const handleShowResult = () => {
    setPhase("result");
  };

  const handleNextPatient = () => {
    const avgAcc = Math.round(totalAccuracy / turnCount);
    const avgEmp = Math.round(totalEmpathy / turnCount);
    setPatientResults((prev) => [
      ...prev,
      { accuracy: avgAcc, empathy: avgEmp },
    ]);

    if (isLastPatient) {
      playSound("/audio/level-up.mp3", 0.5);
      setPhase("final");
    } else {
      playSound("/audio/level-up.mp3", 0.5);
      setPatientIndex((i) => i + 1);
      setPhase("intro");
    }
  };

  const avgAccuracy = turnCount > 0 ? Math.round(totalAccuracy / turnCount) : 0;
  const avgEmpathy = turnCount > 0 ? Math.round(totalEmpathy / turnCount) : 0;

  const getStars = (acc: number, emp: number) => {
    const avg = (acc + emp) / 2;
    if (avg >= 9) return 3;
    if (avg >= 6) return 2;
    return 1;
  };

  // ── FINAL SCREEN ──────────────────────────────────────────────────────────
  if (phase === "final") {
    const allResults = [...patientResults];
    const overallAcc = Math.round(
      allResults.reduce((s, r) => s + r.accuracy, 0) / allResults.length,
    );
    const overallEmp = Math.round(
      allResults.reduce((s, r) => s + r.empathy, 0) / allResults.length,
    );
    const stars = getStars(overallAcc, overallEmp);

    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center p-6 gap-8">
        <Link href="/" className="absolute top-4 left-4">
          <House className="w-6 h-6 text-pink-500 drop-shadow" />
        </Link>
        <div className="text-center space-y-2">
          <p className="text-4xl">
            {"⭐".repeat(stars)}
            {"☆".repeat(3 - stars)}
          </p>
          <h2 className="text-2xl font-bold text-zinc-800">
            Konsultasi Selesai!
          </h2>
          <p className="text-zinc-500 text-sm">
            Kamu telah menangani semua pasien
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {allResults.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={patients[i].avatar}
                  alt={patients[i].name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-zinc-800 text-sm">
                    {patients[i].name}, {patients[i].age} tahun
                  </p>
                  <p className="text-xs text-zinc-400">{patients[i].level}</p>
                </div>
                <span className="ml-auto text-lg">
                  {"⭐".repeat(getStars(r.accuracy, r.empathy))}
                </span>
              </div>
              <ScoreBar
                label="Akurasi Medis"
                value={r.accuracy}
                color="bg-sky-400"
              />
              <ScoreBar label="Empati" value={r.empathy} color="bg-rose-400" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-sm border border-zinc-100 space-y-3">
          <p className="font-semibold text-zinc-700 text-center">
            Skor Keseluruhan
          </p>
          <ScoreBar
            label="Akurasi Medis"
            value={overallAcc}
            color="bg-sky-400"
          />
          <ScoreBar label="Empati" value={overallEmp} color="bg-rose-400" />
        </div>

        <p className="text-center text-sm text-zinc-500 max-w-xs">
          {stars === 3
            ? "Luar biasa! Kamu dokter yang akurat sekaligus penuh empati 🌟"
            : stars === 2
              ? "Bagus! Terus tingkatkan empati dan akurasi medismu 💪"
              : "Terus belajar ya! Pasien butuh dokter yang hangat dan tepat 🌱"}
        </p>
      </div>
    );
  }

  // ── RESULT SCREEN ─────────────────────────────────────────────────────────
  if (phase === "result") {
    const stars = getStars(avgAccuracy, avgEmpathy);
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center p-6 gap-6">
        <div className="flex items-center gap-3">
          <Image
            src={patient.avatar}
            alt={patient.name}
            width={56}
            height={56}
            className="rounded-full object-cover border-2 border-white shadow"
          />
          <div>
            <p className="font-bold text-zinc-800">
              {patient.name}, {patient.age} tahun
            </p>
            <p className="text-sm text-zinc-500">Konsultasi selesai</p>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-5xl">
            {"⭐".repeat(stars)}
            {"☆".repeat(3 - stars)}
          </p>
          <p className="text-zinc-600 text-sm mt-2">
            {stars === 3
              ? "Penjelasanmu akurat dan pasien merasa tenang!"
              : stars === 2
                ? "Cukup baik! Coba tingkatkan empatimu."
                : "Terus berlatih ya!"}
          </p>
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 space-y-4">
          <ScoreBar
            label="Akurasi Medis"
            value={avgAccuracy}
            color="bg-sky-400"
          />
          <ScoreBar label="Empati" value={avgEmpathy} color="bg-rose-400" />
        </div>

        <button
          onClick={handleNextPatient}
          className="bg-rose-500 text-white font-semibold px-8 py-3 rounded-full shadow-md active:scale-95 transition-transform"
        >
          {isLastPatient ? "Lihat Hasil Akhir" : `Pasien Berikutnya →`}
        </button>
      </div>
    );
  }

  // ── CHAT SCREEN ───────────────────────────────────────────────────────────
  const currentTurn = patient.turns[turnIndex];

  return (
    <div className="flex flex-col h-screen bg-[#ece5dd] max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shrink-0 shadow">
        <Image
          src={patient.avatar}
          alt={patient.name}
          width={40}
          height={40}
          className="rounded-full object-cover border-2 border-white/30"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">
            {patient.name}, {patient.age} tahun
          </p>
          <p className="text-xs text-emerald-200 truncate">
            {phase === "patient-typing" || showTyping
              ? "sedang mengetik..."
              : "online"}
          </p>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-1.5 shrink-0">
          {patients.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === patientIndex ? "w-6 bg-white" : i < patientIndex ? "w-2 bg-emerald-300" : "w-2 bg-white/30"}`}
            />
          ))}
          <span className="text-xs text-white/70 ml-1">
            {patientIndex + 1}/{patients.length}
          </span>
        </div>
      </div>

      {/* Level badge */}
      <div className="bg-[#dcf8c6]/60 px-4 py-1.5 flex items-center justify-center gap-2 shrink-0">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            patient.levelColor === "emerald"
              ? "bg-emerald-100 text-emerald-700"
              : patient.levelColor === "amber"
                ? "bg-amber-100 text-amber-700"
                : "bg-rose-100 text-rose-700"
          }`}
        >
          Level {patient.level}
        </span>
        <span className="text-xs text-zinc-500">
          Pertanyaan {turnIndex + 1}/{patient.turns.length}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === "doctor" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.sender === "patient" && (
              <Image
                src={patient.avatar}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-cover shrink-0 mb-0.5"
              />
            )}
            {msg.sender === "doctor" && (
              <Image
                src={DOCTOR_AVATAR}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-cover shrink-0 mb-0.5"
              />
            )}
            <div
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === "doctor"
                  ? "bg-[#dcf8c6] rounded-br-sm text-zinc-800"
                  : "bg-white rounded-bl-sm text-zinc-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex items-end gap-2">
            <Image
              src={patient.avatar}
              alt=""
              width={28}
              height={28}
              className="rounded-full object-cover shrink-0"
            />
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback bubble */}
        {phase === "feedback" && selectedOption && (
          <div className="mx-2 mt-2 bg-white/90 border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex gap-3">
              <div className="space-y-1.5 flex-1">
                <ScoreBar
                  label="Akurasi Medis"
                  value={selectedOption.accuracy}
                  color="bg-sky-400"
                />
                <ScoreBar
                  label="Empati"
                  value={selectedOption.empathy}
                  color="bg-rose-400"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {selectedOption.feedback}
            </p>
            <button
              onClick={handleNextTurn}
              className="w-full bg-[#075e54] text-white text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-transform"
            >
              Lanjut →
            </button>
          </div>
        )}

        {/* Patient closing — show result button */}
        {phase === "patient-closing" && (
          <div className="flex justify-center mt-3">
            <button
              onClick={handleShowResult}
              className="bg-[#075e54] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow active:scale-95 transition-transform"
            >
              Lihat Hasil Konsultasi ⭐
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Choice area */}
      {phase === "waiting-choice" && (
        <div className="shrink-0 bg-white border-t border-zinc-200 px-3 py-3 space-y-2">
          <p className="text-xs text-zinc-400 text-center font-medium">
            Pilih jawabanmu sebagai dokter
          </p>
          {currentTurn.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleChoice(opt)}
              className="w-full text-left bg-[#dcf8c6] hover:bg-[#c8f0b0] active:scale-[0.98] transition-all rounded-2xl px-4 py-3 text-sm text-zinc-800 leading-relaxed shadow-sm border border-[#b8e8a0]"
            >
              💬 {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

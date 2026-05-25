const game_1 = {
  answer_A: "Tuba Falopi",
  answer_B: "Leher Rahim",
  answer_C: "Vagina",
  answer_D: "Ovarium",
  answer_E: "Vulva",
  answer_F: "Rahim",
};

const game_2: { id: number; text: string; isMyth: boolean }[] = [
  { id: 1, text: "Darah menstruasi adalah darah kotor", isMyth: true },
  { id: 2, text: "Darah menstruasi bisa berwarna merah cerah, coklat, atau kehitaman", isMyth: false },
  { id: 3, text: "Haid selalu datang tepat waktu", isMyth: true },
  { id: 4, text: "Wanita yang sedang haid dilarang berenang karena dapat mencemari kolam atau menghentikan siklus haid", isMyth: true },
  { id: 5, text: "Menstruasi adalah penyakit", isMyth: true },
];

export type GameItem = { id: number; label: string; image: string; isCorrect: boolean };

const game_3: GameItem[] = [
  { id: 1,  label: "Pad",               image: "/img/pad.png",               isCorrect: true  },
  { id: 2,  label: "Pants",             image: "/img/pants.png",             isCorrect: true  },
  { id: 3,  label: "Wet Wipes",        image: "/img/wet-wipes.png",        isCorrect: true  },
  { id: 4,  label: "Bottle",            image: "/img/bottle.png",            isCorrect: true  },
  { id: 5, label: "Lipstick",          image: "/img/lipstick.png",          isCorrect: false },
  { id: 6, label: "Comb",              image: "/img/comb.png",              isCorrect: false },
];

export type SimulationOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
};

export type SimulationScene = {
  id: number;
  scene: string;        // background image path
  character: string;    // idle character image path
  situation: string;    // narration text shown to user
  options: SimulationOption[];
};

const game_4: SimulationScene[] = [
  {
    id: 1,
    scene: "/img/game-simulation/bedroom.png",
    character: "/img/game-simulation/idle-1.png",
    situation: "Kamu menerima pesan tidak sopan dari seseorang di Instagram. Apa yang kamu lakukan?",
    options: [
      { id: "a", text: "Balas dengan marah supaya dia kapok",  isCorrect: false, feedback: "Membalas dengan marah hanya memperburuk situasi dan bisa menyebabkan konflik lebih besar." },
      { id: "b", text: "Abaikan saja tapi tetap follow dia",   isCorrect: false, feedback: "Mengabaikan tanpa tindakan membiarkan perilaku buruk terus berlanjut." },
      { id: "c", text: "Kirim balik pesan kasar",              isCorrect: false, feedback: "Membalas dengan kasar tidak menyelesaikan masalah dan bisa merugikan dirimu sendiri." },
      { id: "d", text: "Screenshot → lapor → blokir",         isCorrect: true,  feedback: "Tepat! Screenshot sebagai bukti, laporkan ke platform, lalu blokir agar kamu tetap aman." },
    ],
  },
  {
    id: 2,
    scene: "/img/game-simulation/school-hallway.png",
    character: "/img/game-simulation/idle-2.png",
    situation: "Seorang teman terus memaksa memeluk kamu, padahal kamu sudah bilang tidak nyaman. Apa yang kamu lakukan?",
    options: [
      { id: "a", text: "Diam saja supaya tidak dianggap lebay",  isCorrect: false, feedback: "Membalas dengan marah hanya memperburuk situasi dan bisa menyebabkan konflik lebih besar." },
      { id: "b", text: "Tertawa agar tidak canggung",   isCorrect: false, feedback: "Mengabaikan tanpa tindakan membiarkan perilaku buruk terus berlanjut." },
      { id: "c", text: "Tegas berkata, &quot;Aku tidak nyaman, tolong berhenti&quot;",              isCorrect: true, feedback: "Membalas dengan kasar tidak menyelesaikan masalah dan bisa merugikan dirimu sendiri." },
      { id: "d", text: "Membalas dengan mendorong keras",         isCorrect: false,  feedback: "Tepat! Screenshot sebagai bukti, laporkan ke platform, lalu blokir agar kamu tetap aman." },
    ],
  },
  {
    id: 3,
    scene: "/img/game-simulation/schoolyard.png",
    character: "/img/game-simulation/idle-3.png",
    situation: "Kamu mendengar temanmu menyebarkan cerita pribadimu tanpa izin. Apa yang kamu lakukan?",
    options: [
      { id: "a", text: "Balas menyebarkan rahasianya",  isCorrect: false, feedback: "Membalas dengan marah hanya memperburuk situasi dan bisa menyebabkan konflik lebih besar." },
      { id: "b", text: "Diam dan pura-pura tidak tahu",   isCorrect: false, feedback: "Mengabaikan tanpa tindakan membiarkan perilaku buruk terus berlanjut." },
      { id: "c", text: "Bicara langsung dan minta dia berhenti",              isCorrect: true, feedback: "Membalas dengan kasar tidak menyelesaikan masalah dan bisa merugikan dirimu sendiri." },
      { id: "d", text: "Putuskan semua pertemanan tanpa penjelasan",         isCorrect: false,  feedback: "Tepat! Screenshot sebagai bukti, laporkan ke platform, lalu blokir agar kamu tetap aman." },
    ],
  },
  {
    id: 4,
    scene: "/img/game-simulation/schoolyard.png",
    character: "/img/game-simulation/idle-4.png",
    situation: "Pacarmu melarang kamu berteman dengan orang lain dan mengecek HP-mu setiap hari. Apa yang kamu lakukan?",
    options: [
      { id: "a", text: "Menuruti supaya dia tidak marah",  isCorrect: false, feedback: "Membalas dengan marah hanya memperburuk situasi dan bisa menyebabkan konflik lebih besar." },
      { id: "b", text: "Menanggap itu tanda cinta",   isCorrect: false, feedback: "Mengabaikan tanpa tindakan membiarkan perilaku buruk terus berlanjut." },
      { id: "c", text: "Menjelaskan bahwa kamu berhak atas privasi",              isCorrect: true, feedback: "Membalas dengan kasar tidak menyelesaikan masalah dan bisa merugikan dirimu sendiri." },
      { id: "d", text: "Balas mengontrol dia juga",         isCorrect: false,  feedback: "Tepat! Screenshot sebagai bukti, laporkan ke platform, lalu blokir agar kamu tetap aman." },
    ],
  },
  {
    id: 5,
    scene: "/img/game-simulation/canteen.png",
    character: "/img/game-simulation/idle-5.png",
    situation: "Teman-temanmu mengejek kamu karena tidak mau ikut melakukan hal yang kamu anggap berisiko. Apa yang kamu lakukan?",
    options: [
      { id: "a", text: "Tetap pada keputusanmu dan cari teman yang menghargaimu",  isCorrect: true, feedback: "Membalas dengan marah hanya memperburuk situasi dan bisa menyebabkan konflik lebih besar." },
      { id: "b", text: "Ikut saja supaya tidak dikucilkan",   isCorrect: false, feedback: "Mengabaikan tanpa tindakan membiarkan perilaku buruk terus berlanjut." },
      { id: "c", text: "Marah dan membentak mereka",              isCorrect: false, feedback: "Membalas dengan kasar tidak menyelesaikan masalah dan bisa merugikan dirimu sendiri." },
      { id: "d", text: "Menyalahkan diri sendiri",         isCorrect: false,  feedback: "Tepat! Screenshot sebagai bukti, laporkan ke platform, lalu blokir agar kamu tetap aman." },
    ],
  },
  // tambahkan scene berikutnya di sini
];

export { game_1, game_2, game_3, game_4 };

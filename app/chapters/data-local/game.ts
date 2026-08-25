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
  {
    id: 2,
    text: "Darah menstruasi bisa berwarna merah cerah, coklat, atau kehitaman",
    isMyth: false,
  },
  { id: 3, text: "Haid selalu datang tepat waktu", isMyth: true },
  {
    id: 4,
    text: "Wanita yang sedang haid dilarang berenang karena dapat mencemari kolam atau menghentikan siklus haid",
    isMyth: true,
  },
  { id: 5, text: "Menstruasi adalah penyakit", isMyth: true },
];

export type GameItem = {
  id: number;
  label: string;
  image: string;
  isCorrect: boolean;
};

const game_3: GameItem[] = [
  { id: 1, label: "Pad", image: "/img/pad.png", isCorrect: true },
  { id: 2, label: "Pants", image: "/img/pants.png", isCorrect: true },
  { id: 3, label: "Wet Wipes", image: "/img/wet-wipes.png", isCorrect: true },
  { id: 4, label: "Bottle", image: "/img/bottle.png", isCorrect: true },
  { id: 5, label: "Lipstick", image: "/img/lipstick.png", isCorrect: false },
  { id: 6, label: "Comb", image: "/img/comb.png", isCorrect: false },
];

export type SimulationOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
};

export type SimulationScene = {
  id: number;
  scene: string; // background image path
  character: string; // idle character image path
  situation: string; // narration text shown to user
  options: SimulationOption[];
};

const game_4: SimulationScene[] = [
  {
    id: 1,
    scene: "/img/game-simulation/bedroom.png",
    character: "/img/game-simulation/idle-1.png",
    situation:
      "Seseorang mengirim DM tidak sopan dan bikin kamu nggak nyaman di Instagram. Apa yang kamu lakukan?",
    options: [
      {
        id: "a",
        text: "Balas dengan marah supaya dia jera",
        isCorrect: false,
        feedback:
          "Wajar kalau kamu kesal, tapi membalas dengan emosi bisa bikin situasi makin panjang dan melelahkan",
      },
      {
        id: "b",
        text: "Abaikan tapi tetap biarkan dia follow kamu",
        isCorrect: false,
        feedback:
          "Mengabaikan saja kadang belum cukup. Kalau perilakunya mengganggu, kamu berhak menjaga batas dan keamanan akunmu.",
      },
      {
        id: "c",
        text: "Upload chat-nya ke story biar dia malu",
        isCorrect: false,
        feedback:
          "Melampiaskan di media sosial bisa memicu drama baru dan membuat masalah makin besar.",
      },
      {
        id: "d",
        text: "Screenshot → laporkan → blokir akun",
        isCorrect: true,
        feedback:
          "Pilihan yang aman dan dewasa. Simpan bukti, laporkan perilakunya, lalu blokir agar kamu bisa merasa lebih tenang.",
      },
    ],
  },
  {
    id: 2,
    scene: "/img/game-simulation/school-hallway.png",
    character: "/img/game-simulation/idle-2.png",
    situation:
      "Seorang teman terus memeluk atau menyentuh kamu meski kamu sudah bilang nggak nyaman. Apa yang kamu lakukan?",
    options: [
      {
        id: "a",
        text: "Diam saja karena takut dianggap sensitif",
        isCorrect: false,
        feedback:
          "Perasaan nggak nyaman itu valid. Kamu nggak harus memaksakan diri demi menyenangkan orang lain.",
      },
      {
        id: "b",
        text: "Ketawa biar suasananya nggak awkward",
        isCorrect: false,
        feedback:
          "Kadang kita reflex menutupi rasa nggak nyaman dengan bercanda, tapi batas diri tetap penting.",
      },
      {
        id: "c",
        text: "Bilang tegas: “Aku nggak nyaman, tolong berhenti.”",
        isCorrect: true,
        feedback:
          "Bagus! Menyampaikan batas dengan jelas adalah bentuk menjaga diri dan menghargai perasaanmu sendiri.",
      },
      {
        id: "d",
        text: "Dorong dia dengan kasar",
        isCorrect: false,
        feedback:
          "Kamu boleh membela diri, tapi reaksi agresif bisa membuat situasi makin buruk.",
      },
    ],
  },
  {
    id: 3,
    scene: "/img/game-simulation/schoolyard.png",
    character: "/img/game-simulation/idle-3.png",
    situation:
      "Kamu tahu ada teman yang membocorkan cerita pribadimu ke grup chat tanpa izin. Apa yang kamu lakukan?",
    options: [
      {
        id: "a",
        text: "Balas bongkar rahasianya juga",
        isCorrect: false,
        feedback:
          "Balas dendam biasanya cuma bikin hubungan makin toxic dan drama makin panjang.",
      },
      {
        id: "b",
        text: "Pura-pura nggak tahu walau sebenarnya sakit hati",
        isCorrect: false,
        feedback:
          "Memendam semuanya sendiri bisa bikin kamu makin stres dan overthinking.",
      },
      {
        id: "c",
        text: "Ajak dia bicara baik-baik dan bilang kamu kecewa",
        isCorrect: true,
        feedback:
          "Komunikasi yang jujur membantu orang lain memahami batas privasi dan perasaanmu.",
      },
      {
        id: "d",
        text: "Langsung cut off tanpa penjelasan",
        isCorrect: false,
        feedback:
          "Menjauh boleh saja, tapi memberi penjelasan bisa membantu menyelesaikan masalah lebih sehat.",
      },
    ],
  },
  {
    id: 4,
    scene: "/img/game-simulation/schoolyard.png",
    character: "/img/game-simulation/idle-4.png",
    situation:
      "Pacarmu sering minta password HP, melarang kamu dekat dengan teman lain, dan marah kalau kamu telat balas chat. Apa yang kamu lakukan?",
    options: [
      {
        id: "a",
        text: "Nurutin saja supaya dia nggak ngambek",
        isCorrect: false,
        feedback:
          "Hubungan sehat nggak seharusnya bikin kamu kehilangan privasi atau merasa takut setiap saat.",
      },
      {
        id: "b",
        text: "Menganggap itu bukti dia sayang banget",
        isCorrect: false,
        feedback:
          "Rasa posesif sering terlihat seperti perhatian, padahal bisa menjadi tanda hubungan yang tidak sehat.",
      },
      {
        id: "c",
        text: "Jelaskan bahwa kamu tetap berhak punya privasi dan pertemanan",
        isCorrect: true,
        feedback:
          "Bagus! Hubungan yang sehat dibangun dengan rasa percaya, bukan kontrol.",
      },
      {
        id: "d",
        text: "Balas cek HP dan mengontrol dia juga",
        isCorrect: false,
        feedback:
          "Membalas dengan perilaku yang sama hanya membuat hubungan makin toxic dan melelahkan.",
      },
    ],
  },
  {
    id: 5,
    scene: "/img/game-simulation/canteen.png",
    character: "/img/game-simulation/idle-5.png",
    situation:
      "Teman-temanmu mengejek kamu karena menolak ikut pesta malam yang menurutmu nggak aman. Apa yang kamu lakukan?",
    options: [
      {
        id: "a",
        text: "Tetap pada keputusanmu dan cari circle yang menghargai batasmu",
        isCorrect: true,
        feedback:
          "Keren! Kamu nggak harus mengikuti orang lain demi diterima. Teman yang baik akan menghargai keputusanmu.",
      },
      {
        id: "b",
        text: "Ikut saja biar nggak dibilang cupu",
        isCorrect: false,
        feedback:
          "Memaksakan diri demi validasi orang lain bisa membuatmu menyesal dan nggak nyaman.",
      },
      {
        id: "c",
        text: "Marah lalu membentak mereka di depan umum",
        isCorrect: false,
        feedback:
          "Kesal itu wajar, tapi meluapkan emosi secara agresif biasanya bikin suasana makin buruk.",
      },
      {
        id: "d",
        text: "Menyalahkan diri sendiri karena beda dari mereka",
        isCorrect: false,
        feedback:
          "Menjaga diri bukan hal yang salah. Kamu berhak menentukan apa yang membuatmu aman dan nyaman.",
      },
    ],
  },
];

export type SnackItem = { id: number; image: string; points: number };

const game_5: SnackItem[] = [
  { id: 1, image: "/img/snack-dash/spinach.png",    points:  5 },
  { id: 2, image: "/img/snack-dash/egg.png",        points:  5 },
  { id: 3, image: "/img/snack-dash/milk.png",       points:  5 },
  { id: 4, image: "/img/snack-dash/watermelon.png", points:  5 },
  { id: 5, image: "/img/snack-dash/almond.png",     points:  5 },
  { id: 6, image: "/img/snack-dash/fish.png",       points:  5 },
  { id: 7, image: "/img/snack-dash/noodle.png",     points: -10 },
  { id: 8, image: "/img/snack-dash/crackers.png",   points: -10 },
];

export type CrosswordCell = [number, number];

export type CrosswordWord = {
  id: number;
  number: number;
  answer: string;
  clue: string;
  explanation: string;
  direction: "Mendatar" | "Menurun";
  cells: CrosswordCell[];
};

export type CrosswordGameData = {
  title: string;
  challenge: string;
  words: CrosswordWord[];
};

const game_7: CrosswordGameData = {
  title: "TTS IMS",
  challenge: "Challenge: bisa selesai dalam 3 menit?",

  words: [
    {
      id: 1,
      number: 1,
      answer: "KEPUTIHAN",
      clue:
        "Salah satu tanda yang perlu diperhatikan adalah _____ yang warna, bau, atau jumlahnya tidak biasa.",
      explanation:
        "Keputihan yang warna, bau, atau jumlahnya berbeda dari biasanya termasuk salah satu tanda yang perlu diperhatikan.",
      direction: "Mendatar",
      cells: [
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
        [3, 8],
        [3, 9],
      ],
    },

    {
      id: 2,
      number: 2,
      answer: "HIV",
      clue:
        "Virus apa yang menyerang sistem kekebalan tubuh?",
      explanation:
        "HIV adalah virus yang menyerang sistem kekebalan tubuh, yaitu bagian tubuh yang membantu melindungi kita dari penyakit.",
      direction: "Mendatar",
      cells: [
        [7, 0],
        [7, 1],
        [7, 2],
      ],
    },

    {
      id: 3,
      number: 3,
      answer: "BAKTERI",
      clue:
        "Selain virus, penyebab IMS yang disebutkan dalam materi adalah apa?",
      explanation:
        "Selain virus, beberapa Infeksi Menular Seksual juga dapat disebabkan oleh bakteri.",
      direction: "Menurun",
      cells: [
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
        [7, 1],
      ],
    },

    {
      id: 4,
      number: 4,
      answer: "HPV",
      clue:
        "Virus apa yang beberapa jenisnya dapat menyebabkan kutil atau kanker serviks?",
      explanation:
        "HPV adalah virus yang sangat umum. Beberapa jenis HPV dapat menyebabkan kutil atau penyakit serius seperti kanker serviks.",
      direction: "Menurun",
      cells: [
        [2, 3],
        [3, 3],
        [4, 3],
      ],
    },

    {
      id: 5,
      number: 5,
      answer: "STIGMA",
      clue:
        "Sikap negatif atau menghakimi seseorang karena kondisi kesehatannya disebut apa?",
      explanation:
        "Stigma adalah sikap negatif atau menghakimi seseorang karena kondisi kesehatannya. Stigma bisa membuat seseorang takut mencari bantuan.",
      direction: "Menurun",
      cells: [
        [1, 6],
        [2, 6],
        [3, 6],
        [4, 6],
        [5, 6],
        [6, 6],
      ],
    },
  ],
};

export { game_1, game_2, game_3, game_4, game_5, game_7 };

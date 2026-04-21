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
  // { id: 3,  label: "Dry Tissue",        image: "/img/dry-tissue.png",        isCorrect: true  },
  // { id: 4,  label: "Hand Sanitizer",    image: "/img/hand-sanitizer.png",    isCorrect: true  },
  // { id: 5,  label: "Wet Wipes",         image: "/img/wet-wipes.png",         isCorrect: true  },
  // { id: 6,  label: "Pain Relief Patch", image: "/img/pain-relief-patch.png", isCorrect: true  },
  // { id: 7,  label: "Bottle",            image: "/img/bottle.png",            isCorrect: true  },
  { id: 8,  label: "Plastic Bag",       image: "/img/plastic-bag.png",       isCorrect: true  },
  { id: 9,  label: "Snack Bar",         image: "/img/snack-bar.png",         isCorrect: true  },
  { id: 10, label: "Lipstick",          image: "/img/lipstick.png",          isCorrect: false },
  { id: 11, label: "Comb",              image: "/img/comb.png",              isCorrect: false },
  // { id: 12, label: "Teddy Bear",        image: "/img/teddy-bear.png",        isCorrect: false },
  // { id: 13, label: "Powerbank",         image: "/img/powerbank.png",         isCorrect: false },
  // { id: 14, label: "Toothbrush",        image: "/img/toothbrush.png",        isCorrect: false },
  // { id: 15, label: "Spoon",             image: "/img/spoon.png",             isCorrect: false },
];

export { game_1, game_2, game_3 };

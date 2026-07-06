export type ChatOption = {
  id: string;
  text: string;
  accuracy: number; // 0-10
  empathy: number;  // 0-10
  feedback: string;
};

export type ChatTurn = {
  patientMessages: string[]; // sequential patient messages before player responds
  options: ChatOption[];
};

export type Patient = {
  id: number;
  name: string;
  age: number;
  avatar: string; // image path
  level: "Mudah" | "Menengah" | "Lanjut";
  levelColor: string;
  intro: string; // first message
  turns: ChatTurn[];
  closingPatient: string; // patient's final message after all turns
};

const patients: Patient[] = [
  {
    id: 1,
    name: "Sari",
    age: 13,
    avatar: "/img/game-doctor/13-teen.png",
    level: "Mudah",
    levelColor: "emerald",
    intro: "Halo Dok... aku Sari, umur 13 tahun. Aku mau tanya sesuatu boleh?",
    turns: [
      {
        patientMessages: [
          "Dok, aku dengar ada vaksin HPV di sekolah.",
          "Tapi aku nggak tau HPV itu apa. Apa itu berbahaya?",
        ],
        options: [
          {
            id: "a",
            text: "HPV itu virus yang bisa menyebabkan penyakit serius. Makanya perlu vaksin.",
            accuracy: 7,
            empathy: 4,
            feedback: "Jawabanmu benar, tapi terdengar sedikit menakutkan. Coba sampaikan dengan lebih menenangkan.",
          },
          {
            id: "b",
            text: "Wajar kalau kamu belum tahu, Sari. HPV adalah virus yang sangat umum. Beberapa jenisnya bisa berbahaya, tapi kabar baiknya bisa dicegah dengan vaksin.",
            accuracy: 10,
            empathy: 10,
            feedback: "Sempurna! Kamu memberi informasi yang benar sekaligus membuat Sari merasa tenang.",
          },
          {
            id: "c",
            text: "HPV itu singkatan dari Human Papillomavirus. Kamu harus vaksin.",
            accuracy: 6,
            empathy: 3,
            feedback: "Informasinya benar, tapi kurang empati. Sari butuh penjelasan yang lebih ramah.",
          },
        ],
      },
      {
        patientMessages: [
          "Oh gitu... terus kenapa harus vaksin sekarang, Dok?",
          "Aku kan masih kecil, belum perlu kan?",
        ],
        options: [
          {
            id: "a",
            text: "Justru karena kamu masih muda, vaksin bekerja paling baik sekarang! Tubuhmu akan membentuk perlindungan yang lebih kuat di usia ini.",
            accuracy: 10,
            empathy: 10,
            feedback: "Bagus sekali! Kamu menjelaskan alasan ilmiah dengan cara yang positif dan memotivasi.",
          },
          {
            id: "b",
            text: "Vaksin HPV diberikan usia 9-14 tahun. Kamu harus vaksin sekarang.",
            accuracy: 8,
            empathy: 4,
            feedback: "Faktanya benar, tapi terdengar seperti perintah. Coba jelaskan alasannya dengan lebih hangat.",
          },
          {
            id: "c",
            text: "Nanti juga bisa kok, nggak harus sekarang.",
            accuracy: 2,
            empathy: 5,
            feedback: "Ini kurang tepat. Vaksin justru paling efektif diberikan di usia remaja awal.",
          },
        ],
      },
      {
        patientMessages: [
          "Oke Dok, aku ngerti sekarang.",
          "Makasih ya udah jelasin dengan sabar 😊",
        ],
        options: [
          {
            id: "a",
            text: "Sama-sama Sari! Kalau ada pertanyaan lagi, jangan ragu ya. Kamu sudah berani bertanya, itu hal yang bagus!",
            accuracy: 10,
            empathy: 10,
            feedback: "Penutup yang hangat dan mendukung. Sari pasti merasa dihargai.",
          },
          {
            id: "b",
            text: "Iya, sama-sama.",
            accuracy: 7,
            empathy: 4,
            feedback: "Sopan, tapi bisa lebih hangat dan mendukung keberanian Sari bertanya.",
          },
          {
            id: "c",
            text: "Oke. Jangan lupa vaksin ya.",
            accuracy: 7,
            empathy: 3,
            feedback: "Pesannya benar, tapi kurang hangat sebagai penutup konsultasi.",
          },
        ],
      },
    ],
    closingPatient: "Wah seneng banget bisa konsultasi sama dokter yang baik! Aku jadi nggak takut lagi 😊",
  },
  {
    id: 2,
    name: "Dinda",
    age: 16,
    avatar: "/img/game-doctor/16-teen.png",
    level: "Menengah",
    levelColor: "amber",
    intro: "Dok, aku Dinda umur 16 tahun. Aku mau tanya soal vaksin HPV yang katanya wajib di sekolah.",
    turns: [
      {
        patientMessages: [
          "Teman-temanku bilang vaksin HPV bisa bikin mandul.",
          "Itu beneran Dok? Aku jadi takut...",
        ],
        options: [
          {
            id: "a",
            text: "Tidak benar. Vaksin HPV tidak menyebabkan kemandulan.",
            accuracy: 8,
            empathy: 3,
            feedback: "Faktanya benar, tapi terdengar dingin. Sari butuh empati dulu sebelum fakta.",
          },
          {
            id: "b",
            text: "Aku mengerti kenapa kamu khawatir, Dinda. Tapi sampai sekarang tidak ada bukti ilmiah bahwa vaksin HPV menyebabkan kemandulan. Ini adalah hoaks yang sudah banyak dibantah oleh dokter.",
            accuracy: 10,
            empathy: 10,
            feedback: "Sempurna! Kamu menunjukkan empati dulu, lalu memberikan fakta yang meyakinkan.",
          },
          {
            id: "c",
            text: "Teman-temanmu salah. Vaksin itu aman.",
            accuracy: 7,
            empathy: 2,
            feedback: "Faktanya benar, tapi cara menyampaikannya bisa membuat Dinda merasa diremehkan.",
          },
        ],
      },
      {
        patientMessages: [
          "Oh iya ya... terus efek sampingnya gimana Dok?",
          "Aku pernah dengar ada yang pingsan setelah vaksin.",
        ],
        options: [
          {
            id: "a",
            text: "Efek samping yang umum hanya nyeri di area suntikan, kemerahan ringan, dan sedikit lelah. Biasanya hilang dalam 1-2 hari. Pingsan setelah vaksin bisa terjadi karena gugup, bukan karena vaksinnya berbahaya.",
            accuracy: 10,
            empathy: 9,
            feedback: "Jawaban yang lengkap dan menenangkan! Kamu menjelaskan efek samping dengan jujur tapi tidak menakutkan.",
          },
          {
            id: "b",
            text: "Vaksin HPV sangat aman, tidak ada efek samping serius.",
            accuracy: 5,
            empathy: 5,
            feedback: "Kurang tepat. Efek samping ringan memang ada dan perlu dijelaskan dengan jujur agar pasien tidak kaget.",
          },
          {
            id: "c",
            text: "Wajar kalau kamu khawatir. Efek sampingnya ringan kok, seperti nyeri di bekas suntikan. Itu tanda tubuh sedang membangun perlindungan.",
            accuracy: 9,
            empathy: 10,
            feedback: "Bagus! Kamu mengubah efek samping menjadi sesuatu yang positif dan mudah dipahami.",
          },
        ],
      },
      {
        patientMessages: [
          "Kalau aku belum pernah pacaran, masih perlu vaksin nggak Dok?",
        ],
        options: [
          {
            id: "a",
            text: "Justru itu waktu terbaik! Vaksin HPV bekerja paling efektif sebelum seseorang terpapar virus. Jadi semakin awal, semakin baik perlindungannya.",
            accuracy: 10,
            empathy: 10,
            feedback: "Jawaban yang tepat dan memotivasi! Kamu menjelaskan logika vaksin preventif dengan sangat baik.",
          },
          {
            id: "b",
            text: "Tetap perlu. Vaksin bukan hanya untuk yang sudah aktif secara seksual.",
            accuracy: 9,
            empathy: 5,
            feedback: "Benar, tapi bisa lebih dijelaskan alasannya agar Dinda benar-benar paham.",
          },
          {
            id: "c",
            text: "Kalau belum pernah pacaran mungkin belum terlalu perlu.",
            accuracy: 1,
            empathy: 4,
            feedback: "Ini tidak tepat. Vaksin justru paling efektif diberikan sebelum terpapar virus.",
          },
        ],
      },
    ],
    closingPatient: "Wah aku jadi lebih tenang sekarang Dok. Ternyata banyak info yang salah ya. Makasih banyak! 🙏",
  },
  {
    id: 3,
    name: "Rara",
    age: 19,
    avatar: "/img/game-doctor/19-teen.png",
    level: "Lanjut",
    levelColor: "rose",
    intro: "Halo Dok, aku Rara, 19 tahun. Aku mau konsultasi soal vaksin HPV. Aku belum pernah vaksin sama sekali.",
    turns: [
      {
        patientMessages: [
          "Dok, aku udah 19 tahun. Masih bisa vaksin HPV nggak?",
          "Apa nggak terlambat?",
        ],
        options: [
          {
            id: "a",
            text: "Masih bisa, Rara! Vaksin HPV bisa diberikan hingga usia 26 tahun. Di usiamu, kamu akan mendapat 3 dosis dengan jadwal 0, 1-2 bulan, dan 6 bulan.",
            accuracy: 10,
            empathy: 9,
            feedback: "Jawaban yang informatif dan meyakinkan! Kamu memberikan detail jadwal yang tepat.",
          },
          {
            id: "b",
            text: "Masih bisa kok. Tapi lebih efektif kalau dari usia 9-14 tahun.",
            accuracy: 7,
            empathy: 5,
            feedback: "Faktanya benar, tapi menyebut 'lebih efektif dari usia lebih muda' bisa membuat Rara merasa menyesal. Fokus pada apa yang bisa dilakukan sekarang.",
          },
          {
            id: "c",
            text: "Sudah agak terlambat, tapi masih bisa dicoba.",
            accuracy: 4,
            empathy: 2,
            feedback: "Kata 'terlambat' tidak tepat dan bisa membuat pasien tidak mau vaksin. Vaksin di usia 19 tetap sangat bermanfaat.",
          },
        ],
      },
      {
        patientMessages: [
          "Aku sudah pernah aktif secara seksual Dok.",
          "Apakah vaksin masih ada manfaatnya buat aku?",
        ],
        options: [
          {
            id: "a",
            text: "Terima kasih sudah jujur, Rara. Vaksin tetap bermanfaat karena ada banyak jenis HPV. Meski mungkin sudah terpapar satu jenis, vaksin masih melindungi dari jenis-jenis lain yang belum kamu temui.",
            accuracy: 10,
            empathy: 10,
            feedback: "Luar biasa! Kamu menghargai kejujuran pasien dan memberikan penjelasan ilmiah yang akurat dan menenangkan.",
          },
          {
            id: "b",
            text: "Kalau sudah aktif, efektivitasnya berkurang. Tapi tetap dianjurkan.",
            accuracy: 6,
            empathy: 4,
            feedback: "Kurang tepat dan bisa membuat pasien ragu. Vaksin tetap sangat bermanfaat meski sudah aktif secara seksual.",
          },
          {
            id: "c",
            text: "Tetap ada manfaatnya. Vaksin melindungi dari beberapa jenis HPV sekaligus.",
            accuracy: 9,
            empathy: 6,
            feedback: "Benar, tapi bisa lebih hangat dan menghargai keberanian Rara untuk jujur.",
          },
        ],
      },
      {
        patientMessages: [
          "Oke Dok, aku mau vaksin. Di mana aku bisa mendapatkannya?",
        ],
        options: [
          {
            id: "a",
            text: "Kamu bisa mendapatkan vaksin HPV di Puskesmas, klinik, atau rumah sakit terdekat. Untuk usia 9-14 tahun biasanya gratis melalui program pemerintah. Di usiamu, bisa konsultasi dulu dengan dokter di fasilitas kesehatan.",
            accuracy: 10,
            empathy: 9,
            feedback: "Jawaban yang sangat lengkap dan praktis! Rara tahu persis langkah selanjutnya.",
          },
          {
            id: "b",
            text: "Ke dokter atau klinik saja.",
            accuracy: 7,
            empathy: 5,
            feedback: "Benar tapi kurang detail. Pasien butuh informasi yang lebih spesifik untuk mengambil tindakan.",
          },
          {
            id: "c",
            text: "Beli sendiri di apotek dan suntik sendiri.",
            accuracy: 0,
            empathy: 2,
            feedback: "Ini sangat tidak tepat! Vaksin harus diberikan oleh tenaga kesehatan terlatih.",
          },
        ],
      },
    ],
    closingPatient: "Makasih banyak Dok! Aku jadi lebih paham dan nggak ragu lagi. Besok langsung ke Puskesmas deh! 💪",
  },
];

export default patients;

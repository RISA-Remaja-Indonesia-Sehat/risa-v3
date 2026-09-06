export type Chapter = {
  number: number;
  href: string;
  label: string;
  tagline: string;
  side: "left" | "right";
  top?: string;
  bottom?: string;
};

export const CHAPTERS = [
  {
    number: 7,
    href: "/chapters/chapter-7",
    label: "Chapter 7",
    tagline: "Uji Pemahaman",
    side: "right",
    top: "20%",
  },
  {
    number: 6,
    href: "/chapters/chapter-6",
    label: "Chapter 6",
    tagline: "Kenali IMS",
    side: "left",
    top: "30.5%",
  },
  {
    number: 5,
    href: "/chapters/chapter-5",
    label: "Chapter 5",
    tagline: "Gizi & Tubuh",
    side: "right",
    top: "41%",
  },
  {
    number: 4,
    href: "/chapters/chapter-4",
    label: "Chapter 4",
    tagline: "Batas yang Aman",
    side: "left",
    top: "51.5%",
  },
  {
    number: 3,
    href: "/chapters/chapter-3",
    label: "Chapter 3",
    tagline: "Jaga Kebersihan",
    side: "right",
    top: "59%",
  },
  {
    number: 2,
    href: "/chapters/chapter-2",
    label: "Chapter 2",
    tagline: "Menstruasi Sehat",
    side: "left",
    top: "69%",
  },
  {
    number: 1,
    href: "/chapters/chapter-1",
    label: "Chapter 1",
    tagline: "Kenali Tubuhmu",
    side: "right",
    bottom:
      "calc(clamp(80px, 10vw, 155px) + clamp(12px, 2vw, 28px))",
  },
] satisfies readonly Chapter[];
// lib/modules/types.ts

export type CalloutVariant =
  | "concept"
  | "remember"
  | "tip"
  | "warning"
  | "summary";

export type ListTone =
  | "pink"
  | "yellow"
  | "green"
  | "blue"
  | "neutral";

export type ModuleBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "subheading";
      text: string;
    }
  | {
      type: "list";
      items: string[];
      ordered?: boolean;
      tone?: ListTone;
    }
  | {
      type: "callout";
      variant: CalloutVariant;
      title: string;
      text?: string;
      items?: string[];
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "link";
      label: string;
      href: string;
      description?: string;
    };

export type ChapterModuleData = {
  id?: string;

  chapterNumber: number;

  title: string;
  objective: string;
  durationLabel: string;

  contentVersion: number;
  lastReviewedAt?: string | null;
};

export type ModuleCardData = {
  id: string;

  order: number;
  title: string;

  blocks: ModuleBlock[];
};
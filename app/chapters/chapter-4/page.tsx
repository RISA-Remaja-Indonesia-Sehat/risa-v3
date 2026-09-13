import { notFound } from "next/navigation";

import ChapterModulePage
  from "@/components/modules/ChapterModulePage";

import type {
  ChapterModuleData,
  ModuleCardData,
} from "@/lib/modules/types";

type LearningModuleResponse = {
  success: boolean;

  data: ChapterModuleData & {
    cards: ModuleCardData[];
  };
};

async function getLearningModule(
  chapterNumber: number
): Promise<LearningModuleResponse> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum diatur."
    );
  }

  const response = await fetch(
    `${API_URL}/api/modules/${chapterNumber}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil learning module."
    );
  }

  return response.json();
}

export default async function Page() {
  const response =
    await getLearningModule(4);

  const {
    cards,
    ...module
  } = response.data;

  return (
    <ChapterModulePage
      module={module}
      cards={cards}
    />
  );
}
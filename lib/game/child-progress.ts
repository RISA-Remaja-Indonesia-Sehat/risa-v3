const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL belum diatur."
  );
}

type CompleteChapterResponse = {
  success: boolean;

  data: {
    progress: {
      chapterNumber: number;
      score: number | null;
      completedAt: string | null;
    };
  };
};

export async function completeChildChapter(
  chapterNumber: number,
  score?: number
) {
  const response = await fetch(
    `${API_URL}/api/child/chapters/${chapterNumber}/complete`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        score !== undefined
          ? { score }
          : {}
      ),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Gagal menyimpan progres chapter."
    );
  }

  return result as CompleteChapterResponse;
}
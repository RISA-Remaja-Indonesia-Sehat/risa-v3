const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL belum diatur.",
  );
}

export class ChildApiError
  extends Error
{
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);

    this.name = "ChildApiError";
  }
}

export async function childApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",

        ...options.headers,
      },
    },
  );

  const data: unknown =
    await response
      .json()
      .catch(() => null);

  if (!response.ok) {
    const errorData =
      data as {
        message?: string;
      } | null;

    throw new ChildApiError(
      errorData?.message ??
        "Terjadi kesalahan.",
      response.status,
      data,
    );
  }

  return data as T;
}
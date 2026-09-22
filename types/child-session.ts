export type Child = {
  id: string;
  username: string;
  avatarId: string;
};

export type ChildSessionData = {
  child: Child;
  completedChapters: number[];
  postTestCompleted: boolean;
};

export type ChildMeResponse = {
  success: true;
  data: ChildSessionData;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isChildMeResponse(
  value: unknown,
): value is ChildMeResponse {
  if (!isRecord(value) || value.success !== true) {
    return false;
  }

  if (!isRecord(value.data)) {
    return false;
  }

  const {
    child,
    completedChapters,
    postTestCompleted,
  } = value.data;

  if (!isRecord(child)) {
    return false;
  }

  return (
    typeof child.id === "string" &&
    typeof child.username === "string" &&
    typeof child.avatarId === "string" &&
    Array.isArray(completedChapters) &&
    completedChapters.every(Number.isInteger) &&
    typeof postTestCompleted === "boolean"
  );
}
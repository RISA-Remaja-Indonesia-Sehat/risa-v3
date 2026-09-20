import type { ReactNode } from "react";
import type { Metadata } from "next";

import LearningAccessGuard from "@/components/auth/LearningAccessGuard";

export const metadata: Metadata = {
  title: "Post Test",
};

export default function PostTestLayout({ children }: { children: ReactNode }) {
  return <LearningAccessGuard mode="post-test">{children}</LearningAccessGuard>;
}

import type {
  ReactNode,
} from "react";

import LearningAccessGuard
  from "@/components/auth/LearningAccessGuard";

export default function ChaptersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LearningAccessGuard mode="chapters">
      {children}
    </LearningAccessGuard>
  );
}
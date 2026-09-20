import type { Metadata } from "next";

import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Chapter 5",
};

export default function Chapter1Layout({ children }: { children: ReactNode }) {
  return children;
}

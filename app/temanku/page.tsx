import type { Metadata } from "next";

import TemankuContent from "./TemankuContent";

export const metadata: Metadata = {
  title: "Temanku",
  description:
    "Ruang aman untuk berbagi cerita, bertanya, dan saling mendukung bersama teman sebaya di RISA.",
};

export default function TemankuPage() {
  return <TemankuContent />;
}

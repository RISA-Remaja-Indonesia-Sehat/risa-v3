import ChapterModulePage from "@/components/modules/ChapterModulePage";

import { ModuleData } from "../data-local/module-intro";

import { moduleCards_7 } from "../data-local/module";

export default function Page() {
  const content = ModuleData.find((item) => item.chapterNumber === 7);

  if (!content) {
    return null;
  }

  return <ChapterModulePage module={content} cards={moduleCards_7} />;
}

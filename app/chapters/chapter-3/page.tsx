import ChapterModulePage
  from "@/components/modules/ChapterModulePage";

import {
  ModuleData,
} from "../data-local/module-intro";

import {
  moduleCards_3,
} from "../data-local/module";

export default function Page() {
  const content =
    ModuleData.find(
      (item) =>
        item.chapterNumber === 3
    );

if (!content) {
    return null;
  }

  return (
    <ChapterModulePage
      module={content}
      cards={moduleCards_3}
    />
  );
}
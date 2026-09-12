import ChapterModulePage
  from "@/components/modules/ChapterModulePage";

import {
  ModuleData,
} from "@/app/chapters/data-local/module-intro";

export default function Page() {
  return (
    <ChapterModulePage
      module={ModuleData[6]}
    />
  );
}
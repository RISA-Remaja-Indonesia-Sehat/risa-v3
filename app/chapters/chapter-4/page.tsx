import ChapterModulePage
  from "@/components/modules/ChapterModulePage";

import {
  moduleData_4,
} from "../data-local/module";

export default function Page() {
  return (
    <ChapterModulePage
      module={moduleData_4}
    />
  );
}
import ChapterModulePage
  from "@/components/modules/ChapterModulePage";

import {
  moduleData_5,
} from "../data-local/module";

export default function Page() {
  return (
    <ChapterModulePage
      module={moduleData_5}
    />
  );
}
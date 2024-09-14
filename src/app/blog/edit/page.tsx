import { Suspense } from "react";
import MarkdownEditor from "../components/Editor";
export default async function Page() {
  return (
    <Suspense>
      <MarkdownEditor />
    </Suspense>
  );
}

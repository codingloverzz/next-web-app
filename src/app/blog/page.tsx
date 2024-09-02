import { getBlogList } from "@/app/lib/data/blog";
import FileDetail from "./components/FileDetail";
import FileTree from "./components/FileTree";

export default async function page({
  searchParams,
}: {
  searchParams: {
    file: string;
  };
}) {
  const res = await getBlogList();
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-1/6 h-full  shrink-0">
        <FileTree treeData={res} />
      </div>
      <div className="h-full flex-1 overflow-hidden">
        <FileDetail filePath={searchParams.file} />
      </div>
    </div>
  );
}

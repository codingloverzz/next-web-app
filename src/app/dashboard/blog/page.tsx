import { getBlogList } from "@/app/lib/data/blog";
import FileDetail from "@/app/ui/blog/FileDetail";
import FileTree from "@/app/ui/blog/FileTree";

export default async function page({
  searchParams,
}: {
  searchParams: {
    file: string;
  };
}) {
  const res = await getBlogList();
  return (
    <div className="flex h-full">
      <div className="w-1/4 h-full  shrink-0">
        <FileTree treeData={res} />
      </div>
      <div className="h-full overflow-auto">
        <FileDetail filePath={searchParams.file} />
      </div>
    </div>
  );
}

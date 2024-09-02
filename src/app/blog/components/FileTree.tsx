"use client";

import { Tree, TreeDataNode } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileTree({ treeData }: { treeData: TreeDataNode[] }) {
  const [currentFile, setCurrentFile] = useState("");
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  return (
    <Tree.DirectoryTree
      blockNode
      rootStyle={{
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
      selectedKeys={[currentFile]}
      treeData={treeData}
      fieldNames={{
        title: "name",
        key: "path",
      }}
      onSelect={(select, info) => {
        if (!info.node.children?.length) {
          setCurrentFile(select[0] as string);
          const params = new URLSearchParams(searchParams);
          params.set("file", select[0] as string);
          router.replace(`${pathName}?${params.toString()}`);
        }
      }}
    ></Tree.DirectoryTree>
  );
}

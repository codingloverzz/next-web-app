"use client";

import { Tree, TreeDataNode } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BookOutlined, FolderOpenOutlined } from "@ant-design/icons";

const handleTreeData = (treeData: TreeDataNode[]): TreeDataNode[] => {
  return treeData.map((item) => {
    return {
      ...item,
      icon: item.children ? <FolderOpenOutlined /> : <BookOutlined />,
      children: handleTreeData(item.children || []),
    };
  });
};
export default function FileTree({ treeData }: { treeData: TreeDataNode[] }) {
  // const [currentFile, setCurrentFile] = useState("");
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const currentFile = searchParams.get("file") ?? "";
  if (treeData.length === 0) {
    return null;
  }

  const data = handleTreeData(treeData);
  return (
    <>
      {
        <Tree
          showIcon
          blockNode
          defaultExpandAll
          rootStyle={{
            height: "100%",
            width: "100%",
            overflow: "auto",
          }}
          selectedKeys={[currentFile]}
          treeData={data}
          fieldNames={{
            title: "name",
            key: "path",
          }}
          onSelect={(select, info) => {
            if (!info.node.children?.length) {
              const params = new URLSearchParams(searchParams);
              params.set("file", select[0] as string);
              router.replace(`${pathName}?${params.toString()}`);
            }
          }}
        ></Tree>
      }
    </>
  );
}

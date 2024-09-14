"use client";
import gfm from "@bytemd/plugin-gfm";
import frontMatter from "@bytemd/plugin-frontmatter";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const plugins = [
  gfm(),
  frontMatter(),
  highlight(),
  // Add more plugins here
];

const MarkdownEditor = () => {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();

  const currentFile = searchParams.get("file") ?? "";
  const router = useRouter();
  useEffect(() => {
    if (currentFile) {
      debugger;
      fetch("/api/blog?file=" + currentFile)
        .then((res) => res.text())
        .then((res) => {
          setValue(res);
        });
    }
  }, [currentFile]);

  const save = async () => {
    await fetch("/api/blog", {
      method: "post",
      body: JSON.stringify({
        content: value,
        path: currentFile,
      }),
    });
    message.success("save successfully");
    router.back();
  };
  const cancel = () => {
    router.back();
  };
  return (
    <div className="w-full h-screen editor">
      <div className="flex justify-end gap-2">
        <Button size="small" onClick={cancel}>
          cancel
        </Button>
        <Button type="primary" size="small" onClick={save}>
          save
        </Button>
      </div>
      <Editor
        value={value}
        plugins={plugins}
        onChange={(v) => {
          setValue(v);
        }}
      />
    </div>
  );
};
export default MarkdownEditor;

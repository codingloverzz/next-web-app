"use client";

import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Toc from "./Toc";
import { IToc } from "@/app/lib/types/Blog";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      const res = hljs.highlight(code, { language }).value;
      const res2 = res
        .split("\n")
        .map((s, i) => `<div class="code-line" data-line=${i + 1}>${s}</div>`)
        .join("");
      return res2;
    },
  })
);
const renderer = new marked.Renderer();
renderer.heading = function ({ depth, tokens }) {
  // 生成唯一的 ID
  const id = `heading-${Math.random().toString(36).substr(2, 9)}`;
  return `<h${depth} id=${id}>${tokens[0].raw}</h${depth}>`;
};
export default function FileDetail({ filePath }: { filePath: string }) {
  const mdRef = useRef<HTMLDivElement>(null);
  const [htmlText, setHtmlText] = useState<string | null>("");
  const [toc, setToc] = useState<IToc[]>([]);
  const [activeToc, setActiveToc] = useState<IToc>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (filePath) {
      fetch("/api/blog?file=" + filePath)
        .then((res) => {
          if (res.status === 404) {
            throw new Error("404~~");
          } else {
            return res.blob();
          }
        })
        .then((res) => {
          setError(null);
          const fileReader = new FileReader();
          fileReader.readAsText(res, "utf-8");
          fileReader.onload = (e) => {
            const result = e.target?.result;
            const markedStr = marked.parse(result as string, {
              renderer,
            }) as string;

            const regex = /<h([1-6]).* id=(.*)>(.*?)<\/h[1-6]>/g;
            const toc: any = [];
            let match;
            while ((match = regex.exec(markedStr)) !== null) {
              const level = match[1];
              const id = match[2];
              const title = match[3];
              toc.push({ level, title, id });
            }
            setToc(toc);
            setHtmlText(markedStr);
          };
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setHtmlText("");
    }
  }, [filePath]);
  useEffect(() => {
    console.log(mdRef.current, "看看呢");
  }, [htmlText]);
  const handleTocClick = (e: IToc) => {
    document.getElementById(e.id)?.scrollIntoView({
      behavior: "smooth",
    });
    setActiveToc(e);
  };
  return (
    <div className="p-2 h-full overflow-hidden">
      {error ? (
        <div>{error}</div>
      ) : (
        <div className="flex h-full">
          <div className="w-1/5 shrink-0 h-full overflow-auto">
            <Toc data={toc} onTocClick={handleTocClick} />
          </div>
          <div
            ref={mdRef}
            className="overflow-auto h-full"
            dangerouslySetInnerHTML={{ __html: htmlText! }}
          ></div>
        </div>
      )}
    </div>
  );
}

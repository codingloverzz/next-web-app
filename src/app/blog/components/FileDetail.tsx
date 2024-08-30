"use client";

import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Toc from "./Toc";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);
export default function FileDetail({ filePath }: { filePath: string }) {
  const [htmlText, setHtmlText] = useState<string | null>("");
  const [toc, setToc] = useState([]);
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
            if (!result || typeof result !== "string") return;
            const headings = result.match(/^(#{1,6})\s+(.*)$/gm);
            const toc: any = [];
            headings?.forEach((heading) => {
              const level = heading.match(/^#+/)?.[0].length;
              const title = heading.replace(/^#{1,6}\s+/, "");
              toc.push({ level, title });
            });
            setToc(toc);
            setHtmlText(marked.parse(e.target?.result as string) as any);
          };
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setHtmlText("");
    }
  }, [filePath]);

  console.log(toc, "看看toc");

  return (
    <div className="p-2">
      {error ? (
        <div>{error}</div>
      ) : (
        <div className="flex">
          <div className="w-1/5 shrink-0">
            <Toc data={toc} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: htmlText! }}></div>
        </div>
      )}
    </div>
  );
}

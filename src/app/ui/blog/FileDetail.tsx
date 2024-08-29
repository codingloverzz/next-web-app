"use client";

import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { useEffect, useState } from "react";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      console.log(code, language, "code", "language");

      return hljs.highlight(code, { language }).value;
    },
  })
);
export default function FileDetail({ filePath }: { filePath: string }) {
  const [htmlText, setHtmlText] = useState("");
  useEffect(() => {
    fetch("/api/blog?file=" + filePath)
      .then((res) => res.blob())
      .then((res) => {
        const fileReader = new FileReader();
        fileReader.readAsText(res, "utf-8");
        fileReader.onload = (e) => {
          setHtmlText(marked.parse(e.target?.result as string) as any);
        };
      });
  }, [filePath]);

  return <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>;
}

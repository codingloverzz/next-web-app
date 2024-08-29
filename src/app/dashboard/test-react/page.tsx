"use client";
import { useState, useDeferredValue, useEffect } from "react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { getBlogList } from "@/app/lib/data/blog";

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
export default function MyComponent() {
  const [htmlText, setHtmlText] = useState("");
  useEffect(() => {
    getBlogList()
      .then((res) => {
        console.log(res, "看看res呢");
      })
      .catch((err) => {
        console.log(err, "err");
      });
    // fetch("/api/blog")
    //   .then((res) => res.blob())
    //   .then((res) => {
    //     const fileReader = new FileReader();
    //     fileReader.readAsText(res, "utf-8");
    //     fileReader.onload = (e) => {
    //       setHtmlText(marked.parse(e.target?.result as string) as any);
    //     };
    //   });
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>;
}

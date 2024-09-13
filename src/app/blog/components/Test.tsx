"use client";
import gfm from "@bytemd/plugin-gfm";
import frontMatter from "@bytemd/plugin-frontmatter";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/react";
import { useState } from "react";

const plugins = [
  gfm(),
  frontMatter(),
  highlight(),
  // Add more plugins here
];

const App = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-full h-screen editor">
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
export default App;

"use client";
import { useState, useDeferredValue } from "react";

export default function MyComponent() {
  const [inputValue, setInputValue] = useState("");
  const deferredValue = useDeferredValue(inputValue);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <p>即时值: {inputValue}</p>
      <Items value={deferredValue}/>
    </div>
  );
}

function Items({value}:any){
    let start = performance.now();
  while (performance.now() - start < 1000) {}
  return <div>{value}</div>
}
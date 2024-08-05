"use client";

import { addTodo } from "@/app/lib/server-action/todos";
import { Input } from "antd";
import { useState } from "react";

export default function InputTodo() {
  const [value, setValue] = useState("");

  const handleAdd = async () => {
    await addTodo(value);
    setValue("");
  };
  return (
    <Input
      value={value}
      onPressEnter={handleAdd}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

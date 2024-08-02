"use client";
import { updateTodo } from "@/app/lib/server-action/todos";
import { sql } from "@vercel/postgres";
import { Checkbox, message } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

export default function TodoItem({ todo }: { todo: any }) {
  const handleChange = async (e: CheckboxChangeEvent) => {
    await updateTodo(todo.id, e.target.checked ? 2 : 1, todo.title);
    // message.success("success");
  };

  return (
    <div>
      <Checkbox onChange={handleChange} defaultChecked={todo.status === 2}>
        {todo.title}
      </Checkbox>
    </div>
  );
}

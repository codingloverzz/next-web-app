"use client";
import { deleteTodo, updateTodo } from "@/app/lib/server-action/todos";
import { DATE_TIME } from "@/constant/date";
import { sql } from "@vercel/postgres";
import { Checkbox, message, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import dayjs from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
export default function TodoItem({ todo }: { todo: any }) {
  const handleChange = async (e: CheckboxChangeEvent) => {
    await updateTodo(todo.id, e.target.checked ? 2 : 1, todo.title);
    // message.success("success");
  };
  const handleDelete = async () => {
    await deleteTodo(todo.id);
    message.success("delete success");
  };
  return (
    <div className="flex items-center mt-2">
      <Checkbox onChange={handleChange} defaultChecked={todo.status === 2}>
        <Typography.Text delete={todo.status === 2}>
          {" "}
          {todo.title}
        </Typography.Text>
      </Checkbox>
      <div className="text-slate-400 text-xs flex ">
        <span className="mr-4">{dayjs(todo.createtime).format(DATE_TIME)}</span>
        <CloseOutlined onClick={handleDelete} />
      </div>
    </div>
  );
}

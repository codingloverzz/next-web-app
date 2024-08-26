import InputTodo from "@/app/ui/todos/inputTodo";
import TodoItem from "@/app/ui/todos/todoItem";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
async function fetchTodos() {
  try {
    const res = await sql`
    select * from todos order by createtime asc  
 `;
    return res.rows;
  } catch (error) {
    throw new Error("fetchTodos error");
  } finally {
    revalidatePath("/dashboard/todos");
  }
}
export default async function page() {
  const todos = await fetchTodos();
  console.log(todos);

  return (
    <div>
      <InputTodo />
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </div>
  );
}

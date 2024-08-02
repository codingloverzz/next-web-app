import TodoItem from "@/app/ui/todos/todoItem";
import { sql } from "@vercel/postgres";

async function fetchTodos() {
  try {
    const res = await sql`
    select * from todos   
 `;
    return res.rows;
  } catch (error) {
    throw new Error("fetchTodos error");
  }
}

export default async function page() {
  const todos = await fetchTodos();
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </div>
  );
}

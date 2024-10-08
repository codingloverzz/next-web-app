"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import { DATE_TIME } from "@/constant/date";
export async function updateTodo(id: string, status: number, title: string) {
  try {
    await sql`
          update todos set status = ${status},title = ${title} where id = ${id}
         `;
    revalidatePath("/dashboard/todos");
  } catch (error) {
    console.log(error);
    throw new Error("getFLowVersionList error~");
  }
}

export async function addTodo(title: string) {
  console.log(dayjs().format(DATE_TIME), "dayjs");

  try {
    await sql`
          insert into todos (status,title,createTime,userId)
          values(1,${title},${dayjs().format(DATE_TIME)},1)
         `;
    revalidatePath("/dashboard/todos");
  } catch (error) {
    console.log(error);
    throw new Error("addTodo error~");
  }
}

export async function deleteTodo(id: string) {
  try {
    await sql`
          delete from todos where id = ${id}
         `;
    revalidatePath("/dashboard/todos");
  } catch (error) {
    console.log(error);
    throw new Error("deleteTodo error~");
  }
}

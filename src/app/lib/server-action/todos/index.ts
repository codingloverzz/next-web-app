"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

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

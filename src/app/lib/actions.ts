"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = {
    customerId: formData.get("customerId") as string,
    amount: formData.get("amount") as string,
    status: formData.get("status") as string,
  };
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${+amount * 100}, ${status}, ${date})
  `;

  //清除/dashboard/invoices路径的缓存
  //必须执行这个，不然添加完页面不会更新
  revalidatePath("/dashboard/invoices");
  //添加完数据跳转过去
  redirect("/dashboard/invoices");
}
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = {
    customerId: formData.get("customerId") as string,
    amount: formData.get("amount") as string,
    status: formData.get("status") as string,
  };
  await sql`
   UPDATE invoices
    SET customer_id = ${customerId}, amount = ${
    +amount * 100
  }, status = ${status}
    WHERE id = ${id}
  `;

  //清除/dashboard/invoices路径的缓存
  //必须执行这个，不然添加完页面不会更新
  revalidatePath("/dashboard/invoices");
  //添加完数据跳转过去
  redirect("/dashboard/invoices");
}
export async function deleteInvoice(id: string) {
  throw new Error("error~~~");
  try {
    await sql`
  delete from invoices where id = ${id}
`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "删除失败了" };
  }
}

export async function authenticate(
  // prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

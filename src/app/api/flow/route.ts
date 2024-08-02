import bcrypt from "bcrypt";
import { VersionType } from "@/app/lib/types/flow";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

async function getFLowVersionList() {
  try {
    const res = await sql<VersionType>`
          select * from flow_version where userId = 1
         `;
    return res.rows;
  } catch (error) {
    throw new Error("getFLowVersionList error~");
  }
}

export const GET = async () => {
  try {
    // const hashedPassword = await bcrypt.hash("123456", 10);
    // await sql`
    //   insert into users (name,account,email,password) values
    //   ('zw', 'admin', '10490052601@qq.com', ${hashedPassword})
    // `;

    const res = await getFLowVersionList();
    return Response.json(res);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

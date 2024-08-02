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
    // await sql`
    //   drop table todos
    // `;
    // await sql`
    //   CREATE TABLE IF NOT EXISTS todos (
    //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    //     title VARCHAR(255) NOT NULL,
    //     status INT NOT NULL,
    //     createTime timestamp,
    //     userId VARCHAR(255)
    //   );
    // `;
    // await sql`
    //   insert into todos (title,status,createTime,userId)
    //   values ('吃饭',1,'2024-08-01 15:30:00','1'),('吃饭2',1,'2024-08-01 15:30:00','1'),('吃饭3',1,'2024-08-01 15:30:00','1')
    // `;
    // const hashedPassword = await bcrypt.hash("123456", 10);
    // await sql`
    //   insert into users (name,account,email,password) values
    //   ('zw', 'admin', '10490052601@qq.com', ${hashedPassword})
    // `;

    const res = await getFLowVersionList();
    return Response.json(res);
  } catch (error) {
    console.log(error);

    return Response.json({ error }, { status: 500 });
  }
};

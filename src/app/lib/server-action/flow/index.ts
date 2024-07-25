// "use server";

import { sql } from "@vercel/postgres";
import { VersionType } from "../../types/flow";

export async function getFLowVersionList() {
  try {
    const res = await sql<VersionType>`
        select * from flow_version where userId = 1
       `;
    return res.rows;
  } catch (error) {
    throw new Error("getFLowVersionList error~");
  }
}

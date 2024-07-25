"use server";

import { sql } from "@vercel/postgres";
import { FlowType, VersionType } from "../../types/flow";
import { revalidatePath } from "next/cache";

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

export async function fetchFlowInfoById(id: string) {
  try {
    const res = await sql<FlowType>`
    select * from flow where version_id = ${id} and userId = 1
   `;
    return res.rows[0];
  } catch (error) {
    throw new Error("fetchFlowInfoById error~");
  }
}

export async function updateFlowInfo(id: string, info: FlowType) {
  try {
    const data = info.data;
    await sql`
        update flow set data = ${data} where version_id = ${id} and userId = 1
      `;
    revalidatePath(`/dashboard/flow?version=${id}`);
  } catch (error) {}
}

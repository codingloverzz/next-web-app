import { VersionType } from "@/app/lib/types/flow";
import { sql } from "@vercel/postgres";

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
    const res = await getFLowVersionList();
    return Response.json(res);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

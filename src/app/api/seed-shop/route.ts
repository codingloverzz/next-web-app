import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedFLowVersion() {
  try {
    // await client.sql`
    // DROP TABLE flow_version
    // `;
    await client.sql`
    CREATE TABLE IF NOT EXISTS flow_version(
    id SERIAL PRIMARY KEY,
    versionName VARCHAR(255) NOT NULL UNIQUE,
    comment VARCHAR(255),
    userId INT NOT NULL
    );
    `;
    // await client.sql`
    //   INSERT INTO flow_version (versionName,comment,userId)
    //   VALUES ('版本2','这是我的第一个版本哦',1),('版本3','这是我的第二个版本哦',1),('版本4','这是我的第三个版本哦',1) ;
    // `;
  } catch (error) {
    console.log(error);
  }

  return null;
}
const data = {
  nodes: [
    {
      id: "node1",
      shape: "rect",
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: "hello",
      attrs: {
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: "node2",
      shape: "rect",
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: "world",
      attrs: {
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: "edge",
      source: "node1",
      target: "node2",
      label: "x6",
      attrs: {
        line: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
        },
      },
    },
  ],
};
async function seedFlow() {
  try {
    await client.sql`
      drop table flow
    `;
    await client.sql`
      CREATE TABLE IF NOT EXISTS flow(
      id SERIAL PRIMARY KEY,
      version_id VARCHAR(255) NOT NULL UNIQUE,
      data json  NOT NULL,
      userId INT NOT NULL
      );
      `;
    await client.sql`
    INSERT INTO flow (version_id,data,userId)
    VALUES (1,${JSON.stringify(
      data
    )},1),(2,'{"name":"zhuwei"}',1),(3,'{"name":"niuniu"}',1) ;
  `;
  } catch (error) {
    console.log(error);
  }
}

export async function GET() {
  //   return Response.json({
  //     message:
  //       "Uncomment this file and remove this line. You can delete this file when you are finished.",
  //   });
  try {
    await client.sql`BEGIN`;
    await seedFLowVersion();
    await seedFlow();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

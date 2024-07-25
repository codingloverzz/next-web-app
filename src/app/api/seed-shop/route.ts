// import bcrypt from "bcrypt";
// import { db } from "@vercel/postgres";

// const client = await db.connect();

// async function seedFLowVersion() {
//   try {
//     await client.sql`
//     DROP TABLE flow_version
//     `;
//     await client.sql`
//     CREATE TABLE IF NOT EXISTS flow_version(
//     id SERIAL PRIMARY KEY,
//     versionName VARCHAR(255) NOT NULL UNIQUE,
//     comment VARCHAR(255),
//     userId INT NOT NULL
//     );
//     `;
//     await client.sql`
//       INSERT INTO flow_version (versionName,comment,userId)
//       VALUES ('版本2','这是我的第一个版本哦',1),('版本3','这是我的第二个版本哦',1),('版本4','这是我的第三个版本哦',1) ;
//     `;
//   } catch (error) {
//     console.log(error);
//   }

//   return null;
// }

// export async function GET() {
//   //   return Response.json({
//   //     message:
//   //       "Uncomment this file and remove this line. You can delete this file when you are finished.",
//   //   });
//   try {
//     await client.sql`BEGIN`;
//     await seedFLowVersion();
//     await client.sql`COMMIT`;

//     return Response.json({ message: "Database seeded successfully" });
//   } catch (error) {
//     await client.sql`ROLLBACK`;
//     return Response.json({ error }, { status: 500 });
//   }
// }

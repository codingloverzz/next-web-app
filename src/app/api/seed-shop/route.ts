import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedShop() {
  try {
    await client.sql`
    CREATE TABLE IF NOT EXISTS shop(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price  INT NOT NULL,
  status INT NOT NULL
);
    `;
    await client.sql`
    INSERT INTO shop (name, price, status)
    VALUES ('coffee','100','1');
  `;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function GET() {
  //   return Response.json({
  //     message:
  //       "Uncomment this file and remove this line. You can delete this file when you are finished.",
  //   });
  try {
    await client.sql`BEGIN`;
    await seedShop();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

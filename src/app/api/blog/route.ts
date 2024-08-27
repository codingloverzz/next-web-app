import { NextResponse } from "next/server";
import fs from "node:fs";
async function getFileContentById() {
  const filePath = "src/server/resource/react调和函数流程解析.md";
  const fStream = fs.createReadStream(filePath);
  return fStream;
}

export async function GET() {
  const stream = await getFileContentById();
  return new NextResponse(stream as any, {
    headers: {
      "Content-Disposition": "attachment; filename=your_file.txt",
      "Content-Type": "application/octet-stream",
    },
  });
}

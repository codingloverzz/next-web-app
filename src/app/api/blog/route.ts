import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
async function getFileContentById(filePath: string) {
  console.log(filePath, "filePath");
  // filePath = "src/server/resource/react调和函数流程解析.md";
  const fStream = fs.createReadStream(filePath);
  return fStream;
}

export async function GET(req: NextRequest) {
  const stream = await getFileContentById(
    req.nextUrl.searchParams.get("file")!
  );
  return new NextResponse(stream as any, {
    headers: {
      "Content-Disposition": "attachment; filename=your_file.txt",
      "Content-Type": "application/octet-stream",
    },
  });
}

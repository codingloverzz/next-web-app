import { getError } from "@/utils/result";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import CryptoJS from "crypto-js";
import { CRYPTO_MODE, CRYPTO_KEY, CRYPTO_IV } from "@/constant/crypto";
async function getFileContentById(filePath: string) {
  // filePath = "src/server/resource/react调和函数流程解析.md";
  try {
    const fStream = fs.createReadStream(filePath);
    return fStream;
  } catch (error) {
    console.log(error, "error~~");
  }
}
const checkFileExist = (filePath: string) => {
  return fs.existsSync(filePath);
};

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get("file")!;
  const decryptPath = CryptoJS.AES.decrypt(
    decodeURIComponent(filePath),
    CRYPTO_KEY,
    {
      iv: CRYPTO_IV,
    }
  ).toString(CryptoJS.enc.Utf8);

  console.log("filePath:::::", decryptPath);

  if (!checkFileExist(decryptPath)) {
    return new NextResponse(null, {
      status: 404,
    });
  }

  const stream = await getFileContentById(decryptPath);
  return new NextResponse(stream as any, {
    headers: {
      "Content-Disposition": "attachment; filename=your_file.txt",
      "Content-Type": "application/octet-stream",
    },
  });
}

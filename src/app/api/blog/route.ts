import { message } from "antd";
import { getError, getSuccess } from "@/utils/result";
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

const decryptFilePath = (encryptedPath: string) => {
  const decryptPath = CryptoJS.AES.decrypt(
    decodeURIComponent(encryptedPath),
    CRYPTO_KEY,
    {
      iv: CRYPTO_IV,
    }
  ).toString(CryptoJS.enc.Utf8);
  return decryptPath;
};
export async function GET(req: NextRequest) {
  console.log("进来了？？？");

  const filePath = req.nextUrl.searchParams.get("file")!;
  const decryptPath = decryptFilePath(filePath);
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

const updateFile = (path: string, content: string) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(path, {
      encoding: "utf8",
      highWaterMark: 16 * 1024, //写入的字节数，和encoding 没有关系
    });
    ws.write(content);
    ws.end(() => {
      resolve("success");
    });
  });
};
//更新文章
export async function POST(req: NextRequest) {
  // const filePath = req.nextUrl.searchParams.get("file")!;

  const body = await req.json();
  const path = body.path;
  const content = body.content;
  const decryptPath = decryptFilePath(path);
  console.log("及你啊了", content, "???", body.path);

  if (!checkFileExist(decryptPath)) {
    return new NextResponse(null, {
      status: 404,
    });
  }
  await updateFile(decryptPath, content);

  return Response.json(getSuccess("ok"));
}

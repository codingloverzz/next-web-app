"use server";
import { NextResponse } from "next/server";
import * as fs from "node:fs";
import path from "node:path";
import CryptoJS from "crypto-js";
import { CRYPTO_IV, CRYPTO_KEY, CRYPTO_MODE } from "@/constant/crypto";

export async function getBlogList() {
  const filePath = "src/server/resource";

  const traverseDir = async (filePath: string) => {
    const fileList: any[] = [];
    try {
      const files = await fs.promises.readdir(filePath, {
        withFileTypes: true,
      });
      for (const f of files) {
        const cryptoPath = CryptoJS.AES.encrypt(
          f.parentPath + "/" + f.name,
          CRYPTO_KEY,
          {
            iv: CRYPTO_IV,
          }
        ).toString();
        if (f.isDirectory()) {
          //文件夹
          const children = await await traverseDir(filePath + "/" + f.name);
          fileList.push({
            parentPath: f.parentPath,
            name: f.name,
            path: encodeURIComponent(cryptoPath),
            children,
          });
        } else {
          //文件
          fileList.push({
            parentPath: f.parentPath,
            name: f.name,
            path: encodeURIComponent(cryptoPath),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    return fileList;
  };
  // const res = await
  return traverseDir(filePath);
}

// export async function getBlogDetail(filePath: string) {
//   const p = path.resolve(filePath);
//   const stream = fs.createReadStream(p);
//   return new NextResponse(stream as any, {
//     headers: {
//       "Content-Disposition": "attachment; filename=your_file.txt",
//       "Content-Type": "application/octet-stream",
//     },
//   });
// }

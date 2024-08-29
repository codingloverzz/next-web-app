"use server";
import { NextResponse } from "next/server";
import * as fs from "node:fs";
import path from "node:path";

export async function getBlogList() {
  const filePath = "src/server/resource";

  const traverseDir = async (filePath: string) => {
    const fileList: any[] = [];
    try {
      const files = await fs.promises.readdir(filePath, {
        withFileTypes: true,
      });
      for (const f of files) {
        if (f.isDirectory()) {
          //文件夹
          const children = await await traverseDir(filePath + "/" + f.name);
          fileList.push({
            name: f.name,
            path: f.parentPath + "/" + f.name,
            children,
          });
        } else {
          //文件
          fileList.push({
            name: f.name,
            path: f.parentPath + "/" + f.name,
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

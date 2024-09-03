"use client";

import { Tree, TreeDataNode } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { CRYPTO_IV, CRYPTO_KEY } from "@/constant/crypto";
export default function FileTree({ treeData }: { treeData: TreeDataNode[] }) {
  const [currentFile, setCurrentFile] = useState("");
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  // useEffect(() => {
  //   // window.cr = CryptoJS;
  //   // window.aaa = CryptoJS.AES.encrypt("123123", CRYPTO_KEY, {
  //   //   iv: CRYPTO_IV,
  //   // }).toString();
  //   // window.bbb = CryptoJS.AES.decrypt(window.aaa, CRYPTO_KEY, {
  //   //   iv: CRYPTO_IV,
  //   // }).toString(CryptoJS.enc.Utf16BE);
  //   // Encrypt
  //   // 要加密的字符串
  //   var message = "src/server/resource/我在项目中做过的性能优化点.md";
  //   // 'XZImdpnN8W7oTpU5B8pwfe+BZKgfik+DGQQ0GASOOIHA/EtR1KeWTVbc7z9mN+kmG3GQEnkwYCwPNYx4Jxipvw=='
  //   // 密钥和初始化向量
  //   var key = CryptoJS.enc.Utf8.parse("1234567890123456"); // 密钥
  //   var iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 初始化向量

  //   // 加密
  //   var encrypted = CryptoJS.AES.encrypt(message, CRYPTO_KEY, {
  //     iv: CRYPTO_IV,
  //     // mode: CryptoJS.mode.CBC,
  //     // padding: CryptoJS.pad.Pkcs7,
  //   });
  //   const test = CryptoJS.AES.decrypt(encrypted.toString(), CRYPTO_KEY, {
  //     iv: CRYPTO_IV,
  //     // mode: CryptoJS.mode.CBC,
  //     // padding: CryptoJS.pad.Pkcs7,
  //   });
  //   // 打印加密结果
  //   console.log(test.toString(CryptoJS.enc.Utf8), "看看呢");
  // }, []);
  return (
    <Tree.DirectoryTree
      blockNode
      rootStyle={{
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
      selectedKeys={[currentFile]}
      treeData={treeData}
      fieldNames={{
        title: "name",
        key: "path",
      }}
      onSelect={(select, info) => {
        if (!info.node.children?.length) {
          setCurrentFile(select[0] as string);
          const params = new URLSearchParams(searchParams);
          params.set("file", select[0] as string);
          router.replace(`${pathName}?${params.toString()}`);
        }
      }}
    ></Tree.DirectoryTree>
  );
}

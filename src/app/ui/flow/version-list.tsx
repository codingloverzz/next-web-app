"use client";

import { VersionType } from "@/app/lib/types/flow";
import MyRequest from "@/utils/request";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function NavLinks() {
  const [versionList, setVersionList] = useState<VersionType[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentVersion = searchParams.get("version");
  useEffect(() => {
    MyRequest<VersionType[]>("/api/flow").then((res) => {
      setVersionList(res);
    });
  }, []);
  return (
    <div className="w-[120px] mt-[40px]">
      {versionList.map((link) => {
        return (
          <Link
            key={link.versionname}
            href={`${pathname}?version=${link.id}`}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": currentVersion === link.id + "",
              }
            )}
          >
            <p className="hidden md:block">{link.versionname}</p>
          </Link>
        );
      })}
    </div>
  );
}

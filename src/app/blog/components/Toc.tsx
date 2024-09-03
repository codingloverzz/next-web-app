"use client";
import { IToc } from "@/app/lib/types/Blog";
import clsx from "clsx";
import Link from "next/link";

export default function Toc({
  data,
  onTocClick,
}: {
  data: IToc[];
  onTocClick: (e: IToc) => void;
}) {
  return (
    <div>
      {data.map((item) => {
        const paddingLevel = `pl-${(item.level - 1) * 2.5}`;
        return (
          <div
            key={item.id}
            onClick={() => onTocClick(item)}
            className={clsx(paddingLevel, "cursor-pointer", "font-bold")}
          >
            {item.title}
          </div>
        );
      })}
      {/* {data.map((item) => {
        const paddingLevel = `pl-${(item.level - 1) * 2.5}`;
        return (
          <div>
            <Link href={`#${item.id}`} className={paddingLevel}>
              {item.title}
            </Link>
          </div>
        );
      })} */}
    </div>
  );
}

"use client";
import { useState } from "react";
import cn from "classnames";

import Input from "../../ui/Input";
import Button from "../../ui/Button";
import {
  FolderOutlined,
  TagOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ICategory, ITag } from "@/db/types/schema";
import { INoteDto } from "@/db/types/Dto";
function SidebarListItem({
  name,
  children,
}: {
  name?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full justify-start text-sm h-8 leading-8 pl-4 hover:bg-accent/80 cursor-pointer transition-all">
      {name}
      {children}
    </div>
  );
}

function NoteItem({ title, updateAt }: { title: string; updateAt: string }) {
  return (
    <div className="w-full flex items-center text-sm h-12 pl-4 hover:bg-accent/80 cursor-pointer transition-all">
      <div className="flex-1">
        <div className="text-sm text-primary font-medium ">{title}</div>
        <div className="text-muted-foreground text-xs ml-auto">{updateAt}</div>
      </div>
      <div className="w-6">
        <StarOutlined />
      </div>
    </div>
  );
}
export default function SideBar({
  notes,
  categories,
  tags,
}: {
  notes: INoteDto[];
  categories: ICategory[];
  tags: ITag[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      <div className="h-full overflow-hidden">
        <div
          className={cn(
            "w-72 border-r bg-background flex flex-col h-full overflow-y-auto",
            "fixed inset-y-0 left-0 z-20 md:relative",
            " transition-width duration-150 ease-in-out",
            isCollapsed ? "w-0" : "w-72"
          )}
        >
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold mb-4">notes</h1>
            <div className="relative">
              <Input
                placeholder="search notes..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="p-4 border-b">
            <Button type="primary" className="w-full">
              create new
            </Button>
          </div>
          <div className="p-2">
            <div className="flex items-center px-2 py-1.5">
              <FolderOutlined className="h-4 w-4 mr-2 text-muted-foreground " />
              <span className="text-sm font-medium">文件夹</span>
            </div>
            <div className="ml-4 mt-1 space-y-1">
              <SidebarListItem name="全部笔记" />
              {categories.map((category) => (
                <SidebarListItem key={category._id} name={category.name} />
              ))}
            </div>
          </div>

          <div className="p-2">
            <div className="flex items-center px-2 py-1.5">
              <TagOutlined className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">标签</span>
            </div>
            <div className="ml-4 mt-1 space-y-1">
              {tags.map((tag) => (
                <SidebarListItem key={tag._id} name={tag.name} />
              ))}
            </div>
          </div>

          <div className="p-2 border-b">
            <SidebarListItem>
              <StarOutlined className="!text-yellow-400 mr-1" />
              收藏
            </SidebarListItem>
            <SidebarListItem>
              <DeleteOutlined className="!text-muted-foreground mr-1" />
              回收站
            </SidebarListItem>
          </div>

          <div className="p-2">
            {notes.map((note) => (
              <NoteItem
                key={note._id}
                title={note.title}
                updateAt={note.updatedAt}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

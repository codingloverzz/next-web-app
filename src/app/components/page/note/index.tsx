"use client";

import { useState, useEffect } from "react";
// import {
//   Search,
//   Plus,
//   Folder,
//   Tag,
//   Star,
//   Trash,
//   Menu,
//   Save,
//   Bold,
//   Italic,
//   List,
//   ListOrdered,
//   ImageIcon,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { zhCN } from "date-fns/locale";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  favorite: boolean;
  tags: string[];
  folder: string;
}

export default function NotesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  // 初始化示例笔记
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: "1",
        title: "工作计划",
        content:
          "1. 完成项目报告\n2. 准备周会演示\n3. 回复客户邮件\n4. 更新项目文档",
        createdAt: new Date(2023, 3, 15),
        updatedAt: new Date(2023, 3, 15),
        favorite: true,
        tags: ["工作", "重要"],
        folder: "工作",
      },
      {
        id: "2",
        title: "购物清单",
        content:
          "- 水果：苹果、香蕉\n- 蔬菜：西红柿、黄瓜\n- 肉类：鸡胸肉、牛肉\n- 日用品：洗发水、牙膏",
        createdAt: new Date(2023, 3, 14),
        updatedAt: new Date(2023, 3, 14),
        favorite: false,
        tags: ["生活"],
        folder: "个人",
      },
      {
        id: "3",
        title: "学习笔记：React Hooks",
        content:
          "React Hooks 是 React 16.8 引入的新特性，它可以让你在不编写 class 的情况下使用 state 和其他 React 特性。\n\n常用的 Hooks：\n- useState\n- useEffect\n- useContext\n- useReducer\n- useCallback\n- useMemo\n- useRef",
        createdAt: new Date(2023, 3, 13),
        updatedAt: new Date(2023, 3, 13),
        favorite: true,
        tags: ["学习", "编程"],
        folder: "学习",
      },
      {
        id: "4",
        title: "旅行计划：杭州",
        content:
          "行程安排：\n1. 西湖（上午）\n2. 灵隐寺（下午）\n3. 河坊街（晚上）\n\n住宿：西湖附近酒店\n\n注意事项：\n- 带好雨伞\n- 舒适的鞋子\n- 相机充电",
        createdAt: new Date(2023, 3, 12),
        updatedAt: new Date(2023, 3, 12),
        favorite: false,
        tags: ["旅行", "计划"],
        folder: "个人",
      },
      {
        id: "5",
        title: "会议记录：产品讨论",
        content:
          "日期：2023年4月10日\n参与人：张三、李四、王五\n\n讨论要点：\n1. 产品新功能规划\n2. 用户反馈分析\n3. 下一版本发布时间\n\n决定事项：\n- 优先开发搜索功能\n- 5月初发布新版本\n- 下周进行用户测试",
        createdAt: new Date(2023, 3, 10),
        updatedAt: new Date(2023, 3, 10),
        favorite: false,
        tags: ["工作", "会议"],
        folder: "工作",
      },
    ];

    setNotes(sampleNotes);
    setActiveNote(sampleNotes[0]);
    setEditingTitle(sampleNotes[0].title);
    setEditingContent(sampleNotes[0].content);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const selectNote = (note: Note) => {
    setActiveNote(note);
    setEditingTitle(note.title);
    setEditingContent(note.content);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "新笔记",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false,
      tags: [],
      folder: "未分类",
    };

    setNotes([newNote, ...notes]);
    selectNote(newNote);
  };

  const saveNote = () => {
    if (!activeNote) return;

    const updatedNotes = notes.map((note) =>
      note.id === activeNote.id
        ? {
            ...note,
            title: editingTitle,
            content: editingContent,
            updatedAt: new Date(),
          }
        : note
    );

    setNotes(updatedNotes);
    setActiveNote({
      ...activeNote,
      title: editingTitle,
      content: editingContent,
      updatedAt: new Date(),
    });
  };

  const toggleFavorite = (noteId: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, favorite: !note.favorite } : note
    );

    setNotes(updatedNotes);

    if (activeNote && activeNote.id === noteId) {
      setActiveNote({
        ...activeNote,
        favorite: !activeNote.favorite,
      });
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return "";
    // return format(date, "yyyy年MM月dd日", { locale: zhCN });
  };

  return (
    <div className="flex h-screen">
      {/* 移动端菜单按钮 */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 md:hidden z-10"
        onClick={toggleMobileMenu}
      >
        <Menu className="h-5 w-5" />
      </Button> */}

      {/* 侧边栏 */}
      <div
      // className={cn(
      //   "w-72 border-r bg-background flex flex-col h-full",
      //   "fixed inset-y-0 left-0 z-20 md:relative",
      //   "transform transition-transform duration-200 ease-in-out",
      //   isMobileMenuOpen
      //     ? "translate-x-0"
      //     : "-translate-x-full md:translate-x-0"
      // )}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-4">我的笔记</h1>
          <div className="relative">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索笔记..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="p-4 border-b">
          {/* <Button className="w-full" onClick={createNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            新建笔记
          </Button> */}
        </div>

        <div className="p-2">
          <div className="flex items-center px-2 py-1.5">
            {/* <Folder className="h-4 w-4 mr-2 text-muted-foreground" /> */}
            <span className="text-sm font-medium">文件夹</span>
          </div>
          <div className="ml-4 mt-1 space-y-1">
            {/* <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              全部笔记
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              工作
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              个人
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              学习
            </Button> */}
          </div>
        </div>

        <div className="p-2">
          <div className="flex items-center px-2 py-1.5">
            {/* <Tag className="h-4 w-4 mr-2 text-muted-foreground" /> */}
            <span className="text-sm font-medium">标签</span>
          </div>
          <div className="ml-4 mt-1 space-y-1">
            {/* <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              工作
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              学习
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              生活
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-8"
            >
              重要
            </Button> */}
          </div>
        </div>

        <div className="p-2">
          {/* <Button variant="ghost" className="w-full justify-start text-sm h-8">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            收藏笔记
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm h-8">
            <Trash className="h-4 w-4 mr-2 text-muted-foreground" />
            回收站
          </Button> */}
        </div>

        {/* <Separator /> */}
        {/* 
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "p-2 rounded-md cursor-pointer",
                  activeNote?.id === note.id
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                )}
                onClick={() => selectNote(note)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(note.id);
                    }}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        note.favorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {note.content}
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>{formatDate(note.updatedAt)}</span>
                  <span className="mx-1">·</span>
                  <span>{note.folder}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea> */}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeNote ? (
          <>
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex-1">
                {/* <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="text-xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="笔记标题"
                /> */}
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>更新于 {formatDate(activeNote.updatedAt)}</span>
                  <span className="mx-1">·</span>
                  <span>{activeNote.folder}</span>
                  {activeNote.tags.length > 0 && (
                    <>
                      <span className="mx-1">·</span>
                      <div className="flex items-center gap-1">
                        {activeNote.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary px-1.5 py-0.5 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* <Button variant="outline" size="sm" onClick={saveNote}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button> */}
            </div>

            <div className="border-b p-1 flex items-center">
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Bold className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>标题 1</DropdownMenuItem>
                  <DropdownMenuItem>标题 2</DropdownMenuItem>
                  <DropdownMenuItem>标题 3</DropdownMenuItem>
                  <DropdownMenuItem>正文</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              {/* <Button variant="ghost" size="sm" className="h-8">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <Italic className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Button variant="ghost" size="sm" className="h-8">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Button variant="ghost" size="sm" className="h-8">
                <ImageIcon className="h-4 w-4" />
              </Button> */}
            </div>

            {/* <ScrollArea className="flex-1 p-4">
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="min-h-[calc(100vh-200px)] w-full resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="开始输入笔记内容..."
              />
            </ScrollArea> */}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">没有选择笔记</h2>
              <p className="text-muted-foreground mb-4">
                从左侧选择一个笔记或创建新笔记
              </p>
              {/* <Button onClick={createNewNote}>
                <Plus className="h-4 w-4 mr-2" />
                新建笔记
              </Button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

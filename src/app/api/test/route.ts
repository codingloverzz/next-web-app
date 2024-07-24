import { NextResponse } from "next/server";

async function handler(req: any, res: any) {
  // 假设您有一个待办事项列表
}

export async function GET() {
  try {
    const todos = [
      { id: 1, text: "Buy groceries" },
      { id: 2, text: "Read a book" },
    ];
    // 根据请求方法进行不同的处理
    return NextResponse.json(todos);
  } catch (error) {}
}

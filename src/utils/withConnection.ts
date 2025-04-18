import dbConnect from "@/db";

export default function withConnection(fn: any) {
  return async (...args: any[]) => {
    await dbConnect();
    return fn(...args);
  };
}

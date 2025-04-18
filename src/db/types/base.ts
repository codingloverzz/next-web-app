import mongoose, { Model } from "mongoose";

// 扩展基础Model接口
export interface BaseModel<T> extends Model<T> {
  plainFind<DocType>(query?: any): Promise<DocType[]>;
  // findByIdAndLean(id: string): Promise<any>;
  // 其他静态方法...
}

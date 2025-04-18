import mongoose from "mongoose";
import categorySchema, { ICategory } from "../schemas/CategorySchema";
import { BaseModel } from "../types/base";
import { commonStaticMethodsPlugin } from "../plugins/commonStaticMethods";
import noteSchema, { INote } from "../schemas/NoteSchema";
import tagSchema, { ITag } from "../schemas/TagSchema";
export function createModel<DocType>(
  modelName: string,
  schema: mongoose.Schema<DocType, BaseModel<DocType>>
) {
  // 自动应用通用插件
  schema.plugin(commonStaticMethodsPlugin);

  // 创建并返回模型
  return (
    (mongoose.models[modelName] as BaseModel<DocType>) ||
    mongoose.model<DocType, BaseModel<DocType>>(modelName, schema)
  );
}

const Category = createModel<ICategory>("Category", categorySchema);
const Tag = createModel<ITag>("Tag", tagSchema);
const Note = createModel<INote>("Note", noteSchema);

export { Category, Tag, Note };

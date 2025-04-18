import mongoose, { Model } from "mongoose";
import type { BaseModel } from "@/db/types/base";
import { ICategory } from "../types/category";

// 定义基本文档接口

const categorySchema = new mongoose.Schema<ICategory, BaseModel<ICategory>>({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default categorySchema;

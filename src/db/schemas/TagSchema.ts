import type { BaseModel } from "@/db/types/base";
import mongoose from "mongoose";
import { ITag } from "../types/tag";

const tagSchema = new mongoose.Schema<ITag, BaseModel<ITag>>({
  name: String,
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default tagSchema;

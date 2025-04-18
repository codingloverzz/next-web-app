import type { BaseModel } from "@/db/types/base";
import mongoose from "mongoose";
import { INote } from "../types/note";

const noteSchema = new mongoose.Schema<INote, BaseModel<INote>>({
  title: String,
  content: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

export default noteSchema;

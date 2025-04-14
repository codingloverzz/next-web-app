import mongoose from "mongoose";
import { NOTE_TAGS } from "@/constant";
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: {
    type: [String],
    enum: NOTE_TAGS,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 在保存之前更新 updatedAt 字段
noteSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;

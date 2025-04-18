import mongoose from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ITag {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: string[];
  isStarred: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

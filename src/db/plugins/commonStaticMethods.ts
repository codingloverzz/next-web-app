import mongoose from "mongoose";

export function commonStaticMethodsPlugin(schema: mongoose.Schema) {
  schema.statics.plainFind = async function (query: any) {
    const result = await this.find(query).lean();
    return result?.map((item: any) => JSON.parse(JSON.stringify(item)));
  };
}

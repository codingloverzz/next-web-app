import { Category } from "@/db/models";
import withConnection from "@/utils/withConnection";

const getCategories = withConnection(async () => {
  const categories = await Category.plainFind();
  return categories;
});

export { getCategories };

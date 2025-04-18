import withConnection from "@/utils/withConnection";
import { Tag } from "@/db/models";

const getTags = withConnection(async () => {
  const tags = await Tag.plainFind({});
  return tags;
});

export { getTags };

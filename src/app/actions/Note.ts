import { Note } from "@/db/models";
import { dateFormat } from "@/utils/dateFormat";
import withConnection from "@/utils/withConnection";

export const getNotes = withConnection(async () => {
  let notes = await Note.find({}).lean();
  notes = notes.map((note) => {
    return JSON.parse(
      JSON.stringify({
        ...note,
        updatedAt: dateFormat(note.updatedAt),
      })
    );
  });
  return notes;
});

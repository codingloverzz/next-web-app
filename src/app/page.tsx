import SideBar from "./components/page/note/SideBar";
import "./globals.css";
import { getNotes } from "./actions/Note";
import { getCategories } from "./actions/Category";
import { getTags } from "./actions/Tag";
export default async function Page() {
  const [notes, categories, tags] = await Promise.all([
    getNotes(),
    getCategories(),
    getTags(),
  ]);
  return (
    <>
      <SideBar notes={notes} categories={categories} tags={tags} />
    </>
  );
}

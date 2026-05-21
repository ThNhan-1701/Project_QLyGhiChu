import { notFound } from "next/navigation";
import { NoteEditor } from "@/components/notes/note-editor";
import { getNoteById } from "@/lib/actions/notes";
import { getTags } from "@/lib/actions/tags";

type NotePageProps = {
  params: {
    id: string;
  };
};

export default async function NotePage({ params }: NotePageProps) {
  const [note, allTags] = await Promise.all([getNoteById(params.id), getTags()]);

  if (!note) {
    notFound();
  }

  return <NoteEditor note={note} allTags={allTags} />;
}

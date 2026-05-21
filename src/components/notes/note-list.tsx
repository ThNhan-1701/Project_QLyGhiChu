"use client";

import { NoteCard } from "@/components/notes/note-card";
import { useRealtimeNotes } from "@/lib/hooks/useRealtimeNotes";
import type { NoteWithTags } from "@/lib/types";

type NoteListProps = {
  notes: NoteWithTags[];
};

export function NoteList({ notes }: NoteListProps) {
  const liveNotes = useRealtimeNotes(notes);
  const pinned = liveNotes.filter((note) => note.is_pinned);
  const others = liveNotes.filter((note) => !note.is_pinned);

  if (liveNotes.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Không có ghi chú phù hợp.</p>;
  }

  return (
    <div className="space-y-8">
      {pinned.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Đã ghim</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinned.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      ) : null}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tất cả ghi chú</h2>
        {others.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có ghi chú nào khác.</p>
        )}
      </section>
    </div>
  );
}

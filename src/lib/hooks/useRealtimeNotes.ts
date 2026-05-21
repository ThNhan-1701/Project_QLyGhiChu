"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { NoteWithTags } from "@/lib/types";

export function useRealtimeNotes(initialNotes: NoteWithTags[]): NoteWithTags[] {
  const [notes, setNotes] = useState<NoteWithTags[]>(initialNotes);

  useEffect(() => setNotes(initialNotes), [initialNotes]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("notes-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setNotes((current) => [{ ...(payload.new as NoteWithTags), note_tags: [] }, ...current]);
        }
        if (payload.eventType === "UPDATE") {
          setNotes((current) =>
            current.map((note) =>
              note.id === payload.new.id ? ({ ...note, ...(payload.new as NoteWithTags) } as NoteWithTags) : note
            )
          );
        }
        if (payload.eventType === "DELETE") {
          setNotes((current) => current.filter((note) => note.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return notes;
}

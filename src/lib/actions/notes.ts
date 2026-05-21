"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CreateNoteInput, Note, NoteWithTags, UpdateNoteInput } from "@/lib/types";

async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này");
  return data.user.id;
}

export async function getNotes(search?: string, tagId?: string, mood?: string): Promise<NoteWithTags[]> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    let query = supabase
      .from("notes")
      .select("*, note_tags(tags(*))")
      .eq("user_id", userId)
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (search) {
      const normalizedSearch = search.trim().replaceAll(",", " ");
      query = query.or(`title.ilike.%${normalizedSearch}%,content.ilike.%${normalizedSearch}%`);
    }

    if (mood) {
      query = query.eq("mood", mood);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const notes = (data ?? []) as NoteWithTags[];
    return tagId ? notes.filter((note) => note.note_tags.some((item) => item.tags.id === tagId)) : notes;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tải danh sách ghi chú");
  }
}

export async function getNoteById(id: string): Promise<NoteWithTags | null> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("notes")
      .select("*, note_tags(tags(*))")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }

    return data as NoteWithTags;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tải ghi chú");
  }
}

export async function createNote(input: CreateNoteInput, coverUrl?: string): Promise<Note> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    const { tag_ids, ...noteInput } = input;
    const { data, error } = await supabase
      .from("notes")
      .insert({ ...noteInput, cover_url: coverUrl ?? null, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (tag_ids.length > 0) {
      const { error: tagError } = await supabase
        .from("note_tags")
        .insert(tag_ids.map((tagId) => ({ note_id: data.id, tag_id: tagId })));
      if (tagError) throw new Error(tagError.message);
    }

    revalidatePath("/dashboard");
    return data as Note;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tạo ghi chú");
  }
}

export async function updateNote(input: UpdateNoteInput, coverUrl?: string): Promise<Note> {
  try {
    const supabase = await createClient();
    await getUserId();
    const { id, tag_ids, ...noteInput } = input;
    const updatePayload = coverUrl ? { ...noteInput, cover_url: coverUrl } : noteInput;
    const { data, error } = await supabase.from("notes").update(updatePayload).eq("id", id).select().single();

    if (error) throw new Error(error.message);

    if (tag_ids) {
      const { error: deleteError } = await supabase.from("note_tags").delete().eq("note_id", id);
      if (deleteError) throw new Error(deleteError.message);

      if (tag_ids.length > 0) {
        const { error: insertError } = await supabase
          .from("note_tags")
          .insert(tag_ids.map((tagId) => ({ note_id: id, tag_id: tagId })));
        if (insertError) throw new Error(insertError.message);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/notes/${id}`);
    return data as Note;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể cập nhật ghi chú");
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const supabase = await createClient();
    await getUserId();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể xóa ghi chú");
  }
}

export async function togglePin(id: string, isPinned: boolean): Promise<void> {
  try {
    const supabase = await createClient();
    await getUserId();
    const { error } = await supabase.from("notes").update({ is_pinned: isPinned }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
    revalidatePath(`/notes/${id}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể cập nhật trạng thái ghim");
  }
}

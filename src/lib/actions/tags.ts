"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Tag, TagWithCount } from "@/lib/types";

async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này");
  return data.user.id;
}

export async function getTags(): Promise<Tag[]> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    const { data, error } = await supabase.from("tags").select("*").eq("user_id", userId).order("name");
    if (error) throw new Error(error.message);
    return (data ?? []) as Tag[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tải tags");
  }
}

export async function getTagsWithCount(): Promise<TagWithCount[]> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("tags")
      .select("*, note_tags(note_id)")
      .eq("user_id", userId)
      .order("name");

    if (error) throw new Error(error.message);

    return (data ?? []).map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      user_id: tag.user_id,
      created_at: tag.created_at,
      note_count: Array.isArray(tag.note_tags) ? tag.note_tags.length : 0
    }));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tải tags");
  }
}

export async function createTag(name: string, color: string): Promise<Tag> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("tags")
      .insert({ name, color, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidatePath("/tags");
    revalidatePath("/dashboard");
    return data as Tag;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tạo tag");
  }
}

export async function deleteTag(id: string): Promise<void> {
  try {
    const supabase = await createClient();
    await getUserId();
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/tags");
    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể xóa tag");
  }
}

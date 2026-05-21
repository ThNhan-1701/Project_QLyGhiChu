import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/lib/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadCoverImage(file: File, userId: string): Promise<string> {
  try {
    const supabase = createClient();
    const safeName = file.name.replace(/\s/g, "_");
    const path = `covers/${userId}/${Date.now()}_${safeName}`;

    const { error } = await supabase.storage.from("note-covers").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });

    if (error) {
      if (error.message.toLowerCase().includes("row-level security")) {
        throw new Error("Storage chưa có policy upload cho bucket note-covers. Hãy chạy lại supabase/schema.sql trong Supabase SQL Editor.");
      }

      throw new Error(error.message);
    }

    const { data } = supabase.storage.from("note-covers").getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Không thể tải ảnh bìa");
  }
}

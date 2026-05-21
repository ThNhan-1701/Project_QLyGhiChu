"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { ImagePlus, Pin, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteNote, togglePin, updateNote } from "@/lib/actions/notes";
import { createClient } from "@/lib/supabase/client";
import type { NoteWithTags, Tag } from "@/lib/types";
import { uploadCoverImage } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/notes/TagSelector";
import { MoodSelector } from "@/components/notes/MoodSelector";
import { getMoodOption } from "@/lib/moods";

type NoteEditorProps = {
  note: NoteWithTags;
  allTags: Tag[];
};

export function NoteEditor({ note, allTags }: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [mood, setMood] = useState(note.mood);
  const [isPinned, setIsPinned] = useState(note.is_pinned);
  const [selectedTagIds, setSelectedTagIds] = useState(note.note_tags.map((item) => item.tags.id));
  const [tags, setTags] = useState(allTags);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(note.cover_url ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
    );
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("Tiêu đề không được để trống");
      return;
    }

    setIsLoading(true);
    try {
      let coverUrl: string | undefined;
      if (coverFile) {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error("Bạn cần đăng nhập để tải ảnh");
        coverUrl = await uploadCoverImage(coverFile, data.user.id);
      }

      await updateNote({ id: note.id, title, content, mood, is_pinned: isPinned, tag_ids: selectedTagIds }, coverUrl);
      toast.success("Đã lưu ghi chú");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu ghi chú");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteNote(note.id);
      toast.success("Đã xóa ghi chú");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa ghi chú");
    }
  }

  async function handleTogglePin() {
    const next = !isPinned;
    setIsPinned(next);
    try {
      await togglePin(note.id, next);
      router.refresh();
    } catch (error) {
      setIsPinned(!next);
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật ghim");
    }
  }

  if (!isEditing) {
    const visibleTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
    const moodOption = getMoodOption(mood);
    const MoodIcon = moodOption.icon;
    return (
      <article className="mx-auto max-w-3xl space-y-6">
        {coverPreview ? (
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
            <Image alt={title} className="object-cover" fill priority sizes="(min-width: 768px) 768px, 100vw" src={coverPreview} />
          </div>
        ) : null}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
              <Button variant="outline" type="button" onClick={handleTogglePin}>
                <Pin className="mr-2 h-4 w-4" />
                {isPinned ? "Bỏ ghim" : "Ghim"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xóa ghi chú?</AlertDialogTitle>
                    <AlertDialogDescription>Thao tác này sẽ xóa vĩnh viễn ghi chú hiện tại.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${moodOption.className}`}>
              <MoodIcon className="h-3.5 w-3.5" />
              {moodOption.label}
            </span>
            {visibleTags.map((tag) => (
              <Badge key={tag.id} className="border-transparent text-white" style={{ backgroundColor: tag.color }}>
                {tag.name}
              </Badge>
            ))}
          </div>
          <p className="whitespace-pre-wrap text-base leading-7">{content || "Không có nội dung"}</p>
          <p className="text-sm text-muted-foreground">
            Cập nhật lần cuối: {new Date(note.updated_at).toLocaleString("vi-VN")}
          </p>
        </div>
      </article>
    );
  }

  return (
    <form className="mx-auto max-w-3xl space-y-6" onSubmit={handleSave}>
      <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" required value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" className="min-h-[200px]" value={content} onChange={(event) => setContent(event.target.value)} />
          </div>
          <div className="space-y-3">
            <Label>Ảnh bìa</Label>
            <input id="cover" className="hidden" type="file" accept="image/*" onChange={handleCoverChange} />
            <div className="flex gap-2">
              <Button asChild type="button" variant="outline">
                <label htmlFor="cover" className="cursor-pointer">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Chọn ảnh bìa
                </label>
              </Button>
              {coverPreview ? (
                <Button type="button" variant="ghost" onClick={() => { setCoverFile(null); setCoverPreview(""); }}>
                  <X className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              ) : null}
            </div>
            {coverPreview ? (
              <div className="relative aspect-video overflow-hidden rounded-md border">
                <Image alt="Preview" className="object-cover" fill src={coverPreview} />
              </div>
            ) : null}
          </div>
          <MoodSelector value={mood} onChange={setMood} />
          <TagSelector tags={tags} selectedTagIds={selectedTagIds} onTagsChange={setTags} onToggleTag={toggleTag} />
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={isPinned} onCheckedChange={(checked) => setIsPinned(checked === true)} />
            Ghim ghi chú
          </label>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
          Hủy
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  );
}

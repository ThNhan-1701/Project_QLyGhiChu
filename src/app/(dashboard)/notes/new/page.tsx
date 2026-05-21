"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ClipboardList, ImagePlus, Lightbulb, NotebookTabs, Sparkles, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createNote } from "@/lib/actions/notes";
import { getTags } from "@/lib/actions/tags";
import { createClient } from "@/lib/supabase/client";
import type { NoteMood, NoteStyle, Tag } from "@/lib/types";
import { uploadCoverImage } from "@/lib/utils";
import { TagSelector } from "@/components/notes/TagSelector";
import { MoodSelector } from "@/components/notes/MoodSelector";
import { StyleSelector } from "@/components/notes/StyleSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const draftKey = "noteapp:new-note-draft";

const noteTemplates = [
  {
    name: "Nhật ký",
    icon: NotebookTabs,
    title: "Nhật ký ngày mới",
    content: "Hôm nay mình muốn ghi lại:\n\nĐiều nổi bật nhất:\n\nĐiều mình học được:\n\nViệc cần làm tiếp theo:\n"
  },
  {
    name: "Cuộc họp",
    icon: ClipboardList,
    title: "Ghi chú cuộc họp",
    content: "Mục tiêu cuộc họp:\n\nNgười tham gia:\n\nNội dung chính:\n- \n\nQuyết định:\n- \n\nViệc cần làm:\n- [ ] \n"
  },
  {
    name: "Ý tưởng",
    icon: Lightbulb,
    title: "Ý tưởng mới",
    content: "Vấn đề cần giải quyết:\n\nÝ tưởng chính:\n\nLợi ích:\n\nRủi ro hoặc điểm cần kiểm chứng:\n\nBước thử nghiệm đầu tiên:\n"
  },
  {
    name: "Checklist",
    icon: Sparkles,
    title: "Danh sách việc cần làm",
    content: "- [ ] Việc quan trọng nhất\n- [ ] Việc tiếp theo\n- [ ] Kiểm tra kết quả\n"
  }
];

type NoteDraft = {
  title: string;
  content: string;
  mood: NoteMood;
  noteStyle: NoteStyle;
  isPinned: boolean;
  selectedTagIds: string[];
};

export default function NewNotePage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<NoteMood>("focus");
  const [noteStyle, setNoteStyle] = useState<NoteStyle>("classic");
  const [isPinned, setIsPinned] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const hasDraftContent = useMemo(
    () =>
      title.trim().length > 0 ||
      content.trim().length > 0 ||
      selectedTagIds.length > 0 ||
      isPinned ||
      mood !== "focus" ||
      noteStyle !== "classic",
    [content, isPinned, mood, noteStyle, selectedTagIds.length, title]
  );

  useEffect(() => {
    getTags().then(setTags).catch((error: Error) => toast.error(error.message));
  }, []);

  useEffect(() => {
    const rawDraft = window.localStorage.getItem(draftKey);
    if (!rawDraft) {
      setHasLoadedDraft(true);
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as Partial<NoteDraft>;
      setTitle(draft.title ?? "");
      setContent(draft.content ?? "");
      setMood(draft.mood ?? "focus");
      setNoteStyle(draft.noteStyle ?? "classic");
      setIsPinned(draft.isPinned ?? false);
      setSelectedTagIds(draft.selectedTagIds ?? []);
      toast.info("Đã khôi phục bản nháp đang viết");
    } catch {
      window.localStorage.removeItem(draftKey);
    } finally {
      setHasLoadedDraft(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) return;

    const timer = window.setTimeout(() => {
      if (!hasDraftContent) {
        window.localStorage.removeItem(draftKey);
        return;
      }

      const draft: NoteDraft = {
        title,
        content,
        mood,
        noteStyle,
        isPinned,
        selectedTagIds
      };
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [content, hasDraftContent, hasLoadedDraft, isPinned, mood, noteStyle, selectedTagIds, title]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : "");
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
    );
  }

  function applyTemplate(template: (typeof noteTemplates)[number]) {
    if (title.trim() || content.trim()) {
      const shouldReplace = window.confirm("Mẫu này sẽ thay thế tiêu đề và nội dung hiện tại. Tiếp tục?");
      if (!shouldReplace) return;
    }

    setTitle(template.title);
    setContent(template.content);
    toast.success(`Đã áp dụng mẫu ${template.name}`);
  }

  function clearDraft() {
    setTitle("");
    setContent("");
    setMood("focus");
    setNoteStyle("classic");
    setIsPinned(false);
    setSelectedTagIds([]);
    setCoverFile(null);
    setCoverPreview("");
    window.localStorage.removeItem(draftKey);
    toast.success("Đã xóa bản nháp");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      await createNote({ title, content, mood, note_style: noteStyle, is_pinned: isPinned, tag_ids: selectedTagIds }, coverUrl);
      window.localStorage.removeItem(draftKey);
      toast.success("Tạo ghi chú thành công");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo ghi chú");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mx-auto max-w-3xl space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Tạo ghi chú mới</h1>
          <p className="text-sm text-muted-foreground">
            Chọn mẫu nhanh, viết nội dung và bản nháp sẽ tự lưu trong trình duyệt.
          </p>
        </div>
        {hasDraftContent ? (
          <Button type="button" variant="outline" onClick={clearDraft}>
            <X className="mr-2 h-4 w-4" />
            Xóa bản nháp
          </Button>
        ) : null}
      </div>

      <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <Label>Mẫu ghi chú nhanh</Label>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {noteTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    className="flex items-center gap-2 rounded-xl border bg-background/70 p-3 text-left text-sm transition hover:border-primary/60 hover:bg-primary/5"
                    key={template.name}
                    type="button"
                    onClick={() => applyTemplate(template)}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              required
              placeholder="Ví dụ: Ý tưởng sản phẩm tuần này"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              className="min-h-[240px]"
              placeholder="Viết ghi chú của bạn..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {hasDraftContent ? "Bản nháp đang được tự lưu." : "Bắt đầu viết để tạo bản nháp tự động."}
            </p>
          </div>
          <MoodSelector value={mood} onChange={setMood} />
          <StyleSelector value={noteStyle} onChange={setNoteStyle} />
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview("");
                  }}
                >
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
          <TagSelector
            tags={tags}
            selectedTagIds={selectedTagIds}
            onTagsChange={setTags}
            onToggleTag={toggleTag}
          />
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={isPinned} onCheckedChange={(checked) => setIsPinned(checked === true)} />
            Ghim ghi chú
          </label>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Đang tạo..." : "Tạo ghi chú"}
        </Button>
      </div>
    </form>
  );
}

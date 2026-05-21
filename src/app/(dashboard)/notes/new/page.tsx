"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createNote } from "@/lib/actions/notes";
import { getTags } from "@/lib/actions/tags";
import { createClient } from "@/lib/supabase/client";
import type { Tag } from "@/lib/types";
import { uploadCoverImage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewNotePage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTags().then(setTags).catch((error: Error) => toast.error(error.message));
  }, []);

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

      await createNote({ title, content, is_pinned: isPinned, tag_ids: selectedTagIds }, coverUrl);
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
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Tạo ghi chú mới</h1>
        <p className="text-sm text-muted-foreground">Nhập thông tin, chọn ảnh bìa và gắn tag cho ghi chú.</p>
      </div>
      <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" required placeholder="Ví dụ: Ý tưởng sản phẩm tuần này" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" className="min-h-[220px]" placeholder="Viết ghi chú của bạn..." value={content} onChange={(event) => setContent(event.target.value)} />
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
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}>
                    <Badge
                      className={selected ? "border-transparent text-white" : "bg-background"}
                      variant={selected ? "default" : "outline"}
                      style={selected ? { backgroundColor: tag.color } : undefined}
                    >
                      {tag.name}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
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

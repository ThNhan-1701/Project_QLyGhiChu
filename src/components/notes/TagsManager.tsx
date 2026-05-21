"use client";

import { FormEvent, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createTag, deleteTag } from "@/lib/actions/tags";
import type { TagWithCount } from "@/lib/types";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const colors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#64748b"];

type TagsManagerProps = {
  initialTags: TagWithCount[];
};

export function TagsManager({ initialTags }: TagsManagerProps) {
  const [tags, setTags] = useState(initialTags);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Tên tag không được để trống");
      return;
    }

    setIsLoading(true);
    try {
      const tag = await createTag(name.trim(), color);
      setTags((current) => [...current, { ...tag, note_count: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      toast.success("Đã tạo tag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo tag");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTag(id);
      setTags((current) => current.filter((tag) => tag.id !== id));
      toast.success("Đã xóa tag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa tag");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Quản lý Tags</h1>
        <p className="text-sm text-muted-foreground">Tạo màu và sắp xếp nhóm ghi chú của bạn.</p>
      </div>
      <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="name">Tên tag</Label>
              <Input id="name" placeholder="Ví dụ: Công việc" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mau</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((item) => (
                  <button
                    aria-label={`Chon mau ${item}`}
                    className="h-8 w-8 rounded-full border-2"
                    key={item}
                    style={{ backgroundColor: item, borderColor: color === item ? "hsl(var(--foreground))" : "transparent" }}
                    type="button"
                    onClick={() => setColor(item)}
                  />
                ))}
              </div>
            </div>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Đang tạo..." : "Tạo tag"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: tag.color }} />
              <div className="min-w-0">
                <p className="truncate font-medium">{tag.name}</p>
                <p className="text-sm text-muted-foreground">{tag.note_count} ghi chú</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button aria-label="Xóa tag" size="icon" type="button" variant="ghost">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa tag?</AlertDialogTitle>
                  <AlertDialogDescription>Tag sẽ bị xóa khỏi các ghi chú đang gắn.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(tag.id)}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
        {tags.length === 0 ? <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Chưa có tag nào.</p> : null}
      </div>
    </div>
  );
}

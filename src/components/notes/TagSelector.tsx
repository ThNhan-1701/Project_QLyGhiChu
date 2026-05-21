"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createTag } from "@/lib/actions/tags";
import type { Tag } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const presetColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#64748b"];

type TagSelectorProps = {
  tags: Tag[];
  selectedTagIds: string[];
  onTagsChange: (tags: Tag[]) => void;
  onToggleTag: (tagId: string) => void;
};

export function TagSelector({ tags, selectedTagIds, onTagsChange, onToggleTag }: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(presetColors[0]);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newTagName.trim();

    if (!name) {
      toast.error("Tên tag không được để trống");
      return;
    }

    const existingTag = tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
    if (existingTag) {
      if (!selectedTagIds.includes(existingTag.id)) {
        onToggleTag(existingTag.id);
      }
      setNewTagName("");
      toast.info("Tag đã tồn tại và đã được chọn");
      return;
    }

    setIsCreating(true);
    try {
      const tag = await createTag(name, newTagColor);
      onTagsChange([...tags, tag].sort((a, b) => a.name.localeCompare(b.name, "vi")));
      onToggleTag(tag.id);
      setNewTagName("");
      toast.success("Đã tạo tag mới");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo tag");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const selected = selectedTagIds.includes(tag.id);
          return (
            <button key={tag.id} type="button" onClick={() => onToggleTag(tag.id)}>
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
        {tags.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có tag nào.</p> : null}
      </div>
      <form className="rounded-xl border bg-muted/35 p-3" onSubmit={handleCreateTag}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            aria-label="Tên tag mới"
            placeholder="Tạo tag nhanh..."
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
          />
          <div className="flex items-center gap-2">
            {presetColors.map((color) => (
              <button
                aria-label={`Chọn màu ${color}`}
                className="h-8 w-8 rounded-full border-2"
                key={color}
                style={{
                  backgroundColor: color,
                  borderColor: newTagColor === color ? "hsl(var(--foreground))" : "transparent"
                }}
                type="button"
                onClick={() => setNewTagColor(color)}
              />
            ))}
          </div>
          <Button disabled={isCreating} type="submit">
            <Plus className="mr-2 h-4 w-4" />
            {isCreating ? "Đang tạo..." : "Tạo tag"}
          </Button>
        </div>
      </form>
    </div>
  );
}

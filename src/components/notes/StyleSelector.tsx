"use client";

import { cn } from "@/lib/utils";
import { noteStyleOptions } from "@/lib/note-styles";
import type { NoteStyle } from "@/lib/types";
import { Label } from "@/components/ui/label";

type StyleSelectorProps = {
  value: NoteStyle;
  onChange: (style: NoteStyle) => void;
};

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Phong cách card</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {noteStyleOptions.map((style) => {
          const Icon = style.icon;
          const selected = style.id === value;

          return (
            <button
              className={cn(
                "rounded-xl border bg-background/70 p-3 text-left transition hover:border-primary/60 hover:bg-primary/5",
                selected && "border-primary ring-2 ring-primary/20"
              )}
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
            >
              <span className={cn("mb-3 flex h-10 items-center justify-center rounded-lg border", style.previewClassName)}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="block text-sm font-semibold">{style.label}</span>
              <span className="block text-xs text-muted-foreground">{style.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

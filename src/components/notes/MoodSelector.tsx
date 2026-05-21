"use client";

import { cn } from "@/lib/utils";
import { moodOptions } from "@/lib/moods";
import type { NoteMood } from "@/lib/types";
import { Label } from "@/components/ui/label";

type MoodSelectorProps = {
  value: NoteMood;
  onChange: (mood: NoteMood) => void;
};

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Mood của ghi chú</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const selected = mood.id === value;

          return (
            <button
              className={cn(
                "flex items-start gap-3 rounded-xl border bg-background/70 p-3 text-left transition hover:border-primary/60 hover:bg-primary/5",
                selected && mood.className
              )}
              key={mood.id}
              type="button"
              onClick={() => onChange(mood.id)}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{mood.label}</span>
                <span className="block text-xs opacity-80">{mood.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

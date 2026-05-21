import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NoteWithTags } from "@/lib/types";
import { getMoodOption } from "@/lib/moods";
import { getNoteStyleOption } from "@/lib/note-styles";
import { cn } from "@/lib/utils";

type NoteCardProps = {
  note: NoteWithTags;
};

function formatRelativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

export function NoteCard({ note }: NoteCardProps) {
  const tags = note.note_tags.map((item) => item.tags);
  const summary = note.content.length > 140 ? `${note.content.slice(0, 140)}...` : note.content;
  const mood = getMoodOption(note.mood);
  const MoodIcon = mood.icon;
  const noteStyle = getNoteStyleOption(note.note_style);
  const StyleIcon = noteStyle.icon;

  return (
    <Link className="group block h-full" href={`/notes/${note.id}`}>
      <Card
        className={cn(
          "relative h-full overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
          noteStyle.cardClassName
        )}
      >
        <div className={cn("absolute left-0 top-0 h-full w-1.5", noteStyle.accentClassName)} />
        <div className="relative">
          {note.cover_url ? (
            <div className="relative aspect-[16/7] overflow-hidden bg-muted">
              <Image
                alt={note.title}
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                src={note.cover_url}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          ) : (
            <div className={cn("relative aspect-[16/7] overflow-hidden", noteStyle.patternClassName)}>
              <div className="absolute right-4 top-4 rounded-2xl bg-background/60 p-3 shadow-sm backdrop-blur">
                <StyleIcon className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="flex min-h-[220px] flex-col gap-4 p-5 pl-6">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${mood.className}`}>
              <MoodIcon className="h-3.5 w-3.5" />
              {mood.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border bg-background/70 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              <StyleIcon className="h-3 w-3" />
              {noteStyle.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              {note.is_pinned ? <Pin className="mt-1 h-4 w-4 shrink-0 fill-amber-400 text-amber-500" /> : null}
              <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">{note.title}</h2>
            </div>
            <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-muted-foreground">
              {summary || "Không có nội dung"}
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex min-h-6 flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} className="border-transparent text-white shadow-sm" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 3 ? <Badge variant="secondary">+{tags.length - 3}</Badge> : null}
            </div>
            <div className="flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <time dateTime={note.updated_at}>{formatRelativeTime(note.updated_at)}</time>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

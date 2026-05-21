import Image from "next/image";
import Link from "next/link";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NoteWithTags } from "@/lib/types";
import { getMoodOption } from "@/lib/moods";

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
  const summary = note.content.length > 120 ? `${note.content.slice(0, 120)}...` : note.content;
  const mood = getMoodOption(note.mood);
  const MoodIcon = mood.icon;

  return (
    <Link className="block" href={`/notes/${note.id}`}>
      <Card className="h-full overflow-hidden border-white/70 bg-white/85 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80 dark:border-white/10 dark:bg-card/90 dark:hover:shadow-black/25">
        {note.cover_url ? (
          <div className="relative aspect-video bg-muted">
            <Image alt={note.title} className="object-cover" fill sizes="(min-width: 1024px) 33vw, 100vw" src={note.cover_url} />
          </div>
        ) : null}
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${mood.className}`}>
              <MoodIcon className="h-3.5 w-3.5" />
              {mood.label}
            </span>
          </div>
          <div className="flex items-start gap-2">
            {note.is_pinned ? <Pin className="mt-0.5 h-4 w-4 shrink-0 fill-amber-400 text-amber-500" /> : null}
            <h2 className="line-clamp-2 font-semibold">{note.title}</h2>
          </div>
          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{summary || "Không có nội dung"}</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} className="border-transparent text-white" style={{ backgroundColor: tag.color }}>
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 ? <Badge variant="secondary">+{tags.length - 3}</Badge> : null}
          </div>
          <time className="block text-xs text-muted-foreground" dateTime={note.updated_at}>
            {formatRelativeTime(note.updated_at)}
          </time>
        </CardContent>
      </Card>
    </Link>
  );
}

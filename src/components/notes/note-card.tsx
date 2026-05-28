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
  index?: number;
};

function formatRelativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} ph\u00fat tr\u01b0\u1edbc`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} gi\u1edd tr\u01b0\u1edbc`;
  return `${Math.floor(hours / 24)} ng\u00e0y tr\u01b0\u1edbc`;
}

export function NoteCard({ note, index = 0 }: NoteCardProps) {
  const tags = note.note_tags.map((item) => item.tags);
  const summary = note.content.length > 140 ? `${note.content.slice(0, 140)}...` : note.content;
  const mood = getMoodOption(note.mood);
  const MoodIcon = mood.icon;
  const noteStyle = getNoteStyleOption(note.note_style);
  const StyleIcon = noteStyle.icon;

  return (
    <Link
      className="group block h-full animate-card-pop"
      href={`/notes/${note.id}`}
      style={{ animationDelay: `${Math.min(index * 55, 330)}ms` }}
    >
      <div className="relative h-full rounded-[1.05rem] p-[1px] before:absolute before:inset-0 before:-z-10 before:rounded-[1.05rem] before:bg-[conic-gradient(from_180deg,rgba(14,165,233,0.35),rgba(168,85,247,0.28),rgba(251,191,36,0.35),rgba(20,184,166,0.28),rgba(14,165,233,0.35))] before:opacity-0 before:blur-sm before:transition before:duration-500 group-hover:before:animate-border-spin group-hover:before:opacity-100">
      <Card
        className={cn(
          "relative h-full overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-[0.25deg] group-hover:shadow-2xl",
          noteStyle.cardClassName
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-60 blur-3xl transition duration-500 group-hover:animate-card-pulse group-hover:scale-125 group-hover:opacity-90",
            noteStyle.glowClassName
          )}
        />
        <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-white/25 blur-2xl opacity-0 transition duration-500 group-hover:opacity-80 dark:bg-white/10" />
        <div className="pointer-events-none absolute inset-y-0 -left-1/3 z-10 hidden w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 group-hover:block group-hover:animate-card-sheen group-hover:opacity-100 dark:via-white/20" />
        <div className={cn("absolute left-0 top-0 h-full w-2 shadow-lg", noteStyle.accentClassName)} />
        <div className="relative">
          {note.cover_url ? (
            <div className="relative aspect-[16/7] overflow-hidden bg-muted">
              <Image
                alt={note.title}
                className="object-cover transition duration-500 group-hover:scale-[1.06]"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                src={note.cover_url}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          ) : (
            <div className={cn("relative aspect-[16/7] overflow-hidden", noteStyle.patternClassName)}>
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)] opacity-70" />
              <div className="absolute left-4 top-4 h-10 w-24 rounded-full bg-white/30 blur-xl dark:bg-white/10" />
              <div className="absolute right-4 top-4 rounded-2xl bg-background/70 p-3 shadow-lg backdrop-blur transition duration-300 group-hover:animate-card-orbit group-hover:scale-110">
                <StyleIcon className="h-5 w-5" />
              </div>
              <div className="absolute bottom-4 left-5 flex gap-1.5">
                <span className="h-2 w-8 rounded-full bg-white/70 shadow-sm dark:bg-white/30" />
                <span className="h-2 w-2 rounded-full bg-white/60 shadow-sm dark:bg-white/25" />
                <span className="h-2 w-2 rounded-full bg-white/50 shadow-sm dark:bg-white/20" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="relative z-0 flex min-h-[220px] flex-col gap-4 p-5 pl-6">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition group-hover:scale-105 ${mood.className}`}>
              <MoodIcon className="h-3.5 w-3.5" />
              {mood.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border bg-background/75 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur transition group-hover:bg-background/90">
              <StyleIcon className="h-3 w-3" />
              {noteStyle.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              {note.is_pinned ? <Pin className="mt-1 h-4 w-4 shrink-0 fill-amber-400 text-amber-500 transition group-hover:animate-card-pulse" /> : null}
              <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">{note.title}</h2>
            </div>
            <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-muted-foreground transition group-hover:text-foreground/75">
              {summary || "Kh\u00f4ng c\u00f3 n\u1ed9i dung"}
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex min-h-6 flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge
                  key={tag.id}
                  className="border-transparent text-white shadow-sm transition duration-300 group-hover:-translate-y-0.5"
                  style={{ backgroundColor: tag.color, transitionDelay: `${tagIndex * 45}ms` }}
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 3 ? <Badge variant="secondary">+{tags.length - 3}</Badge> : null}
            </div>
            <div className="flex items-center gap-1.5 border-t border-foreground/10 pt-3 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <time dateTime={note.updated_at}>{formatRelativeTime(note.updated_at)}</time>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </Link>
  );
}

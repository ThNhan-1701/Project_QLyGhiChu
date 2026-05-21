import Link from "next/link";
import { CalendarDays, FileText, Flame, Lightbulb, Plus, Sparkles, Tags, Wand2 } from "lucide-react";
import { SetupError } from "@/components/layout/SetupError";
import { NoteFilter } from "@/components/notes/NoteFilter";
import { NoteList } from "@/components/notes/note-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getNotes } from "@/lib/actions/notes";
import { getTags } from "@/lib/actions/tags";
import { moodOptions } from "@/lib/moods";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: {
    search?: string;
    tag?: string;
    mood?: string;
  };
};

const dailyPrompts = [
  "Hôm nay có điều gì đáng ghi lại trước khi nó trôi mất?",
  "Một ý tưởng nhỏ nào có thể giúp ngày mai dễ thở hơn?",
  "Nếu chỉ hoàn thành một việc hôm nay, đó sẽ là gì?",
  "Điều gì đang làm bạn thấy có năng lượng nhất?",
  "Có điều gì bạn muốn phiên bản tương lai của mình đọc lại?",
  "Một câu nhắc nhở ngắn cho hôm nay là gì?",
  "Bạn đang muốn biến suy nghĩ nào thành hành động?"
];

function getDailyPrompt() {
  const dayIndex = Math.floor(Date.now() / 86_400_000) % dailyPrompts.length;
  return dailyPrompts[dayIndex];
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const result = await Promise.all([getNotes(searchParams.search, searchParams.tag, searchParams.mood), getTags()])
    .then(([notes, tags]) => ({ notes, tags, error: "" }))
    .catch((error: Error) => ({ notes: [], tags: [], error: error.message }));

  if (result.error) {
    return <SetupError message={result.error} />;
  }

  const { notes, tags } = result;
  const hasFilter = Boolean(searchParams.search || searchParams.tag || searchParams.mood);
  const pinnedCount = notes.filter((note) => note.is_pinned).length;
  const ideaCount = notes.filter((note) => note.mood === "idea").length;
  const urgentCount = notes.filter((note) => note.mood === "urgent").length;
  const currentPrompt = getDailyPrompt();
  const promptHref = `/notes/new?prompt=${encodeURIComponent(currentPrompt)}`;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border bg-slate-950 p-6 text-white shadow-2xl shadow-sky-500/10 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.38),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(168,85,247,0.34),transparent_28%),linear-gradient(135deg,#020617,#111827_48%,#0f172a)]" />
        <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur sm:block">
          GenZ workspace
        </div>
        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div className="space-y-5">
            <Badge className="border-white/10 bg-white/10 text-white backdrop-blur">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Mood-driven notes
            </Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                Biến mọi suy nghĩ thành một vibe dễ nhìn.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                Ghi chú nhanh, chọn mood, đổi personality card và tìm lại ý tưởng theo cách trực quan hơn.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-white/90">
                <Link href="/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo ghi chú mới
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                <Link href={promptHref}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Viết từ prompt hôm nay
                </Link>
              </Button>
            </div>
          </div>
          <Card className="border-white/10 bg-white/10 text-white shadow-xl backdrop-blur">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-sky-200" />
                Daily prompt
              </div>
              <p className="text-lg font-semibold leading-7">{currentPrompt}</p>
              <p className="text-xs leading-5 text-slate-300">
                Một câu gợi mở nhỏ để bắt đầu ghi chú mà không cần nhìn màn hình trống quá lâu.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="overflow-hidden border-white/70 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Tổng ghi chú</p>
              <p className="text-3xl font-bold">{notes.length}</p>
            </div>
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-950 dark:text-sky-200">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-white/70 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Đã ghim</p>
              <p className="text-3xl font-bold">{pinnedCount}</p>
            </div>
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-white/70 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Ý tưởng</p>
              <p className="text-3xl font-bold">{ideaCount}</p>
            </div>
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-950 dark:text-violet-200">
              <Lightbulb className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-white/70 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Tags</p>
              <p className="text-3xl font-bold">{tags.length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              <Tags className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Vibe board</h2>
            <p className="text-sm text-muted-foreground">Lọc nhanh theo mood để xem đúng trạng thái bạn cần.</p>
          </div>
          {urgentCount > 0 ? (
            <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
              <Flame className="mr-1 h-3.5 w-3.5" />
              {urgentCount} cần xử lý
            </Badge>
          ) : null}
        </div>
        <div className="flex gap-2 overflow-x-auto rounded-2xl border bg-card/70 p-3 shadow-sm backdrop-blur">
          {moodOptions.map((mood) => {
            const Icon = mood.icon;
            const active = searchParams.mood === mood.id;
            return (
              <Link
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  active ? mood.className : "bg-background/70 hover:bg-muted"
                }`}
                href={`/dashboard?mood=${mood.id}`}
                key={mood.id}
              >
                <Icon className="h-4 w-4" />
                {mood.label}
              </Link>
            );
          })}
        </div>
      </section>

      <NoteFilter
        tags={tags}
        currentSearch={searchParams.search}
        currentTag={searchParams.tag}
        currentMood={searchParams.mood}
      />

      {notes.length === 0 && !hasFilter ? (
        <Card className="border-dashed bg-card/70 backdrop-blur">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">Chưa có ghi chú nào</h2>
              <p className="text-sm text-muted-foreground">Tạo ghi chú đầu tiên để bắt đầu xây mood board của riêng bạn.</p>
            </div>
            <Button asChild>
              <Link href="/notes/new">Tạo ghi chú mới</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
}

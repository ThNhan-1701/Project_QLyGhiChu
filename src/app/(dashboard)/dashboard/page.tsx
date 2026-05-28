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
  "H\u00f4m nay c\u00f3 \u0111i\u1ec1u g\u00ec \u0111\u00e1ng ghi l\u1ea1i tr\u01b0\u1edbc khi n\u00f3 tr\u00f4i m\u1ea5t?",
  "M\u1ed9t \u00fd t\u01b0\u1edfng nh\u1ecf n\u00e0o c\u00f3 th\u1ec3 gi\u00fap ng\u00e0y mai d\u1ec5 th\u1edf h\u01a1n?",
  "N\u1ebfu ch\u1ec9 ho\u00e0n th\u00e0nh m\u1ed9t vi\u1ec7c h\u00f4m nay, \u0111\u00f3 s\u1ebd l\u00e0 g\u00ec?",
  "\u0110i\u1ec1u g\u00ec \u0111ang l\u00e0m b\u1ea1n th\u1ea5y c\u00f3 n\u0103ng l\u01b0\u1ee3ng nh\u1ea5t?",
  "C\u00f3 \u0111i\u1ec1u g\u00ec b\u1ea1n mu\u1ed1n phi\u00ean b\u1ea3n t\u01b0\u01a1ng lai c\u1ee7a m\u00ecnh \u0111\u1ecdc l\u1ea1i?",
  "M\u1ed9t c\u00e2u nh\u1eafc nh\u1edf ng\u1eafn cho h\u00f4m nay l\u00e0 g\u00ec?",
  "B\u1ea1n \u0111ang mu\u1ed1n bi\u1ebfn suy ngh\u0129 n\u00e0o th\u00e0nh h\u00e0nh \u0111\u1ed9ng?"
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
  const statCards = [
    {
      label: "T\u1ed5ng ghi ch\u00fa",
      value: notes.length,
      icon: FileText,
      className: "from-sky-400/18 via-cyan-300/12 to-white/70 text-sky-700 dark:from-sky-400/18 dark:via-cyan-400/10 dark:to-slate-950/70 dark:text-sky-200"
    },
    {
      label: "\u0110\u00e3 ghim",
      value: pinnedCount,
      icon: Sparkles,
      className: "from-amber-300/22 via-orange-200/14 to-white/70 text-amber-700 dark:from-amber-400/18 dark:via-orange-400/10 dark:to-slate-950/70 dark:text-amber-200"
    },
    {
      label: "\u00dd t\u01b0\u1edfng",
      value: ideaCount,
      icon: Lightbulb,
      className: "from-violet-400/20 via-fuchsia-300/12 to-white/70 text-violet-700 dark:from-violet-400/18 dark:via-fuchsia-400/10 dark:to-slate-950/70 dark:text-violet-200"
    },
    {
      label: "Tags",
      value: tags.length,
      icon: Tags,
      className: "from-emerald-300/22 via-teal-200/14 to-white/70 text-emerald-700 dark:from-emerald-400/18 dark:via-teal-400/10 dark:to-slate-950/70 dark:text-emerald-200"
    }
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-sky-500/15 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.42),transparent_30%),radial-gradient(circle_at_82%_4%,rgba(217,70,239,0.32),transparent_28%),radial-gradient(circle_at_70%_86%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,#020617,#111827_48%,#0f172a)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:34px_34px] opacity-35" />
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium shadow-lg backdrop-blur sm:block">
          GenZ workspace
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="space-y-6">
            <Badge className="border-white/10 bg-white/10 text-white shadow-lg backdrop-blur">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Mood-driven notes
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">
                Bi&#7871;n m&#7885;i suy ngh&#297; th&#224;nh m&#7897;t vibe d&#7877; nh&#236;n.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                Ghi ch&#250; nhanh, ch&#7885;n mood, &#273;&#7893;i personality card v&#224; t&#236;m l&#7841;i &#253; t&#432;&#7903;ng theo c&#225;ch tr&#7921;c quan h&#417;n.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-950 shadow-xl shadow-white/10 hover:bg-white/90">
                <Link href="/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  T&#7841;o ghi ch&#250; m&#7899;i
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white shadow-xl shadow-sky-500/10 hover:bg-white/15 hover:text-white">
                <Link href={promptHref}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Vi&#7871;t t&#7915; prompt h&#244;m nay
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/10 text-white shadow-2xl shadow-black/20 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays className="h-4 w-4 text-sky-200" />
                  Daily prompt
                </div>
                <p className="text-lg font-semibold leading-7">{currentPrompt}</p>
                <p className="text-xs leading-5 text-slate-300">
                  M&#7897;t c&#226;u g&#7907;i m&#7903; nh&#7887; &#273;&#7875; b&#7855;t &#273;&#7847;u ghi ch&#250; m&#224; kh&#244;ng c&#7847;n nh&#236;n m&#224;n h&#236;nh tr&#7889;ng qu&#225; l&#226;u.
                </p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">Mood</div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">Style</div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">Tags</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card className={`overflow-hidden border-white/70 bg-gradient-to-br ${stat.className} shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:shadow-black/20`} key={stat.label}>
              <CardContent className="relative flex items-center justify-between p-5">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/35 blur-2xl dark:bg-white/10" />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3 shadow-lg backdrop-blur dark:bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-3 rounded-[1.5rem] border bg-card/60 p-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Vibe board</h2>
            <p className="text-sm text-muted-foreground">L&#7885;c nhanh theo mood &#273;&#7875; xem &#273;&#250;ng tr&#7841;ng th&#225;i b&#7841;n c&#7847;n.</p>
          </div>
          {urgentCount > 0 ? (
            <Badge className="bg-rose-100 text-rose-700 shadow-sm dark:bg-rose-950 dark:text-rose-200">
              <Flame className="mr-1 h-3.5 w-3.5" />
              {urgentCount} c&#7847;n x&#7917; l&#253;
            </Badge>
          ) : null}
        </div>
        <div className="flex gap-2 overflow-x-auto rounded-2xl border bg-background/55 p-3 shadow-inner backdrop-blur">
          {moodOptions.map((mood) => {
            const Icon = mood.icon;
            const active = searchParams.mood === mood.id;
            return (
              <Link
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  active ? mood.className : "bg-background/80 hover:bg-muted"
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
              <h2 className="font-semibold">Ch&#432;a c&#243; ghi ch&#250; n&#224;o</h2>
              <p className="text-sm text-muted-foreground">T&#7841;o ghi ch&#250; &#273;&#7847;u ti&#234;n &#273;&#7875; b&#7855;t &#273;&#7847;u x&#226;y mood board c&#7911;a ri&#234;ng b&#7841;n.</p>
            </div>
            <Button asChild>
              <Link href="/notes/new">T&#7841;o ghi ch&#250; m&#7899;i</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
}

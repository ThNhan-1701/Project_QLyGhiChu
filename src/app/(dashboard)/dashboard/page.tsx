import Link from "next/link";
import { FileText, Plus, Sparkles } from "lucide-react";
import { SetupError } from "@/components/layout/SetupError";
import { NoteFilter } from "@/components/notes/NoteFilter";
import { NoteList } from "@/components/notes/note-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getNotes } from "@/lib/actions/notes";
import { getTags } from "@/lib/actions/tags";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: {
    search?: string;
    tag?: string;
    mood?: string;
  };
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const result = await Promise.all([getNotes(searchParams.search, searchParams.tag, searchParams.mood), getTags()])
    .then(([notes, tags]) => ({ notes, tags, error: "" }))
    .catch((error: Error) => ({ notes: [], tags: [], error: error.message }));

  if (result.error) {
    return <SetupError message={result.error} />;
  }

  const { notes, tags } = result;
  const hasFilter = Boolean(searchParams.search || searchParams.tag || searchParams.mood);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">Ghi chú của tôi</h1>
            <Badge className="bg-secondary text-secondary-foreground">{notes.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Lưu, tìm và sắp xếp ghi chú cá nhân của bạn.</p>
        </div>
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            Tạo ghi chú mới
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Không gian ghi chú tập trung</p>
              <p className="text-sm text-muted-foreground">Ghim nội dung quan trọng, lọc theo tag và theo dõi cập nhật theo thời gian thực.</p>
            </div>
          </div>
        </div>
      </div>
      <NoteFilter
        tags={tags}
        currentSearch={searchParams.search}
        currentTag={searchParams.tag}
        currentMood={searchParams.mood}
      />
      {notes.length === 0 && !hasFilter ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">Chưa có ghi chú nào</h2>
              <p className="text-sm text-muted-foreground">Tạo ghi chú đầu tiên để bắt đầu quản lý ý tưởng.</p>
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

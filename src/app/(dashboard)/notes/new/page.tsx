"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ClipboardList, ImagePlus, Lightbulb, NotebookTabs, Sparkles, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createNote } from "@/lib/actions/notes";
import { getTags } from "@/lib/actions/tags";
import { createClient } from "@/lib/supabase/client";
import type { NoteMood, NoteStyle, Tag } from "@/lib/types";
import { uploadCoverImage } from "@/lib/utils";
import { MoodSelector } from "@/components/notes/MoodSelector";
import { StyleSelector } from "@/components/notes/StyleSelector";
import { TagSelector } from "@/components/notes/TagSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const draftKey = "noteapp:new-note-draft";

const noteTemplates = [
  {
    name: "Nh\u1eadt k\u00fd",
    icon: NotebookTabs,
    title: "Nh\u1eadt k\u00fd ng\u00e0y m\u1edbi",
    content:
      "H\u00f4m nay m\u00ecnh mu\u1ed1n ghi l\u1ea1i:\n\n\u0110i\u1ec1u n\u1ed5i b\u1eadt nh\u1ea5t:\n\n\u0110i\u1ec1u m\u00ecnh h\u1ecdc \u0111\u01b0\u1ee3c:\n\nVi\u1ec7c c\u1ea7n l\u00e0m ti\u1ebfp theo:\n"
  },
  {
    name: "Cu\u1ed9c h\u1ecdp",
    icon: ClipboardList,
    title: "Ghi ch\u00fa cu\u1ed9c h\u1ecdp",
    content:
      "M\u1ee5c ti\u00eau cu\u1ed9c h\u1ecdp:\n\nNg\u01b0\u1eddi tham gia:\n\nN\u1ed9i dung ch\u00ednh:\n- \n\nQuy\u1ebft \u0111\u1ecbnh:\n- \n\nVi\u1ec7c c\u1ea7n l\u00e0m:\n- [ ] \n"
  },
  {
    name: "\u00dd t\u01b0\u1edfng",
    icon: Lightbulb,
    title: "\u00dd t\u01b0\u1edfng m\u1edbi",
    content:
      "V\u1ea5n \u0111\u1ec1 c\u1ea7n gi\u1ea3i quy\u1ebft:\n\n\u00dd t\u01b0\u1edfng ch\u00ednh:\n\nL\u1ee3i \u00edch:\n\nR\u1ee7i ro ho\u1eb7c \u0111i\u1ec3m c\u1ea7n ki\u1ec3m ch\u1ee9ng:\n\nB\u01b0\u1edbc th\u1eed nghi\u1ec7m \u0111\u1ea7u ti\u00ean:\n"
  },
  {
    name: "Checklist",
    icon: Sparkles,
    title: "Danh s\u00e1ch vi\u1ec7c c\u1ea7n l\u00e0m",
    content: "- [ ] Vi\u1ec7c quan tr\u1ecdng nh\u1ea5t\n- [ ] Vi\u1ec7c ti\u1ebfp theo\n- [ ] Ki\u1ec3m tra k\u1ebft qu\u1ea3\n"
  }
];

type NoteDraft = {
  title: string;
  content: string;
  mood: NoteMood;
  noteStyle: NoteStyle;
  isPinned: boolean;
  selectedTagIds: string[];
};

type NewNotePageProps = {
  searchParams?: {
    prompt?: string;
  };
};

export default function NewNotePage({ searchParams }: NewNotePageProps) {
  const router = useRouter();
  const promptFromUrl = searchParams?.prompt?.trim() ?? "";
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<NoteMood>("focus");
  const [noteStyle, setNoteStyle] = useState<NoteStyle>("classic");
  const [isPinned, setIsPinned] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const hasDraftContent = useMemo(
    () =>
      title.trim().length > 0 ||
      content.trim().length > 0 ||
      selectedTagIds.length > 0 ||
      isPinned ||
      mood !== "focus" ||
      noteStyle !== "classic",
    [content, isPinned, mood, noteStyle, selectedTagIds.length, title]
  );

  function applyPromptToNote(prompt: string, shouldConfirm = true) {
    if (!prompt) return;

    if (shouldConfirm && (title.trim() || content.trim())) {
      const shouldReplace = window.confirm("Prompt h\u00f4m nay s\u1ebd thay th\u1ebf ti\u00eau \u0111\u1ec1 v\u00e0 n\u1ed9i dung hi\u1ec7n t\u1ea1i. Ti\u1ebfp t\u1ee5c?");
      if (!shouldReplace) return;
    }

    setTitle("Vi\u1ebft t\u1eeb prompt h\u00f4m nay");
    setContent(`Prompt h\u00f4m nay:\n${prompt}\n\nC\u00e2u tr\u1ea3 l\u1eddi c\u1ee7a m\u00ecnh:\n\n- `);
    setMood("idea");
    setNoteStyle("paper");
    toast.success("\u0110\u00e3 \u0111\u01b0a prompt h\u00f4m nay v\u00e0o ghi ch\u00fa");
  }

  useEffect(() => {
    getTags().then(setTags).catch((error: Error) => toast.error(error.message));
  }, []);

  useEffect(() => {
    const rawDraft = window.localStorage.getItem(draftKey);
    if (!rawDraft) {
      if (promptFromUrl) {
        setTitle("Vi\u1ebft t\u1eeb prompt h\u00f4m nay");
        setContent(`Prompt h\u00f4m nay:\n${promptFromUrl}\n\nC\u00e2u tr\u1ea3 l\u1eddi c\u1ee7a m\u00ecnh:\n\n- `);
        setMood("idea");
        setNoteStyle("paper");
        toast.success("\u0110\u00e3 \u0111\u01b0a prompt h\u00f4m nay v\u00e0o ghi ch\u00fa");
      }
      setHasLoadedDraft(true);
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as Partial<NoteDraft>;
      setTitle(draft.title ?? "");
      setContent(draft.content ?? "");
      setMood(draft.mood ?? "focus");
      setNoteStyle(draft.noteStyle ?? "classic");
      setIsPinned(draft.isPinned ?? false);
      setSelectedTagIds(draft.selectedTagIds ?? []);
      setHasRestoredDraft(true);
      toast.info("\u0110\u00e3 kh\u00f4i ph\u1ee5c b\u1ea3n nh\u00e1p \u0111ang vi\u1ebft");
    } catch {
      window.localStorage.removeItem(draftKey);
    } finally {
      setHasLoadedDraft(true);
    }
  }, [promptFromUrl]);

  useEffect(() => {
    if (!hasLoadedDraft) return;

    const timer = window.setTimeout(() => {
      if (!hasDraftContent) {
        window.localStorage.removeItem(draftKey);
        return;
      }

      const draft: NoteDraft = {
        title,
        content,
        mood,
        noteStyle,
        isPinned,
        selectedTagIds
      };
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [content, hasDraftContent, hasLoadedDraft, isPinned, mood, noteStyle, selectedTagIds, title]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : "");
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
    );
  }

  function applyTemplate(template: (typeof noteTemplates)[number]) {
    if (title.trim() || content.trim()) {
      const shouldReplace = window.confirm("M\u1eabu n\u00e0y s\u1ebd thay th\u1ebf ti\u00eau \u0111\u1ec1 v\u00e0 n\u1ed9i dung hi\u1ec7n t\u1ea1i. Ti\u1ebfp t\u1ee5c?");
      if (!shouldReplace) return;
    }

    setTitle(template.title);
    setContent(template.content);
    toast.success(`\u0110\u00e3 \u00e1p d\u1ee5ng m\u1eabu ${template.name}`);
  }

  function clearDraft() {
    setTitle("");
    setContent("");
    setMood("focus");
    setNoteStyle("classic");
    setIsPinned(false);
    setSelectedTagIds([]);
    setCoverFile(null);
    setCoverPreview("");
    setHasRestoredDraft(false);
    window.localStorage.removeItem(draftKey);
    toast.success("\u0110\u00e3 x\u00f3a b\u1ea3n nh\u00e1p");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("Ti\u00eau \u0111\u1ec1 kh\u00f4ng \u0111\u01b0\u1ee3c \u0111\u1ec3 tr\u1ed1ng");
      return;
    }

    setIsLoading(true);
    try {
      let coverUrl: string | undefined;
      if (coverFile) {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error("B\u1ea1n c\u1ea7n \u0111\u0103ng nh\u1eadp \u0111\u1ec3 t\u1ea3i \u1ea3nh");
        coverUrl = await uploadCoverImage(coverFile, data.user.id);
      }

      await createNote({ title, content, mood, note_style: noteStyle, is_pinned: isPinned, tag_ids: selectedTagIds }, coverUrl);
      window.localStorage.removeItem(draftKey);
      toast.success("T\u1ea1o ghi ch\u00fa th\u00e0nh c\u00f4ng");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kh\u00f4ng th\u1ec3 t\u1ea1o ghi ch\u00fa");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mx-auto max-w-3xl space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">T&#7841;o ghi ch&#250; m&#7899;i</h1>
          <p className="text-sm text-muted-foreground">
            Ch&#7885;n m&#7851;u nhanh, vi&#7871;t n&#7897;i dung v&#224; b&#7843;n nh&#225;p s&#7869; t&#7921; l&#432;u trong tr&#236;nh duy&#7879;t.
          </p>
        </div>
        {hasDraftContent ? (
          <Button type="button" variant="outline" onClick={clearDraft}>
            <X className="mr-2 h-4 w-4" />
            X&#243;a b&#7843;n nh&#225;p
          </Button>
        ) : null}
      </div>

      {promptFromUrl ? (
        <Card className="overflow-hidden border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.96),rgba(236,254,255,0.88))] shadow-lg shadow-amber-100/70 dark:border-amber-800/60 dark:bg-[linear-gradient(135deg,rgba(69,26,3,0.55),rgba(15,23,42,0.92))]">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                  <Wand2 className="h-3.5 w-3.5" />
                  Prompt h&#244;m nay
                </div>
                <p className="text-base font-semibold leading-7">{promptFromUrl}</p>
                {hasRestoredDraft ? (
                  <p className="text-xs text-muted-foreground">
                    B&#7841;n &#273;ang c&#243; b&#7843;n nh&#225;p c&#361;. Prompt ch&#432;a t&#7921; ghi &#273;&#232; &#273;&#7875; tr&#225;nh m&#7845;t n&#7897;i dung.
                  </p>
                ) : null}
              </div>
              <Button type="button" variant="outline" onClick={() => applyPromptToNote(promptFromUrl)}>
                <Wand2 className="mr-2 h-4 w-4" />
                &#193;p d&#7909;ng prompt
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <Label>M&#7851;u ghi ch&#250; nhanh</Label>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {noteTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    className="flex items-center gap-2 rounded-xl border bg-background/70 p-3 text-left text-sm transition hover:border-primary/60 hover:bg-primary/5"
                    key={template.name}
                    type="button"
                    onClick={() => applyTemplate(template)}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Ti&#234;u &#273;&#7873;</Label>
            <Input
              id="title"
              required
              placeholder="V&#237; d&#7909;: &#221; t&#432;&#7903;ng s&#7843;n ph&#7849;m tu&#7847;n n&#224;y"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">N&#7897;i dung</Label>
            <Textarea
              id="content"
              className="min-h-[240px]"
              placeholder="Vi&#7871;t ghi ch&#250; c&#7911;a b&#7841;n..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {hasDraftContent ? "B\u1ea3n nh\u00e1p \u0111ang \u0111\u01b0\u1ee3c t\u1ef1 l\u01b0u." : "B\u1eaft \u0111\u1ea7u vi\u1ebft \u0111\u1ec3 t\u1ea1o b\u1ea3n nh\u00e1p t\u1ef1 \u0111\u1ed9ng."}
            </p>
          </div>
          <MoodSelector value={mood} onChange={setMood} />
          <StyleSelector value={noteStyle} onChange={setNoteStyle} />
          <div className="space-y-3">
            <Label>&#7842;nh b&#236;a</Label>
            <input id="cover" className="hidden" type="file" accept="image/*" onChange={handleCoverChange} />
            <div className="flex gap-2">
              <Button asChild type="button" variant="outline">
                <label htmlFor="cover" className="cursor-pointer">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Ch&#7885;n &#7843;nh b&#236;a
                </label>
              </Button>
              {coverPreview ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview("");
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  X&#243;a
                </Button>
              ) : null}
            </div>
            {coverPreview ? (
              <div className="relative aspect-video overflow-hidden rounded-md border">
                <Image alt="Preview" className="object-cover" fill src={coverPreview} />
              </div>
            ) : null}
          </div>
          <TagSelector tags={tags} selectedTagIds={selectedTagIds} onTagsChange={setTags} onToggleTag={toggleTag} />
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={isPinned} onCheckedChange={(checked) => setIsPinned(checked === true)} />
            Ghim ghi ch&#250;
          </label>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          H&#7911;y
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "\u0110ang t\u1ea1o..." : "T\u1ea1o ghi ch\u00fa"}
        </Button>
      </div>
    </form>
  );
}

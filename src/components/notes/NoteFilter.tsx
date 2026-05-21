"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tag } from "@/lib/types";

type NoteFilterProps = {
  tags: Tag[];
  currentSearch?: string;
  currentTag?: string;
};

export function NoteFilter({ tags, currentSearch, currentTag }: NoteFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      router.push(`/dashboard?${params.toString()}`);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [router, search, searchParams]);

  function updateTag(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tag");
    else params.set("tag", value);
    router.push(`/dashboard?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    router.push("/dashboard");
  }

  const hasFilter = Boolean(currentSearch || currentTag);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card/80 p-3 shadow-sm backdrop-blur sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Tìm theo tiêu đề..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <Select value={currentTag ?? "all"} onValueChange={updateTag}>
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Lọc theo tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tag</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilter ? (
        <Button variant="outline" type="button" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Xóa bộ lọc
        </Button>
      ) : null}
    </div>
  );
}

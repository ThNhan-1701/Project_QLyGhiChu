"use client";

import { LogOut, Menu, Moon, NotebookPen, Plus, Sun, Tags } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
  email: string;
};

export function Navbar({ email }: NavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 px-4 py-3 shadow-sm shadow-slate-200/40 backdrop-blur-2xl dark:shadow-black/20 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link className="flex items-center gap-3 font-semibold" href="/dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-sky-500/20">
            <NotebookPen className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base">NoteApp</span>
            <span className="hidden text-xs font-normal text-muted-foreground sm:block">Mood board ghi chú cá nhân</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              Ghi chú mới
            </Link>
          </Button>
          <Button
            aria-label="Đổi giao diện"
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <span className="hidden max-w-48 truncate text-sm text-muted-foreground lg:inline">{email}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Menu tài khoản" size="icon" variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link className="gap-2" href="/tags">
                  <Tags className="h-4 w-4" />
                  Quản lý Tags
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="gap-2 sm:hidden" href="/notes/new">
                  <Plus className="h-4 w-4" />
                  Ghi chú mới
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

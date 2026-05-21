"use client";

import { LogOut, Menu, Moon, NotebookPen, Sun, Tags } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b bg-background/75 px-6 py-3 shadow-sm shadow-slate-200/40 backdrop-blur-xl dark:shadow-black/20">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link className="flex items-center gap-3 font-semibold" href="/dashboard">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <NotebookPen className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block">NoteApp</span>
            <span className="hidden text-xs font-normal text-muted-foreground sm:block">Ghi chú cá nhân</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
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
          <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">{email}</span>
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

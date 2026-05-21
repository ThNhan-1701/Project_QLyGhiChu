"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotebookPen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function getSignInErrorMessage(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email ho\u1eb7c m\u1eadt kh\u1ea9u ch\u01b0a \u0111\u00fang. Vui l\u00f2ng ki\u1ec3m tra l\u1ea1i.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "T\u00e0i kho\u1ea3n ch\u01b0a x\u00e1c nh\u1eadn email. H\u00e3y ki\u1ec3m tra h\u1ed9p th\u01b0 tr\u01b0\u1edbc khi \u0111\u0103ng nh\u1eadp.";
  }

  if (normalizedMessage.includes("rate limit")) {
    return "B\u1ea1n thao t\u00e1c h\u01a1i nhanh. Vui l\u00f2ng th\u1eed l\u1ea1i sau \u00edt ph\u00fat.";
  }

  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 email v\u00e0 m\u1eadt kh\u1ea9u.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);
    if (signInError) {
      setError(getSignInErrorMessage(signInError.message));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(244,114,182,0.24),transparent_26%),linear-gradient(135deg,#fff7ed_0%,#f8fafc_42%,#ecfeff_100%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(244,114,182,0.14),transparent_26%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#042f2e_100%)]" />
      <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-2xl shadow-slate-200/80 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/30">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <NotebookPen className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Mood board ghi ch&#250;
            </div>
            <CardTitle>&#272;&#259;ng nh&#7853;p</CardTitle>
            <CardDescription>Truy c&#7853;p kh&#244;ng gian ghi ch&#250; c&#225; nh&#226;n c&#7911;a b&#7841;n.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" required type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">M&#7853;t kh&#7849;u</Label>
              <Input id="password" name="password" required type="password" />
            </div>
            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "\u0110ang \u0111\u0103ng nh\u1eadp..." : "\u0110\u0103ng nh\u1eadp"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Ch&#432;a c&#243; t&#224;i kho&#7843;n?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/register">
              &#272;&#259;ng k&#253;
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

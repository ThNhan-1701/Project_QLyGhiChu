"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function getSignUpErrorMessage(message: string, code?: string): string {
  const normalizedMessage = message.toLowerCase();

  if (code === "over_email_send_rate_limit" || normalizedMessage.includes("rate limit")) {
    return "Supabase đang giới hạn gửi email xác nhận. Vui lòng thử lại sau ít phút hoặc tắt Confirm email trong Supabase Auth khi test local.";
  }

  if (normalizedMessage.includes("invalid")) {
    return "Email hoặc mật khẩu không hợp lệ.";
  }

  if (normalizedMessage.includes("already")) {
    return "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.";
  }

  return message;
}

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin đăng ký.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    setIsLoading(false);

    if (signUpError) {
      setError(getSignUpErrorMessage(signUpError.message, signUpError.code));
      return;
    }

    setMessage("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(244,114,182,0.24),transparent_26%),linear-gradient(135deg,#fff7ed_0%,#f8fafc_42%,#ecfeff_100%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(244,114,182,0.14),transparent_26%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#042f2e_100%)]" />
      <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-2xl shadow-slate-200/80 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/30">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Tạo vibe ghi chú mới
            </div>
            <CardTitle>Đăng ký</CardTitle>
            <CardDescription>Tạo tài khoản để bắt đầu lưu ghi chú.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" required type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" required type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" name="confirmPassword" required type="password" />
            </div>
            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                {message}
              </p>
            ) : null}
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

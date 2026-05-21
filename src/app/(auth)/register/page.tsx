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
  if (code === "over_email_send_rate_limit" || message.toLowerCase().includes("rate limit")) {
    return "Supabase đang giới hạn gửi email xác nhận. Vui lòng thử lại sau ít phút hoặc tắt Confirm email trong Supabase Auth khi test local.";
  }

  if (message.toLowerCase().includes("invalid")) {
    return "Email hoặc mật khẩu không hợp lệ.";
  }

  if (message.toLowerCase().includes("already")) {
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
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
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
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-white/70 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/30">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-sm">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-1">
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
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
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

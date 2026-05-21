"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { MailCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function getSignUpErrorMessage(message: string, code?: string): string {
  const normalizedMessage = message.toLowerCase();

  if (code === "over_email_send_rate_limit" || normalizedMessage.includes("rate limit")) {
    return "Supabase \u0111ang gi\u1edbi h\u1ea1n g\u1eedi email x\u00e1c nh\u1eadn. Vui l\u00f2ng th\u1eed l\u1ea1i sau \u00edt ph\u00fat.";
  }

  if (normalizedMessage.includes("invalid")) {
    return "Email ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng h\u1ee3p l\u1ec7.";
  }

  if (normalizedMessage.includes("already")) {
    return "Email n\u00e0y \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u0103ng k\u00fd. H\u00e3y \u0111\u0103ng nh\u1eadp ho\u1eb7c d\u00f9ng email kh\u00e1c.";
  }

  return message;
}

function getRedirectUrl() {
  return `${window.location.origin}/login`;
}

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [lastEmail, setLastEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
      setError("Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin \u0111\u0103ng k\u00fd.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("M\u1eadt kh\u1ea9u ph\u1ea3i c\u00f3 \u00edt nh\u1ea5t 6 k\u00fd t\u1ef1.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("M\u1eadt kh\u1ea9u x\u00e1c nh\u1eadn kh\u00f4ng kh\u1edbp.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl()
      }
    });
    setIsLoading(false);

    if (signUpError) {
      setError(getSignUpErrorMessage(signUpError.message, signUpError.code));
      return;
    }

    setLastEmail(email);
    setMessage("T\u1ea1o t\u00e0i kho\u1ea3n th\u00e0nh c\u00f4ng. H\u00e3y ki\u1ec3m tra Inbox ho\u1eb7c Spam \u0111\u1ec3 x\u00e1c nh\u1eadn email.");
  }

  async function handleResendConfirmation() {
    if (!lastEmail) {
      setError("H\u00e3y nh\u1eadp v\u00e0 \u0111\u0103ng k\u00fd email tr\u01b0\u1edbc khi g\u1eedi l\u1ea1i x\u00e1c nh\u1eadn.");
      return;
    }

    setError("");
    setMessage("");
    setIsResending(true);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: lastEmail,
      options: {
        emailRedirectTo: getRedirectUrl()
      }
    });

    setIsResending(false);

    if (resendError) {
      setError(getSignUpErrorMessage(resendError.message, resendError.code));
      return;
    }

    setMessage("Email x\u00e1c nh\u1eadn \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi l\u1ea1i. H\u00e3y ki\u1ec3m tra Inbox ho\u1eb7c Spam.");
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
              T&#7841;o vibe ghi ch&#250; m&#7899;i
            </div>
            <CardTitle>&#272;&#259;ng k&#253;</CardTitle>
            <CardDescription>T&#7841;o t&#224;i kho&#7843;n &#273;&#7875; b&#7855;t &#273;&#7847;u l&#432;u ghi ch&#250;.</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">X&#225;c nh&#7853;n m&#7853;t kh&#7849;u</Label>
              <Input id="confirmPassword" name="confirmPassword" required type="password" />
            </div>
            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            {message ? (
              <div className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                <div className="flex items-start gap-2">
                  <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{message}</p>
                </div>
                {lastEmail ? (
                  <Button
                    className="w-full border-emerald-500/30 bg-white/70 text-emerald-700 hover:bg-white dark:bg-emerald-950/30 dark:text-emerald-200"
                    disabled={isResending}
                    onClick={handleResendConfirmation}
                    type="button"
                    variant="outline"
                  >
                    {isResending ? "Đang gửi lại..." : "Gửi lại email xác nhận"}
                  </Button>
                ) : null}
              </div>
            ) : null}
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "\u0110ang t\u1ea1o t\u00e0i kho\u1ea3n..." : "T\u1ea1o t\u00e0i kho\u1ea3n"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            &#272;&#227; c&#243; t&#224;i kho&#7843;n?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
              &#272;&#259;ng nh&#7853;p
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

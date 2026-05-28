import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="app-shell min-h-screen bg-background">
      <Navbar email={user.email ?? ""} />
      <main className="page-enter mx-auto w-full max-w-7xl px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}

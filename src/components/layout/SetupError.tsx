import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type SetupErrorProps = {
  message: string;
};

export function SetupError({ message }: SetupErrorProps) {
  return (
    <Card className="border-destructive/40">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="h-5 w-5" />
          Supabase chưa được khởi tạo schema
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">
          Hãy mở Supabase Dashboard, vào SQL Editor và chạy nội dung trong file{" "}
          <span className="font-mono text-foreground">supabase/schema.sql</span>. Sau đó tạo Storage bucket{" "}
          <span className="font-mono text-foreground">note-covers</span> và bật Public.
        </p>
      </CardContent>
    </Card>
  );
}

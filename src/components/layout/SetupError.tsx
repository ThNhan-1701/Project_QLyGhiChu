import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type SetupErrorProps = {
  message: string;
};

function getSetupErrorCopy(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("jwt issued at future")) {
    return {
      title: "Supabase anon key chưa hợp lệ",
      description:
        "Anon key đang có thời điểm phát hành ở tương lai so với Supabase, nên request bị từ chối trước khi truy cập dữ liệu.",
      help:
        "Hãy vào Supabase Dashboard > Project Settings > API, lấy lại anon public key hiện tại và cập nhật NEXT_PUBLIC_SUPABASE_ANON_KEY trong file .env.local. Sau đó khởi động lại ứng dụng."
    };
  }

  return {
    title: "Supabase chưa được khởi tạo schema",
    description: message,
    help:
      "Hãy mở Supabase Dashboard, vào SQL Editor và chạy nội dung trong file supabase/schema.sql. Sau đó tạo Storage bucket note-covers và bật Public."
  };
}

export function SetupError({ message }: SetupErrorProps) {
  const copy = getSetupErrorCopy(message);

  return (
    <Card className="border-destructive/40">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="h-5 w-5" />
          {copy.title}
        </div>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        {copy.description !== message ? <p className="text-sm text-muted-foreground">Chi tiết lỗi: {message}</p> : null}
      </CardContent>
    </Card>
  );
}

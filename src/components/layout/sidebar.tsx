import { FileText, Plus } from "lucide-react";
import Link from "next/link";

const items = [
  {
    href: "/",
    label: "Danh sách",
    icon: FileText
  },
  {
    href: "/notes/new",
    label: "Tạo mới",
    icon: Plus
  }
];

export function Sidebar() {
  return (
    <aside className="hidden border-r px-4 py-6 md:block">
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

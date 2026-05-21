import {
  AlertTriangle,
  Award,
  Brain,
  CheckCircle2,
  Flame,
  Lightbulb,
  Smile,
  Waves
} from "lucide-react";
import type { NoteMood } from "@/lib/types";

export type MoodOption = {
  id: NoteMood;
  label: string;
  description: string;
  className: string;
  icon: typeof Brain;
};

export const moodOptions: MoodOption[] = [
  {
    id: "focus",
    label: "Tập trung",
    description: "Đang cần đào sâu",
    className: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800",
    icon: Brain
  },
  {
    id: "happy",
    label: "Vui vẻ",
    description: "Một ghi chú nhẹ nhàng",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    icon: Smile
  },
  {
    id: "idea",
    label: "Ý tưởng",
    description: "Có gì đó vừa lóe lên",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
    icon: Lightbulb
  },
  {
    id: "urgent",
    label: "Cần xử lý",
    description: "Không nên để trôi",
    className: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
    icon: Flame
  },
  {
    id: "calm",
    label: "Bình tĩnh",
    description: "Suy nghĩ chậm lại",
    className: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-800",
    icon: Waves
  },
  {
    id: "win",
    label: "Thành tựu",
    description: "Một điều đáng ghi nhận",
    className: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800",
    icon: Award
  },
  {
    id: "messy",
    label: "Rối não",
    description: "Cần gỡ từng chút",
    className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
    icon: AlertTriangle
  },
  {
    id: "important",
    label: "Quan trọng",
    description: "Đáng quay lại sau",
    className: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800",
    icon: CheckCircle2
  }
];

export function getMoodOption(mood: NoteMood | null | undefined): MoodOption {
  return moodOptions.find((option) => option.id === mood) ?? moodOptions[0];
}

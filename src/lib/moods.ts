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
    label: "T\u1eadp trung",
    description: "\u0110ang c\u1ea7n \u0111\u00e0o s\u00e2u",
    className: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800",
    icon: Brain
  },
  {
    id: "happy",
    label: "Vui v\u1ebb",
    description: "M\u1ed9t ghi ch\u00fa nh\u1eb9 nh\u00e0ng",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    icon: Smile
  },
  {
    id: "idea",
    label: "\u00dd t\u01b0\u1edfng",
    description: "C\u00f3 g\u00ec \u0111\u00f3 v\u1eeba l\u00f3e l\u00ean",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
    icon: Lightbulb
  },
  {
    id: "urgent",
    label: "C\u1ea7n x\u1eed l\u00fd",
    description: "Kh\u00f4ng n\u00ean \u0111\u1ec3 tr\u00f4i",
    className: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
    icon: Flame
  },
  {
    id: "calm",
    label: "B\u00ecnh t\u0129nh",
    description: "Suy ngh\u0129 ch\u1eadm l\u1ea1i",
    className: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-800",
    icon: Waves
  },
  {
    id: "win",
    label: "Th\u00e0nh t\u1ef1u",
    description: "M\u1ed9t \u0111i\u1ec1u \u0111\u00e1ng ghi nh\u1eadn",
    className: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800",
    icon: Award
  },
  {
    id: "messy",
    label: "R\u1ed1i n\u00e3o",
    description: "C\u1ea7n g\u1ee1 t\u1eebng ch\u00fat",
    className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
    icon: AlertTriangle
  },
  {
    id: "important",
    label: "Quan tr\u1ecdng",
    description: "\u0110\u00e1ng quay l\u1ea1i sau",
    className: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800",
    icon: CheckCircle2
  }
];

export function getMoodOption(mood: NoteMood | null | undefined): MoodOption {
  return moodOptions.find((option) => option.id === mood) ?? moodOptions[0];
}

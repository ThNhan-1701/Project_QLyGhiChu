import { CircleDot, FileText, Flower2, ScanLine, Zap } from "lucide-react";
import type { NoteStyle } from "@/lib/types";

export type NoteStyleOption = {
  id: NoteStyle;
  label: string;
  description: string;
  cardClassName: string;
  detailClassName: string;
  previewClassName: string;
  icon: typeof FileText;
};

export const noteStyleOptions: NoteStyleOption[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Sạch, rõ, dễ đọc",
    cardClassName: "border-white/70 bg-white/85 dark:border-white/10 dark:bg-card/90",
    detailClassName: "rounded-2xl border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20",
    previewClassName: "bg-white",
    icon: FileText
  },
  {
    id: "neon",
    label: "Neon",
    description: "Nổi bật, nhiều năng lượng",
    cardClassName: "border-cyan-300/70 bg-slate-950 text-white shadow-cyan-500/20 dark:border-cyan-400/60",
    detailClassName: "rounded-2xl border border-cyan-300/70 bg-slate-950 p-6 text-white shadow-xl shadow-cyan-500/20",
    previewClassName: "bg-slate-950 ring-2 ring-cyan-300",
    icon: Zap
  },
  {
    id: "calm",
    label: "Calm",
    description: "Dịu, nhẹ, thư thái",
    cardClassName: "border-teal-200/80 bg-teal-50/90 dark:border-teal-800/70 dark:bg-teal-950/50",
    detailClassName: "rounded-2xl border border-teal-200/80 bg-teal-50/90 p-6 shadow-lg shadow-teal-100/60 dark:border-teal-800/70 dark:bg-teal-950/50 dark:shadow-black/20",
    previewClassName: "bg-teal-100",
    icon: Flower2
  },
  {
    id: "paper",
    label: "Paper",
    description: "Cảm giác giấy ghi chú",
    cardClassName: "border-amber-200 bg-amber-50/95 shadow-amber-100/70 dark:border-amber-800/70 dark:bg-amber-950/40",
    detailClassName: "rounded-2xl border border-amber-200 bg-amber-50/95 p-6 shadow-lg shadow-amber-100/70 dark:border-amber-800/70 dark:bg-amber-950/40 dark:shadow-black/20",
    previewClassName: "bg-amber-100",
    icon: ScanLine
  },
  {
    id: "focus",
    label: "Focus",
    description: "Tối giản, ít nhiễu",
    cardClassName: "border-slate-300 bg-slate-100/95 dark:border-slate-700 dark:bg-slate-900",
    detailClassName: "rounded-2xl border border-slate-300 bg-slate-100/95 p-6 shadow-lg shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20",
    previewClassName: "bg-slate-200",
    icon: CircleDot
  }
];

export function getNoteStyleOption(style: NoteStyle | null | undefined): NoteStyleOption {
  return noteStyleOptions.find((option) => option.id === style) ?? noteStyleOptions[0];
}

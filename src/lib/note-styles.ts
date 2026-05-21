import { CircleDot, FileText, Flower2, ScanLine, Zap } from "lucide-react";
import type { NoteStyle } from "@/lib/types";

export type NoteStyleOption = {
  id: NoteStyle;
  label: string;
  description: string;
  cardClassName: string;
  detailClassName: string;
  previewClassName: string;
  accentClassName: string;
  patternClassName: string;
  icon: typeof FileText;
};

export const noteStyleOptions: NoteStyleOption[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Sạch, rõ, dễ đọc",
    cardClassName: "border-white/80 bg-white/90 shadow-slate-200/80 dark:border-white/10 dark:bg-card/90 dark:shadow-black/25",
    detailClassName: "rounded-2xl border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20",
    previewClassName: "bg-white",
    accentClassName: "bg-slate-300 dark:bg-slate-600",
    patternClassName: "bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,245,249,0.92))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))]",
    icon: FileText
  },
  {
    id: "neon",
    label: "Neon",
    description: "Nổi bật, nhiều năng lượng",
    cardClassName: "border-cyan-300/80 bg-slate-950 text-white shadow-cyan-500/25 dark:border-cyan-400/70",
    detailClassName: "rounded-2xl border border-cyan-300/70 bg-slate-950 p-6 text-white shadow-xl shadow-cyan-500/20",
    previewClassName: "bg-slate-950 ring-2 ring-cyan-300",
    accentClassName: "bg-cyan-300",
    patternClassName: "bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.46),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.35),transparent_28%),linear-gradient(135deg,#020617,#0f172a)]",
    icon: Zap
  },
  {
    id: "calm",
    label: "Calm",
    description: "Dịu, nhẹ, thư thái",
    cardClassName: "border-teal-200/80 bg-teal-50/90 dark:border-teal-800/70 dark:bg-teal-950/50",
    detailClassName: "rounded-2xl border border-teal-200/80 bg-teal-50/90 p-6 shadow-lg shadow-teal-100/60 dark:border-teal-800/70 dark:bg-teal-950/50 dark:shadow-black/20",
    previewClassName: "bg-teal-100",
    accentClassName: "bg-teal-400",
    patternClassName: "bg-[radial-gradient(circle_at_18%_24%,rgba(45,212,191,0.30),transparent_30%),linear-gradient(135deg,rgba(240,253,250,0.98),rgba(204,251,241,0.78))] dark:bg-[radial-gradient(circle_at_18%_24%,rgba(45,212,191,0.22),transparent_30%),linear-gradient(135deg,rgba(19,78,74,0.76),rgba(15,23,42,0.94))]",
    icon: Flower2
  },
  {
    id: "paper",
    label: "Paper",
    description: "Cảm giác giấy ghi chú",
    cardClassName: "border-amber-200 bg-amber-50/95 shadow-amber-100/70 dark:border-amber-800/70 dark:bg-amber-950/40",
    detailClassName: "rounded-2xl border border-amber-200 bg-amber-50/95 p-6 shadow-lg shadow-amber-100/70 dark:border-amber-800/70 dark:bg-amber-950/40 dark:shadow-black/20",
    previewClassName: "bg-amber-100",
    accentClassName: "bg-amber-400",
    patternClassName: "bg-[linear-gradient(90deg,rgba(251,191,36,0.18)_1px,transparent_1px),linear-gradient(rgba(251,191,36,0.14)_1px,transparent_1px),linear-gradient(135deg,#fffbeb,#fef3c7)] bg-[length:18px_18px,18px_18px,auto] dark:bg-[linear-gradient(90deg,rgba(251,191,36,0.16)_1px,transparent_1px),linear-gradient(rgba(251,191,36,0.10)_1px,transparent_1px),linear-gradient(135deg,rgba(69,26,3,0.72),rgba(15,23,42,0.94))]",
    icon: ScanLine
  },
  {
    id: "focus",
    label: "Focus",
    description: "Tối giản, ít nhiễu",
    cardClassName: "border-slate-300 bg-slate-100/95 dark:border-slate-700 dark:bg-slate-900",
    detailClassName: "rounded-2xl border border-slate-300 bg-slate-100/95 p-6 shadow-lg shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20",
    previewClassName: "bg-slate-200",
    accentClassName: "bg-slate-900 dark:bg-slate-100",
    patternClassName: "bg-[linear-gradient(135deg,#f8fafc,#e2e8f0)] dark:bg-[linear-gradient(135deg,#020617,#111827)]",
    icon: CircleDot
  }
];

export function getNoteStyleOption(style: NoteStyle | null | undefined): NoteStyleOption {
  return noteStyleOptions.find((option) => option.id === style) ?? noteStyleOptions[0];
}

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
  glowClassName: string;
  icon: typeof FileText;
};

export const noteStyleOptions: NoteStyleOption[] = [
  {
    id: "classic",
    label: "Classic",
    description: "S\u1ea1ch, r\u00f5, d\u1ec5 \u0111\u1ecdc",
    cardClassName:
      "border-sky-100/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,249,255,0.88)_52%,rgba(236,254,255,0.92))] shadow-sky-100/80 dark:border-sky-900/60 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(12,74,110,0.38)_52%,rgba(15,23,42,0.94))] dark:shadow-black/25",
    detailClassName:
      "rounded-2xl border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-card/90 dark:shadow-black/20",
    previewClassName: "bg-white",
    accentClassName: "bg-gradient-to-b from-sky-300 via-cyan-300 to-slate-300",
    patternClassName:
      "bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,245,249,0.92))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))]",
    glowClassName: "bg-sky-300/55",
    icon: FileText
  },
  {
    id: "neon",
    label: "Neon",
    description: "N\u1ed5i b\u1eadt, nhi\u1ec1u n\u0103ng l\u01b0\u1ee3ng",
    cardClassName:
      "border-cyan-300/80 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_90%_0%,rgba(217,70,239,0.28),transparent_28%),linear-gradient(135deg,#020617,#0f172a_62%,#111827)] text-white shadow-cyan-500/25 dark:border-cyan-400/70",
    detailClassName: "rounded-2xl border border-cyan-300/70 bg-slate-950 p-6 text-white shadow-xl shadow-cyan-500/20",
    previewClassName: "bg-slate-950 ring-2 ring-cyan-300",
    accentClassName: "bg-gradient-to-b from-cyan-300 via-fuchsia-400 to-violet-500",
    patternClassName:
      "bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.46),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.35),transparent_28%),linear-gradient(135deg,#020617,#0f172a)]",
    glowClassName: "bg-cyan-300/60",
    icon: Zap
  },
  {
    id: "calm",
    label: "Calm",
    description: "D\u1ecbu, nh\u1eb9, th\u01b0 th\u00e1i",
    cardClassName:
      "border-teal-200/80 bg-[radial-gradient(circle_at_18%_16%,rgba(94,234,212,0.26),transparent_30%),linear-gradient(135deg,rgba(240,253,250,0.98),rgba(204,251,241,0.82)_56%,rgba(236,253,245,0.94))] shadow-teal-100/80 dark:border-teal-800/70 dark:bg-[linear-gradient(135deg,rgba(19,78,74,0.62),rgba(15,23,42,0.94))]",
    detailClassName:
      "rounded-2xl border border-teal-200/80 bg-teal-50/90 p-6 shadow-lg shadow-teal-100/60 dark:border-teal-800/70 dark:bg-teal-950/50 dark:shadow-black/20",
    previewClassName: "bg-teal-100",
    accentClassName: "bg-gradient-to-b from-teal-300 via-emerald-300 to-sky-300",
    patternClassName:
      "bg-[radial-gradient(circle_at_18%_24%,rgba(45,212,191,0.30),transparent_30%),linear-gradient(135deg,rgba(240,253,250,0.98),rgba(204,251,241,0.78))] dark:bg-[radial-gradient(circle_at_18%_24%,rgba(45,212,191,0.22),transparent_30%),linear-gradient(135deg,rgba(19,78,74,0.76),rgba(15,23,42,0.94))]",
    glowClassName: "bg-teal-300/55",
    icon: Flower2
  },
  {
    id: "paper",
    label: "Paper",
    description: "C\u1ea3m gi\u00e1c gi\u1ea5y ghi ch\u00fa",
    cardClassName:
      "border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(254,243,199,0.92)_55%,rgba(255,237,213,0.94))] shadow-amber-100/80 dark:border-amber-800/70 dark:bg-[linear-gradient(135deg,rgba(69,26,3,0.68),rgba(15,23,42,0.92))]",
    detailClassName:
      "rounded-2xl border border-amber-200 bg-amber-50/95 p-6 shadow-lg shadow-amber-100/70 dark:border-amber-800/70 dark:bg-amber-950/40 dark:shadow-black/20",
    previewClassName: "bg-amber-100",
    accentClassName: "bg-gradient-to-b from-amber-300 via-orange-300 to-rose-300",
    patternClassName:
      "bg-[linear-gradient(90deg,rgba(251,191,36,0.18)_1px,transparent_1px),linear-gradient(rgba(251,191,36,0.14)_1px,transparent_1px),linear-gradient(135deg,#fffbeb,#fef3c7)] bg-[length:18px_18px,18px_18px,auto] dark:bg-[linear-gradient(90deg,rgba(251,191,36,0.16)_1px,transparent_1px),linear-gradient(rgba(251,191,36,0.10)_1px,transparent_1px),linear-gradient(135deg,rgba(69,26,3,0.72),rgba(15,23,42,0.94))]",
    glowClassName: "bg-amber-300/60",
    icon: ScanLine
  },
  {
    id: "focus",
    label: "Focus",
    description: "T\u1ed1i gi\u1ea3n, \u00edt nhi\u1ec5u",
    cardClassName:
      "border-slate-300 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(226,232,240,0.94)_58%,rgba(219,234,254,0.86))] shadow-slate-200/80 dark:border-slate-700 dark:bg-[linear-gradient(135deg,#020617,#111827_62%,#172554)]",
    detailClassName:
      "rounded-2xl border border-slate-300 bg-slate-100/95 p-6 shadow-lg shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20",
    previewClassName: "bg-slate-200",
    accentClassName: "bg-gradient-to-b from-slate-900 via-blue-600 to-slate-500 dark:from-slate-100 dark:via-blue-300 dark:to-slate-500",
    patternClassName: "bg-[linear-gradient(135deg,#f8fafc,#e2e8f0)] dark:bg-[linear-gradient(135deg,#020617,#111827)]",
    glowClassName: "bg-blue-300/45",
    icon: CircleDot
  }
];

export function getNoteStyleOption(style: NoteStyle | null | undefined): NoteStyleOption {
  return noteStyleOptions.find((option) => option.id === style) ?? noteStyleOptions[0];
}

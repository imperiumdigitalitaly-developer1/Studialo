import Link from "next/link";
import type { ReactNode } from "react";
import type { Color } from "@/lib/content";

const tileColors: Record<Color, string> = {
  blu: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  viola: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  verde: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  ambra: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
};

/** Riquadro colorato con sigla, es. "DP". */
export function Tile({
  color,
  children,
  size = "md",
}: {
  color: Color;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "size-14 rounded-2xl text-base" : "size-12 rounded-xl text-sm";
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center font-extrabold tracking-wide ${box} ${tileColors[color]}`}
    >
      {children}
    </span>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" }) {
  const styles =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
      : "bg-bg-soft text-fg-muted";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${styles}`}>
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-4xl text-balance sm:text-5xl">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="shrink-0 font-bold text-accent hover:underline">
          {link.label} →
        </Link>
      )}
    </div>
  );
}

export const cardClass =
  "rounded-3xl border border-line bg-bg transition duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-xl hover:shadow-[#141b34]/[0.06] active:scale-[0.99]";

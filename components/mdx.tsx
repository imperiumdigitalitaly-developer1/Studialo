import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BoxProps = { title?: string; children: ReactNode };

const boxStyles = {
  nota: {
    label: "Nota",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300",
  },
  definizione: {
    label: "Definizione",
    className: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300",
  },
  esempio: {
    label: "Esempio",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  attenzione: {
    label: "Attenzione",
    className: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  },
} as const;

function makeBox(kind: keyof typeof boxStyles) {
  const style = boxStyles[kind];
  function Box({ title, children }: BoxProps) {
    return (
      <aside className={`not-prose my-8 rounded-2xl border px-5 py-4 ${style.className}`}>
        <p className="text-xs font-bold tracking-[0.16em] uppercase">{title ?? style.label}</p>
        <div className="prose prose-studialo mt-2 max-w-none text-[16px] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </aside>
    );
  }
  Box.displayName = style.label;
  return Box;
}

function A({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

function Img({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" decoding="async" className="rounded-2xl" {...props} />;
}

export const mdxComponents = {
  a: A,
  table: Table,
  img: Img,
  Nota: makeBox("nota"),
  Definizione: makeBox("definizione"),
  Esempio: makeBox("esempio"),
  Attenzione: makeBox("attenzione"),
};

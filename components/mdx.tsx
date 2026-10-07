import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BoxProps = { title?: string; children: ReactNode };

const boxStyles = {
  nota: { label: "Nota", className: "border-accent bg-accent-soft" },
  definizione: { label: "Definizione", className: "border-violet-500 bg-violet-500/10" },
  esempio: { label: "Esempio", className: "border-emerald-500 bg-emerald-500/10" },
  attenzione: { label: "Attenzione", className: "border-amber-500 bg-amber-500/10" },
} as const;

function makeBox(kind: keyof typeof boxStyles) {
  const style = boxStyles[kind];
  function Box({ title, children }: BoxProps) {
    return (
      <aside className={`not-prose my-6 rounded-2xl border-l-4 px-5 py-4 ${style.className}`}>
        <p className="text-sm font-semibold text-fg">{title ?? style.label}</p>
        <div className="prose prose-studialo mt-1 max-w-none text-[16px] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
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

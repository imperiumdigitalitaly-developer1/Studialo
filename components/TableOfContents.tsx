import type { Heading } from "@/lib/content";

function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ul className="space-y-1">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className={`block rounded-lg px-3 py-1.5 transition-colors hover:bg-bg-soft hover:text-accent ${
              h.depth === 3 ? "pl-6 text-sm text-fg-muted" : "text-[15px] font-bold text-fg"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TocMobile({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <details className="group mt-8 rounded-2xl border border-line bg-bg p-2 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow">In questa pagina</span>
        <span aria-hidden className="font-bold text-accent transition-transform group-open:rotate-180">
          ↓
        </span>
      </summary>
      <div className="mt-1 border-t border-line pt-2">
        <TocList headings={headings} />
      </div>
    </details>
  );
}

export function TocDesktop({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label="Indice" className="sticky top-24 rounded-3xl border border-line p-3">
      <p className="eyebrow px-3 pt-2 pb-3">In questa pagina</p>
      <TocList headings={headings} />
    </nav>
  );
}

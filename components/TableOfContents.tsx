import type { Heading } from "@/lib/content";

function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.depth === 3 ? "pl-4" : ""}>
          <a href={`#${h.id}`} className="block text-fg-muted transition-colors hover:text-accent">
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
    <details className="group mt-8 rounded-2xl bg-bg-soft px-5 py-4 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium [&::-webkit-details-marker]:hidden">
        In questa pagina
        <span aria-hidden className="text-fg-muted transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="mt-4">
        <TocList headings={headings} />
      </div>
    </details>
  );
}

export function TocDesktop({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label="Indice" className="sticky top-20">
      <p className="mb-3 text-xs font-semibold tracking-wide text-fg-muted uppercase">
        In questa pagina
      </p>
      <TocList headings={headings} />
    </nav>
  );
}

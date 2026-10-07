"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchItem = {
  href: string;
  title: string;
  materia: string;
  description?: string;
  keywords: string;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function Search({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const indexed = useMemo(
    () =>
      items.map((item) => ({
        item,
        haystack: normalize(
          [item.title, item.materia, item.description ?? "", item.keywords].join(" "),
        ),
      })),
    [items],
  );

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const results =
    terms.length === 0
      ? []
      : indexed.filter(({ haystack }) => terms.every((t) => haystack.includes(t))).slice(0, 8);

  return (
    <div>
      <label htmlFor="cerca-input" className="sr-only">
        Cerca negli appunti
      </label>
      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m13 13 4 4" strokeLinecap="round" />
        </svg>
        <input
          id="cerca-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un argomento…"
          autoComplete="off"
          enterKeyHint="search"
          className="h-12 w-full rounded-2xl border border-line bg-bg-soft pr-4 pl-12 text-base text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:bg-bg focus:ring-4 focus:ring-accent/15"
        />
      </div>

      {terms.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-line" aria-live="polite">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-fg-muted">Nessun risultato. Prova con un’altra parola.</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map(({ item }) => (
                <li key={item.href}>
                  <Link href={item.href} className="block px-5 py-3.5 transition-colors hover:bg-bg-soft">
                    <span className="block text-xs font-medium text-accent">{item.materia}</span>
                    <span className="block font-medium text-fg">{item.title}</span>
                    {item.description && (
                      <span className="mt-0.5 block line-clamp-1 text-sm text-fg-muted">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    <div className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) router.push(results[0].item.href);
        }}
        className="flex items-center gap-2 rounded-2xl border border-line bg-bg p-2 shadow-xl shadow-[#141b34]/[0.05] transition focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/10"
      >
        <label htmlFor="cerca-input" className="sr-only">
          Cerca negli appunti
        </label>
        <input
          id="cerca-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Materia o argomento…"
          autoComplete="off"
          enterKeyHint="search"
          className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-fg outline-none placeholder:text-fg-muted"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-accent px-5 font-bold text-white transition hover:brightness-110 active:scale-[0.98] sm:px-7"
        >
          Cerca
        </button>
      </form>

      {terms.length > 0 && (
        <div
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-bg text-left shadow-2xl shadow-[#141b34]/10"
          aria-live="polite"
        >
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-fg-muted">Nessun risultato. Prova con un’altra parola.</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map(({ item }) => (
                <li key={item.href}>
                  <Link href={item.href} className="block px-5 py-3.5 transition-colors hover:bg-bg-soft">
                    <span className="block text-[11px] font-bold tracking-[0.14em] text-accent uppercase">
                      {item.materia}
                    </span>
                    <span className="mt-0.5 block font-bold text-fg">{item.title}</span>
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

import Link from "next/link";
import { Search, type SearchItem } from "@/components/Search";
import { getMaterie } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  const materie = getMaterie();
  const searchItems: SearchItem[] = materie.flatMap((m) =>
    m.chapters.map((c) => ({
      href: `/${m.slug}/${c.slug}`,
      title: c.title,
      materia: m.title,
      description: c.description,
      keywords: c.headings.map((h) => h.text).join(" "),
    })),
  );

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
          {site.tagline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-fg-muted sm:text-xl">
          Appunti universitari ordinati per materia. Scegli, leggi, ripassa. Anche dal telefono.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="#materie"
            className="rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            Inizia a leggere
          </Link>
        </div>
      </section>

      <section id="cerca" className="mx-auto max-w-2xl scroll-mt-20 px-5">
        <Search items={searchItems} />
      </section>

      <section id="materie" className="mx-auto max-w-5xl scroll-mt-16 px-5 pt-16">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Materie</h2>
        {materie.length === 0 ? (
          <p className="mt-4 text-fg-muted">Nessun appunto ancora. Arrivano presto.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materie.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/${m.slug}`}
                  className="group flex h-full flex-col rounded-3xl bg-bg-soft p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 active:scale-[0.99]"
                >
                  <h3 className="text-xl font-semibold tracking-tight">{m.title}</h3>
                  {m.description && (
                    <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{m.description}</p>
                  )}
                  <span className="mt-auto pt-5 text-sm font-medium text-accent">
                    {m.chapters.length} {m.chapters.length === 1 ? "argomento" : "argomenti"}
                    <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

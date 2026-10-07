import Link from "next/link";
import { Search, type SearchItem } from "@/components/Search";
import { Chip, SectionHeader, Tile, cardClass } from "@/components/ui";
import { formatDate, getMaterie, getRecentChapters } from "@/lib/content";
import { site } from "@/lib/site";

const steps = [
  { title: "Scegli la materia", text: "Tutti gli appunti sono divisi per esame." },
  { title: "Apri l’argomento", text: "Ogni capitolo è una pagina breve e ordinata." },
  { title: "Segui l’indice", text: "Salti subito al paragrafo che ti serve." },
  { title: "Ripassa ovunque", text: "Pensato per il telefono. Anche in treno." },
];

export default function HomePage() {
  const materie = getMaterie();
  const recenti = getRecentChapters(6);
  const inEvidenza = recenti[0];
  const totArgomenti = materie.reduce((n, m) => n + m.chapters.length, 0);
  const totMinuti = materie.reduce(
    (n, m) => n + m.chapters.reduce((k, c) => k + c.readingMinutes, 0),
    0,
  );

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
      {/* HERO */}
      <section className="bg-grid border-b border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:pt-24 lg:pb-24">
          <div>
            <p className="eyebrow">Appunti universitari, chiari e ordinati</p>
            <h1 className="display mt-5 text-5xl text-balance sm:text-6xl lg:text-7xl">
              {site.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl">
              Organizzati per materia e argomento. Gratis da leggere, comodi da ripassare. Anche
              dal telefono.
            </p>

            <div id="cerca" className="mt-8 max-w-xl scroll-mt-24">
              <Search items={searchItems} />
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                [materie.length, materie.length === 1 ? "materia" : "materie"],
                [totArgomenti, totArgomenti === 1 ? "argomento" : "argomenti"],
                [totMinuti, "minuti di lettura"],
              ].map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-extrabold tracking-tight">{n}</dd>
                  <span className="text-[15px] text-fg-muted">{label}</span>
                </div>
              ))}
            </dl>
          </div>

          {inEvidenza && (
            <div className="relative rounded-[2rem] bg-[#1a2340] p-5 pb-9 shadow-2xl shadow-[#141b34]/20 sm:p-8 sm:pb-12 dark:bg-navy dark:ring-1 dark:ring-line">
              <div className="flex items-center justify-between gap-4 text-[15px] text-white/80">
                <span>Ultimo aggiornamento</span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Sempre aggiornati
                </span>
              </div>
              <div className="relative mt-8">
                <div
                  aria-hidden
                  className="absolute inset-x-6 -bottom-3 h-full rotate-[-1.5deg] rounded-3xl bg-white/25"
                />
                <Link
                  href={`/${inEvidenza.materia.slug}/${inEvidenza.chapter.slug}`}
                  className="relative block rounded-3xl bg-white p-6 text-[#141b34] transition hover:-translate-y-0.5 sm:p-8"
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-[#0071e3] uppercase">
                    Appunti · {inEvidenza.materia.title}
                  </p>
                  <p className="display mt-4 text-3xl sm:text-4xl">{inEvidenza.chapter.title}</p>
                  {inEvidenza.chapter.description && (
                    <p className="mt-4 text-[17px] leading-relaxed text-[#5b6478]">
                      {inEvidenza.chapter.description}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f1f4f9] px-3 py-1.5 text-sm font-bold text-[#5b6478]">
                      {inEvidenza.chapter.readingMinutes} min di lettura
                    </span>
                    {inEvidenza.chapter.updated && (
                      <span className="rounded-full bg-[#f1f4f9] px-3 py-1.5 text-sm font-bold text-[#5b6478]">
                        {formatDate(inEvidenza.chapter.updated)}
                      </span>
                    )}
                  </div>
                  <p className="mt-7 text-lg font-extrabold text-[#0071e3]">Apri gli appunti →</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MATERIE */}
      <section id="materie" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-20 sm:pt-24">
        <SectionHeader eyebrow="Esplora per materia" title="Parti da quello che studi" />
        {materie.length === 0 ? (
          <p className="mt-8 text-fg-muted">Nessun appunto ancora. Arrivano presto.</p>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materie.map((m) => (
              <li key={m.slug}>
                <Link href={`/${m.slug}`} className={`group flex h-full items-start gap-4 p-6 ${cardClass}`}>
                  <Tile color={m.color}>{m.sigla}</Tile>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-extrabold tracking-tight">{m.title}</span>
                    {m.description && (
                      <span className="mt-1.5 block text-[15px] leading-relaxed text-fg-muted">
                        {m.description}
                      </span>
                    )}
                    <span className="mt-3 block text-sm font-bold text-fg-muted">
                      {m.chapters.length} {m.chapters.length === 1 ? "argomento" : "argomenti"}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-xl font-bold text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ULTIMI APPUNTI */}
      {recenti.length > 0 && (
        <section id="ultimi" className="mt-20 scroll-mt-16 border-y border-line bg-bg-soft py-20 sm:mt-24 sm:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeader eyebrow="Ultimi aggiornamenti" title="Appunti appena sistemati" />
            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recenti.map(({ chapter: c, materia: m }) => (
                <li key={`${m.slug}/${c.slug}`}>
                  <Link href={`/${m.slug}/${c.slug}`} className={`flex h-full gap-4 p-6 ${cardClass}`}>
                    <Tile color={m.color}>{m.sigla}</Tile>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow">Appunti</span>
                        <Chip>{m.title}</Chip>
                      </span>
                      <span className="mt-3 block text-xl font-extrabold tracking-tight">{c.title}</span>
                      {c.description && (
                        <span className="mt-2 block text-[15px] leading-relaxed text-fg-muted">
                          {c.description}
                        </span>
                      )}
                      <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-sm font-bold text-fg-muted">
                        <span>{c.readingMinutes} min</span>
                        {c.updated && <span>Aggiornato il {formatDate(c.updated)}</span>}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* COME SI USA */}
      <section
        id="come-si-usa"
        className="mx-auto grid max-w-6xl grid-cols-1 scroll-mt-16 gap-12 px-5 pt-20 sm:pt-24 lg:grid-cols-2 lg:gap-16"
      >
        <div>
          <p className="eyebrow">Come si usa</p>
          <h2 className="display mt-4 text-4xl text-balance sm:text-5xl lg:text-6xl">
            Pochi passi. Zero distrazioni.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
            Niente pubblicità, niente iscrizioni. Solo appunti scritti con cura, pronti quando ti
            servono.
          </p>
          <Link
            href="#materie"
            className="mt-8 inline-block rounded-xl bg-accent px-6 py-3.5 font-bold text-white shadow-lg shadow-accent/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            Scegli una materia
          </Link>
        </div>
        <ol className="border-t border-line">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-6 border-b border-line py-7 sm:gap-10">
              <span className="pt-1 text-sm font-extrabold text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-xl font-extrabold tracking-tight">{s.title}</span>
                <span className="mt-1.5 block text-[17px] text-fg-muted">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

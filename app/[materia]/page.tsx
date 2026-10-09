import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tile, cardClass } from "@/components/ui";
import { getMateria, getMaterie } from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ materia: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getMaterie().map((m) => ({ materia: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { materia: slug } = await params;
  const materia = getMateria(slug);
  if (!materia) return {};
  const description =
    materia.description ?? `Tutti gli appunti di ${materia.title}, argomento per argomento.`;
  return {
    title: materia.title,
    description,
    alternates: { canonical: `/${materia.slug}` },
    openGraph: {
      title: `${materia.title} | ${site.name}`,
      description,
      url: `/${materia.slug}`,
    },
  };
}

export default async function MateriaPage({ params }: Props) {
  const { materia: slug } = await params;
  const materia = getMateria(slug);
  if (!materia) notFound();

  const minuti = materia.chapters.reduce((n, c) => n + c.readingMinutes, 0);

  return (
    <>
      <section className="bg-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-14 sm:pb-16">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: materia.title }]} />
          <div className="mt-10 flex items-start gap-5">
            <Tile color={materia.color} size="lg">
              {materia.sigla}
            </Tile>
            <div className="min-w-0">
              <p className="eyebrow">Materia</p>
              <h1 className="display mt-3 text-5xl text-balance sm:text-6xl">{materia.title}</h1>
            </div>
          </div>
          {materia.description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl">
              {materia.description}
            </p>
          )}
          <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
            <span>
              <span className="text-2xl font-extrabold tracking-tight">{materia.chapters.length}</span>{" "}
              <span className="text-fg-muted">
                {materia.chapters.length === 1 ? "argomento" : "argomenti"}
              </span>
            </span>
            <span>
              <span className="text-2xl font-extrabold tracking-tight">{minuti}</span>{" "}
              <span className="text-fg-muted">minuti di lettura</span>
            </span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14">
        <p className="eyebrow">Indice</p>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {materia.chapters.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/${materia.slug}/${c.slug}`}
                className={`group flex h-full items-start gap-5 p-6 ${cardClass}`}
              >
                <span className="pt-1 text-sm font-extrabold text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-extrabold tracking-tight">{c.title}</span>
                  {c.description && (
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-fg-muted">
                      {c.description}
                    </span>
                  )}
                  <span className="mt-3 block text-sm font-bold text-fg-muted">
                    {c.readingMinutes} min di lettura
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-xl font-bold text-accent transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

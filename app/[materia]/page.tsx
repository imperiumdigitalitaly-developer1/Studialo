import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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

  return (
    <div className="mx-auto max-w-3xl px-5 pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: materia.title }]} />

      <header className="mt-6">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {materia.title}
        </h1>
        {materia.description && (
          <p className="mt-3 text-lg text-pretty text-fg-muted">{materia.description}</p>
        )}
        <p className="mt-3 text-sm text-fg-muted">
          {materia.chapters.length} {materia.chapters.length === 1 ? "argomento" : "argomenti"}
        </p>
      </header>

      <ol className="mt-8 divide-y divide-line overflow-hidden rounded-3xl bg-bg-soft">
        {materia.chapters.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/${materia.slug}/${c.slug}`}
              className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-black/[0.03] active:bg-black/[0.05] dark:hover:bg-white/[0.04]"
            >
              <span className="mt-0.5 w-6 shrink-0 text-right text-sm font-medium text-fg-muted tabular-nums">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-fg">{c.title}</span>
                {c.description && (
                  <span className="mt-0.5 block text-sm text-fg-muted">{c.description}</span>
                )}
              </span>
              <span className="mt-0.5 shrink-0 text-xs text-fg-muted">{c.readingMinutes} min</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

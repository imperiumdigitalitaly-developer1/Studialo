import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TocDesktop, TocMobile } from "@/components/TableOfContents";
import { mdxComponents } from "@/components/mdx";
import { formatDate, getChapter, getMaterie } from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ materia: string; capitolo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getMaterie().flatMap((m) =>
    m.chapters.map((c) => ({ materia: m.slug, capitolo: c.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { materia, capitolo } = await params;
  const found = getChapter(materia, capitolo);
  if (!found) return {};
  const { chapter, materia: m } = found;
  const title = `${chapter.title} – ${m.title}`;
  const description =
    chapter.description ?? `Appunti di ${m.title}: ${chapter.title}. Chiari, ordinati, da leggere ovunque.`;
  const url = `/${m.slug}/${chapter.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${title} | ${site.name}`,
      description,
      url,
      ...(chapter.updated ? { modifiedTime: chapter.updated } : {}),
    },
  };
}

export default async function CapitoloPage({ params }: Props) {
  const { materia, capitolo } = await params;
  const found = getChapter(materia, capitolo);
  if (!found) notFound();
  const { chapter, materia: m, prev, next, index } = found;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.title,
    description: chapter.description,
    inLanguage: "it",
    isPartOf: { "@type": "Course", name: m.title },
    ...(chapter.updated ? { dateModified: chapter.updated } : {}),
    url: `${site.url}/${m.slug}/${chapter.slug}`,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-5xl px-5 pt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
        <article className="min-w-0 max-w-[42rem]">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: `/${m.slug}`, label: m.title },
              { label: chapter.title },
            ]}
          />

          <header className="mt-6">
            <p className="text-sm font-medium text-accent">
              {m.title} · Argomento {index + 1} di {m.chapters.length}
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
              {chapter.title}
            </h1>
            {chapter.description && (
              <p className="mt-3 text-lg text-pretty text-fg-muted">{chapter.description}</p>
            )}
            <p className="mt-4 text-sm text-fg-muted">
              {chapter.readingMinutes} min di lettura
              {chapter.updated && <> · Aggiornato il {formatDate(chapter.updated)}</>}
            </p>
          </header>

          <TocMobile headings={chapter.headings} />

          <div className="prose prose-lg prose-studialo mt-10 max-w-none prose-headings:font-semibold prose-h2:mt-12 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
            <MDXRemote
              source={chapter.body}
              components={mdxComponents}
              options={{
                mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
              }}
            />
          </div>

          <nav
            aria-label="Altri argomenti"
            className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/${m.slug}/${prev.slug}`}
                className="rounded-2xl bg-bg-soft px-5 py-4 transition hover:shadow-md hover:shadow-black/5"
              >
                <span className="block text-xs text-fg-muted">← Precedente</span>
                <span className="mt-1 block font-medium">{prev.title}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={`/${m.slug}/${next.slug}`}
                className="rounded-2xl bg-bg-soft px-5 py-4 text-right transition hover:shadow-md hover:shadow-black/5"
              >
                <span className="block text-xs text-fg-muted">Successivo →</span>
                <span className="mt-1 block font-medium">{next.title}</span>
              </Link>
            ) : (
              <Link
                href={`/${m.slug}`}
                className="rounded-2xl bg-bg-soft px-5 py-4 text-right transition hover:shadow-md hover:shadow-black/5"
              >
                <span className="block text-xs text-fg-muted">Fine della materia</span>
                <span className="mt-1 block font-medium">Torna a {m.title}</span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <TocDesktop headings={chapter.headings} />
        </aside>
      </div>
    </>
  );
}

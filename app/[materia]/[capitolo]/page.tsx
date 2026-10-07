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
import { Chip, cardClass } from "@/components/ui";
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
      <section className="bg-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 sm:pb-14">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: `/${m.slug}`, label: m.title },
              { label: chapter.title },
            ]}
          />
          <div className="mt-10 max-w-3xl">
            <p className="eyebrow">
              Appunti ·{" "}
              <Link href={`/${m.slug}`} className="underline decoration-2 underline-offset-4">
                {m.title}
              </Link>
            </p>
            <h1 className="display mt-4 text-4xl text-balance sm:text-6xl">{chapter.title}</h1>
            {chapter.description && (
              <p className="mt-5 text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl">
                {chapter.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>
                Argomento {index + 1} di {m.chapters.length}
              </Chip>
              <Chip>{chapter.readingMinutes} min di lettura</Chip>
              {chapter.updated && <Chip tone="green">Aggiornato il {formatDate(chapter.updated)}</Chip>}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <article className="min-w-0 max-w-[44rem]">
          <TocMobile headings={chapter.headings} />

          <div className="prose prose-lg prose-studialo mt-10 max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:text-3xl prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
            <MDXRemote
              source={chapter.body}
              components={mdxComponents}
              options={{
                mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
              }}
            />
          </div>

          <nav aria-label="Altri argomenti" className="mt-16 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/${m.slug}/${prev.slug}`} className={`block p-6 ${cardClass}`}>
                <span className="eyebrow">← Precedente</span>
                <span className="mt-2 block text-lg font-extrabold tracking-tight">{prev.title}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link href={`/${m.slug}/${next.slug}`} className={`block p-6 text-right ${cardClass}`}>
                <span className="eyebrow">Successivo →</span>
                <span className="mt-2 block text-lg font-extrabold tracking-tight">{next.title}</span>
              </Link>
            ) : (
              <Link href={`/${m.slug}`} className={`block p-6 text-right ${cardClass}`}>
                <span className="eyebrow">Fine della materia</span>
                <span className="mt-2 block text-lg font-extrabold tracking-tight">
                  Torna a {m.title} →
                </span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="hidden pt-10 lg:block">
          <TocDesktop headings={chapter.headings} />
        </aside>
      </div>
    </>
  );
}

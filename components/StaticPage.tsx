import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { mdxComponents } from "@/components/mdx";
import { formatDate } from "@/lib/content";
import { getPage } from "@/lib/pages";

export function pageMetadata(slug: string): Metadata {
  const page = getPage(slug);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${slug}` },
  };
}

export function StaticPage({ slug, eyebrow }: { slug: string; eyebrow: string }) {
  const page = getPage(slug);
  return (
    <>
      <section className="bg-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 sm:pb-14">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: page.title }]} />
          <div className="mt-10 max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display mt-4 text-4xl text-balance sm:text-6xl">{page.title}</h1>
            {page.description && (
              <p className="mt-5 text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl">
                {page.description}
              </p>
            )}
            {page.updated && (
              <p className="mt-5 text-sm font-bold text-fg-muted">
                Ultimo aggiornamento: {formatDate(page.updated)}
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5">
        <div className="prose prose-lg prose-studialo mt-10 max-w-[44rem] prose-headings:font-extrabold prose-headings:tracking-tight prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
          <MDXRemote
            source={page.body}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
          />
        </div>
      </div>
    </>
  );
}

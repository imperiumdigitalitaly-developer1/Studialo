import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PAGES_DIR = path.join(process.cwd(), "pagine");

export type StaticPage = {
  slug: string;
  title: string;
  description?: string;
  updated?: string;
  body: string;
};

/** Legge una pagina fissa da pagine/[slug].mdx (Chi sono, Privacy, ecc.). */
export function getPage(slug: string): StaticPage {
  const raw = fs.readFileSync(path.join(PAGES_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const updated =
    data.updated instanceof Date
      ? data.updated.toISOString().slice(0, 10)
      : typeof data.updated === "string"
        ? data.updated
        : undefined;
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : undefined,
    updated,
    body: content,
  };
}

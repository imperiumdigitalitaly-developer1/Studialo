import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Heading = { depth: 2 | 3; text: string; id: string };

export type Chapter = {
  materia: string;
  slug: string;
  title: string;
  description?: string;
  order: number;
  updated?: string;
  readingMinutes: number;
  body: string;
  headings: Heading[];
};

export const COLORS = ["blu", "viola", "verde", "ambra"] as const;
export type Color = (typeof COLORS)[number];

export type Materia = {
  slug: string;
  title: string;
  description?: string;
  order: number;
  /** Sigla mostrata nel riquadro colorato, es. "DP". */
  sigla: string;
  color: Color;
  chapters: Chapter[];
};

// "01-introduzione.mdx" -> { order: 1, slug: "introduzione" }
function parseFileName(file: string) {
  const base = file.replace(/\.mdx?$/, "");
  const match = base.match(/^(\d+)[-_.\s]+(.+)$/);
  if (match) return { order: Number(match[1]), slug: match[2] };
  return { order: Number.POSITIVE_INFINITY, slug: base };
}

// "diritto-privato" -> "Diritto privato"
function humanize(slug: string) {
  const text = slug.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toDateString(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function stripMarkdown(text: string) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCode = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode;
    if (inCode) continue;
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const depth = match[1].length;
    const text = stripMarkdown(match[2]);
    // Lo slugger va chiamato per ogni titolo, come fa rehype-slug,
    // così gli id restano allineati anche con titoli duplicati.
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) headings.push({ depth, text, id });
  }
  return headings;
}

function readingMinutes(body: string) {
  const words = body.replace(/[#*_`>\-|]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function readChapter(materia: string, file: string): Chapter | null {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, materia, file), "utf8");
  const { data, content } = matter(raw);
  if (data.draft === true) return null;
  const { order, slug } = parseFileName(file);
  return {
    materia,
    slug,
    title: typeof data.title === "string" ? data.title : humanize(slug),
    description: typeof data.description === "string" ? data.description : undefined,
    order: typeof data.order === "number" ? data.order : order,
    updated: toDateString(data.updated),
    readingMinutes: readingMinutes(content),
    body: content,
    headings: extractHeadings(content),
  };
}

function readMateria(slug: string): Omit<Materia, "color"> & { color?: Color } {
  const dir = path.join(CONTENT_DIR, slug);
  const files = fs.readdirSync(dir);

  // Informazioni facoltative sulla materia in content/[materia]/_materia.md
  let meta: Record<string, unknown> = {};
  const metaFile = files.find((f) => /^_materia\.mdx?$/.test(f));
  if (metaFile) meta = matter(fs.readFileSync(path.join(dir, metaFile), "utf8")).data;

  const chapters = files
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map((f) => readChapter(slug, f))
    .filter((c): c is Chapter => c !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "it"));

  const title = typeof meta.title === "string" ? meta.title : humanize(slug);
  return {
    slug,
    title,
    description: typeof meta.description === "string" ? meta.description : undefined,
    order: typeof meta.order === "number" ? meta.order : Number.POSITIVE_INFINITY,
    sigla: typeof meta.sigla === "string" ? meta.sigla.slice(0, 3) : makeSigla(title),
    color: COLORS.includes(meta.color as Color) ? (meta.color as Color) : undefined,
    chapters,
  };
}

// "Diritto Privato" -> "DP", "Matematica" -> "MAT"
function makeSigla(title: string) {
  const words = title.split(/\s+/).filter((w) => w.length > 2);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 3).toUpperCase();
}

let cache: Materia[] | null = null;

export function getMaterie(): Materia[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];
  cache = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && !d.name.startsWith("_"))
    .map((d) => readMateria(d.name))
    .filter((m) => m.chapters.length > 0)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "it"))
    // Se il colore non è indicato, le materie si alternano tra i quattro colori.
    .map((m, i) => ({ ...m, color: m.color ?? COLORS[i % COLORS.length] }));
  return cache;
}

export function getRecentChapters(limit = 6) {
  return getMaterie()
    .flatMap((m) => m.chapters.map((chapter) => ({ chapter, materia: m })))
    .sort((a, b) => (b.chapter.updated ?? "").localeCompare(a.chapter.updated ?? ""))
    .slice(0, limit);
}

export function getMateria(slug: string) {
  return getMaterie().find((m) => m.slug === slug);
}

export function getChapter(materiaSlug: string, chapterSlug: string) {
  const materia = getMateria(materiaSlug);
  if (!materia) return undefined;
  const index = materia.chapters.findIndex((c) => c.slug === chapterSlug);
  if (index === -1) return undefined;
  return {
    materia,
    chapter: materia.chapters[index],
    prev: materia.chapters[index - 1],
    next: materia.chapters[index + 1],
    index,
  };
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

import Link from "next/link";
import { getMaterie } from "@/lib/content";
import { site } from "@/lib/site";

export function Footer() {
  const materie = getMaterie();
  return (
    <footer className="mt-24 bg-[#141b34] text-white dark:bg-navy">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-xl font-semibold tracking-tight">
            {site.name}
          </Link>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/60">
            {site.tagline} Appunti universitari scritti da me, da leggere ovunque.
          </p>
        </div>
        <div>
          <p className="font-bold">Materie</p>
          <ul className="mt-4 space-y-2.5 text-[15px] text-white/60">
            {materie.map((m) => (
              <li key={m.slug}>
                <Link href={`/${m.slug}`} className="transition-colors hover:text-white">
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold">{site.name}</p>
          <ul className="mt-4 space-y-2.5 text-[15px] text-white/60">
            <li>
              <Link href="/#cerca" className="transition-colors hover:text-white">Cerca negli appunti</Link>
            </li>
            <li>
              <Link href="/#ultimi" className="transition-colors hover:text-white">Ultimi aggiornamenti</Link>
            </li>
            <li>
              <Link href="/#come-si-usa" className="transition-colors hover:text-white">Come si usa</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-white/50">
          © {new Date().getFullYear()} {site.name} · studialo.it
        </p>
      </div>
    </footer>
  );
}

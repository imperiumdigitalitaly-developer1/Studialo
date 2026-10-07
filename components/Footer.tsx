import Link from "next/link";
import pkg from "@/package.json";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Appunti",
    links: [
      { href: "/#cerca", label: "Cerca negli appunti" },
      { href: "/#materie", label: "Tutte le materie" },
      { href: "/#ultimi", label: "Ultimi aggiornamenti" },
    ],
  },
  {
    title: site.name,
    links: [
      { href: "/chi-sono", label: "Chi sono" },
      { href: "/#come-si-usa", label: "Come si usa" },
    ],
  },
  {
    title: "Legale",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/cookie", label: "Cookie policy" },
      { href: "/note-legali", label: "Note legali" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-[#141b34] text-white dark:bg-navy">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-5 py-16 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            {site.name}
          </Link>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-white/55">
            Appunti universitari scritti da me, organizzati per essere davvero utili.
          </p>
          <p className="mt-8 text-[15px] text-white/80">
            {site.name} · v{pkg.version}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-lg font-extrabold tracking-tight">{col.title}</p>
            <ul className="mt-5 space-y-3.5 text-[17px] text-white/70">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-white/45">
          © {new Date().getFullYear()} {site.name} · studialo.it · Progetto indipendente, non collegato a nessuna università.
        </p>
      </div>
    </footer>
  );
}

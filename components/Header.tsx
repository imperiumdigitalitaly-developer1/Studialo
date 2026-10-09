import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/#materie", label: "Materie" },
  { href: "/#ultimi", label: "Ultimi appunti" },
  { href: "/#come-si-usa", label: "Come si usa" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="text-xl font-semibold tracking-tight text-fg">
          {site.name}
        </Link>
        <div className="flex items-center gap-1">
          <ul className="mr-3 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-[15px] font-bold text-fg transition-colors hover:bg-bg-soft"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#cerca"
            aria-label="Cerca"
            className="flex size-10 items-center justify-center rounded-xl text-fg transition-colors hover:bg-bg-soft"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/#materie"
            className="ml-1 rounded-xl bg-accent px-4 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-accent/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            Inizia a leggere
          </Link>
        </div>
      </nav>
    </header>
  );
}

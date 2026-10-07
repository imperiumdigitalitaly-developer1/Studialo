import Link from "next/link";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="text-[17px] font-semibold tracking-tight text-fg">
          {site.name}
        </Link>
        <div className="flex items-center gap-5 text-sm text-fg-muted">
          <Link href="/#materie" className="transition-colors hover:text-fg">
            Materie
          </Link>
          <Link href="/#cerca" className="transition-colors hover:text-fg">
            Cerca
          </Link>
        </div>
      </nav>
    </header>
  );
}

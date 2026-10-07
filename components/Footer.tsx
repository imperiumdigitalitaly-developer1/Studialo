import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-soft">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-semibold text-fg">
          {site.name}
        </Link>
        <p>Appunti scritti da me. Da leggere, ripassare, capire.</p>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}

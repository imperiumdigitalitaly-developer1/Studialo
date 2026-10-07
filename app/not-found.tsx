import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pagina non trovata.</h1>
      <p className="mt-3 text-fg-muted">Forse l’indirizzo è cambiato. Riparti dalla home.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition hover:opacity-90"
      >
        Torna alla home
      </Link>
    </div>
  );
}

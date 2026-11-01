import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center px-4 py-16 text-center">
      <div>
        <p className="text-5xl" aria-hidden>🧭</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">This tera is not on our map</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          The page you were looking for has moved or never existed. Stations move in Addis — links do too.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream">
            Back to the map
          </Link>
          <Link href="/stations" className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-ink">
            Browse stations
          </Link>
        </div>
      </div>
    </div>
  );
}

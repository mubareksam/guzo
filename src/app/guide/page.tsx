import Link from "next/link";
import { AlertTriangle, Banknote, Clock3, HandMetal, MessageCircle, Moon, ShieldCheck } from "lucide-react";
import { CrowdPill, ModeTile, StationModes, TransitSign } from "@/app/components/ui";
import { MODE_INFO, MODES, PERIOD_INFO, fareFor } from "@/lib/transit";

export const metadata = { title: "Riding guide & signs — Guzo" };

const phrases = [
  { am: "ወራጅ አለ", latin: "woraj alle", en: "Someone is getting off (say it before your stop)" },
  { am: "…ትሄዳለህ?", latin: "… tihedaleh?", en: "Are you going to …? (ask the redat)" },
  { am: "ስንት ነው?", latin: "sint new?", en: "How much is it?" },
  { am: "መልስ", latin: "mels", en: "Change (money back)" },
  { am: "ቆይ", latin: "koy", en: "Wait / hold on" },
  { am: "ረዳት", latin: "redat", en: "Conductor who calls destinations and collects fares" },
  { am: "ተራ", latin: "tera", en: "Taxi stand / queue" },
];

export default function GuidePage() {
  const fareRows = [2, 4, 7, 10, 13, 18];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-moss">Riding guide · መመሪያ</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Signs, fares and how to ride in Addis</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">Everything the icons and labels in Guzo mean — and the unwritten rules every Addis rider knows.</p>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-forest/10 bg-white p-5">
          <h2 className="text-base font-bold text-ink">Transport signs</h2>
          <ul className="mt-3 space-y-3">
            {MODES.map((m) => (
              <li key={m} className="flex items-start gap-3">
                <ModeTile mode={m} size={38} />
                <div>
                  <p className="text-sm font-bold text-ink">{MODE_INFO[m].label} <span className="font-medium text-ink/45">· {MODE_INFO[m].am}</span></p>
                  <p className="text-xs leading-relaxed text-ink/65">{MODE_INFO[m].blurb}</p>
                  <p className="mt-0.5 text-[11px] text-ink/45">Usual service {String(Math.floor(MODE_INFO[m].hours[0])).padStart(2, "0")}:{MODE_INFO[m].hours[0] % 1 ? "30" : "00"} – {String(Math.floor(MODE_INFO[m].hours[1])).padStart(2, "0")}:{MODE_INFO[m].hours[1] % 1 ? "30" : "00"}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-base font-bold text-ink">Station sign</h2>
            <p className="mb-3 text-xs text-ink/60">Every station page starts with a sign like this. Solid tiles: departs here. Dashed tiles: passes by — wave it down on the main road.</p>
            <TransitSign name="Megenagna Tera — Shola side" am="መገናኛ ተራ (ሾላ በኩል)" kind="tera" modes={["minibus", "city_bus"]} passModes={["train"]} compact />
          </div>
          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-base font-bold text-ink">Map symbols</h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 text-xs text-ink/70">
              <li className="flex items-center gap-2"><span className="h-1.5 w-8 rounded-full bg-[#e0a526]" /> Ride (mode colour)</li>
              <li className="flex items-center gap-2"><span className="w-8 border-t-[3px] border-dotted border-moss" /> Walk</li>
              <li className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-[3px] border-[#e0a526] bg-white" /> Stop passed</li>
              <li className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-white text-[9px]">●</span> Get off here</li>
              <li className="flex items-center gap-2"><StationModes depart={["minibus"]} size={20} /> Taxi stand</li>
              <li className="flex items-center gap-2"><StationModes depart={["train"]} size={20} /> Light rail</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-base font-bold text-ink">Queue levels</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {["empty", "moderate", "packed", "overflowing"].map((c) => (
                <CrowdPill key={c} crowd={c} />
              ))}
            </div>
            <p className="mt-2 text-xs text-ink/60">From rider reports in the last 3 hours. Newer reports count more.</p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-forest/10 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink"><Banknote size={18} className="text-moss" /> Fare guide (estimates, birr)</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.12em] text-ink/45">
                <tr>
                  <th className="py-2">Distance</th>
                  {MODES.filter((m) => m !== "intercity_bus").map((m) => (
                    <th key={m} className="py-2"><span className="inline-flex items-center gap-1"><ModeTile mode={m} size={18} />{MODE_INFO[m].short}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {fareRows.map((km) => (
                  <tr key={km}>
                    <td className="py-2 font-semibold text-ink">{km} km</td>
                    {MODES.filter((m) => m !== "intercity_bus").map((m) => {
                      const f = fareFor(m, km);
                      return <td key={m} className="py-2 text-ink/75">{f.min === f.max ? f.min : `${f.min}–${f.max}`}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-ink/50">Minibus fares follow distance tariffs; drivers may charge more after 8pm. Help keep these accurate on the <Link href="/contribute" className="font-semibold text-forest underline">contribute</Link> page.</p>
        </div>
        <div className="rounded-3xl border border-forest/10 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink"><Clock3 size={18} className="text-moss" /> Time of day</h2>
          <ul className="mt-3 space-y-2.5">
            {Object.values(PERIOD_INFO).map((p) => (
              <li key={p.label} className="rounded-2xl bg-cream/60 px-3 py-2">
                <p className="text-sm font-bold text-ink">{p.label}</p>
                <p className="text-xs text-ink/65">{p.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-forest/10 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink"><MessageCircle size={18} className="text-moss" /> Useful phrases</h2>
          <ul className="mt-3 divide-y divide-forest/5">
            {phrases.map((p) => (
              <li key={p.latin} className="flex items-baseline gap-3 py-2">
                <span className="w-28 shrink-0 text-base font-bold text-ink">{p.am}</span>
                <span className="text-xs text-ink/65"><span className="font-semibold text-ink/80">{p.latin}</span> — {p.en}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-forest/10 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink"><ShieldCheck size={18} className="text-moss" /> Rider tips</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-ink/75">
            <li className="flex gap-2"><HandMetal size={16} className="mt-0.5 shrink-0 text-forest" /> Listen for the redat calling the destination — the windscreen sign may be missing.</li>
            <li className="flex gap-2"><Banknote size={16} className="mt-0.5 shrink-0 text-forest" /> Carry small notes (5, 10, 50 birr). Pay once you are seated.</li>
            <li className="flex gap-2"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-forest" /> In rush hour, passing minibuses are usually full — walk to the tera instead.</li>
            <li className="flex gap-2"><Moon size={16} className="mt-0.5 shrink-0 text-forest" /> After 9pm, service thins out and the light rail closes at 10pm. Ride-hailing (RIDE, Feres) is safer late.</li>
            <li className="flex gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-forest" /> Keep your phone and wallet in front pockets in crowded queues at Merkato, Piassa and Megenagna.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

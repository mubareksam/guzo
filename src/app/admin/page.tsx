import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import ReviewActions from "@/app/components/ReviewActions";
import TimeAgo from "@/app/components/TimeAgo";
import { getCurrentUser } from "@/lib/auth";
import { getRecentContributions } from "@/lib/data";
import { contributionTypes } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");
  const [pending, recent] = await Promise.all([getRecentContributions(50, "pending"), getRecentContributions(15)]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-moss"><ShieldCheck size={14} /> Moderator desk</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Review community updates</h1>
      <p className="mt-2 text-sm text-ink/65">Approving a new station with coordinates adds it to the live map. Approving a moved station updates its position. Contributors earn +15 points.</p>

      <div className="mt-6 space-y-3">
        {pending.length === 0 ? <p className="rounded-3xl border border-dashed border-forest/20 bg-white p-8 text-center text-sm text-ink/60">Nothing waiting for review. 🎉</p> : null}
        {pending.map((c) => (
          <article key={c.id} className="rounded-3xl border border-forest/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">{contributionTypes[c.type] ?? c.type}</span>
                <h2 className="mt-2 text-base font-bold text-ink">{c.stationName}</h2>
                <p className="text-xs text-ink/50">
                  {c.area ?? "Addis Ababa"} · {c.userName ?? "Guest"} · <TimeAgo iso={c.createdAt.toISOString()} />
                  {c.lat !== null && c.lng !== null ? (
                    <>
                      {" · "}
                      <a className="font-semibold text-forest underline" href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=18/${c.lat}/${c.lng}`} target="_blank" rel="noreferrer">
                        {c.lat.toFixed(5)}, {c.lng.toFixed(5)}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <ReviewActions id={c.id} />
            </div>
            <p className="mt-3 rounded-2xl bg-cream/70 p-3 text-sm leading-relaxed text-ink/75">{c.details}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-ink/50">Recently reviewed</h2>
      <ul className="mt-3 divide-y divide-forest/5 rounded-3xl border border-forest/10 bg-white px-5">
        {recent.filter((c) => c.status !== "pending").map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="truncate font-medium text-ink">{c.stationName}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-brick/10 text-brick"}`}>{c.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

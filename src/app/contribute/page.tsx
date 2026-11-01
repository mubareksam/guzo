import Link from "next/link";
import ContributeForm from "@/app/components/ContributeForm";
import TimeAgo from "@/app/components/TimeAgo";
import { BadgeChip } from "@/app/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getRecentContributions } from "@/lib/data";
import { contributionTypes } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ContributePage({
  searchParams,
}: {
  searchParams: Promise<{ station?: string }>;
}) {
  const params = await searchParams;
  const [user, contributions] = await Promise.all([getCurrentUser(), getRecentContributions(10)]);

  const approved = contributions.filter((item) => item.status === "approved").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-[28px] border border-forest/10 bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">Community contributions</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Keep the tera map honest
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
          Stations move, lanes change and fares creep up. Riders like you are the only reliable source — send us
          what you saw and we will update the map. You do not need an account, but logged-in contributors earn
          points, badges and a spot on the city leaderboard.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {[
            { step: "1", title: "Submit", body: "Describe the stand, the lines and the fare you paid." },
            { step: "2", title: "Reviewed", body: "Moderators compare it with nearby reports and maps." },
            { step: "3", title: "Published", body: "The station page and route planner update for everyone." },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl bg-cream/70 p-4">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-forest text-[11px] font-bold text-cream">{item.step}</span>
              <p className="mt-2 text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-0.5 text-xs text-ink/60">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <ContributeForm initialStationName={params.station} isLoggedIn={Boolean(user)} />

        <div className="space-y-4">
          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Recent contributions</h2>
              <span className="text-[10px] uppercase tracking-[0.14em] text-ink/40">{approved} verified</span>
            </div>
            <ul className="mt-3 divide-y divide-forest/5">
              {contributions.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{item.stationName}</p>
                      <p className="text-[11px] text-ink/45">
                        {contributionTypes[item.type] ?? item.type} · {item.area ?? "Addis Ababa"} · {item.userName ?? "Guest"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "rejected"
                            ? "bg-brick/10 text-brick"
                            : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {item.status === "approved" ? "Verified" : item.status === "rejected" ? "Needs info" : "In review"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/60">{item.details}</p>
                  <p className="mt-1 text-[10px] text-ink/40">
                    <TimeAgo iso={item.createdAt.toISOString()} />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-forest p-5 text-cream">
            <p className="text-sm font-semibold">How points work</p>
            <ul className="mt-2 space-y-1.5 text-xs text-cream/80">
              <li>• Queue report — 2 points</li>
              <li>• Station, route or fare contribution — 12 points</li>
              <li>• Suggestion or feedback — 3 points</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[0, 25, 75, 150, 300].map((points) => (
                <BadgeChip key={points} points={points} />
              ))}
            </div>
            <Link href="/leaderboard" className="mt-4 inline-flex rounded-full bg-gold px-4 py-2 text-xs font-bold text-ink">
              See the leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

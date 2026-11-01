import Link from "next/link";
import { redirect } from "next/navigation";
import TimeAgo from "@/app/components/TimeAgo";
import { Avatar, BadgeChip, CrowdPill, StatCard } from "@/app/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getUserContributions, getUserRank, getUserReports } from "@/lib/data";
import { badges, badgeFor, nextBadge } from "@/lib/badges";
import { contributionTypes } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [reports, contributions, standing] = await Promise.all([
    getUserReports(user.id),
    getUserContributions(user.id),
    getUserRank(user.id),
  ]);

  const badge = badgeFor(user.points);
  const upcoming = nextBadge(user.points);
  const verified = contributions.filter((item) => item.status === "approved").length;
  const progressPct = upcoming
    ? Math.min(100, Math.round((user.points / upcoming.badge.min) * 100))
    : 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-forest/10 bg-white p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={user.name} size={56} />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-ink">{user.name}</h1>
                <p className="text-xs text-ink/55">
                  {user.email} · {user.homeArea ?? "Addis Ababa"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <BadgeChip points={user.points} showPoints />
                  {standing ? (
                    <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink/60">
                      Rank #{standing.rank} of {standing.total}
                    </span>
                  ) : null}
                </div>
              </div>
              <Link href="/plan" className="rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-cream">
                Plan a trip
              </Link>
            </div>

            <div className="mt-5 rounded-2xl bg-cream/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-ink">
                  {badge.icon} {badge.name} · <span className="font-normal text-ink/55">{badge.am}</span>
                </span>
                <span className="text-ink/55">
                  {upcoming ? `${upcoming.remaining} points to ${upcoming.badge.name}` : "Highest badge unlocked ⭐"}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-ink/50">{badge.blurb}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatCard label="Points" value={user.points} icon="⭐" />
              <StatCard label="Queue reports" value={reports.length} icon="📣" />
              <StatCard label="Contributions" value={contributions.length} icon="🛠️" />
              <StatCard label="Verified" value={verified} icon="✅" />
            </div>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">My contributions</h2>
              <Link href="/contribute" className="text-xs font-semibold text-forest hover:underline">Add another →</Link>
            </div>
            {contributions.length === 0 ? (
              <p className="mt-3 rounded-2xl bg-cream/70 p-4 text-xs text-ink/60">
                You have not submitted a station update yet. Know a stand that moved? Add it and earn 12 points.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-forest/5">
                {contributions.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{item.stationName}</p>
                        <p className="text-[11px] text-ink/45">
                          {contributionTypes[item.type] ?? item.type} · {item.area ?? "Addis Ababa"} ·{" "}
                          <TimeAgo iso={item.createdAt.toISOString()} />
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "rejected"
                              ? "bg-brick/10 text-brick"
                              : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {item.status === "approved" ? "Verified" : item.status === "rejected" ? "Rejected" : "In review"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/60">{item.details}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">My queue reports</h2>
              <Link href="/stations" className="text-xs font-semibold text-forest hover:underline">Report at a station →</Link>
            </div>
            {reports.length === 0 ? (
              <p className="mt-3 rounded-2xl bg-cream/70 p-4 text-xs text-ink/60">
                No queue reports yet. Open any station page and tell riders how long the wait is.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-forest/5">
                {reports.map((report) => (
                  <li key={report.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <Link href={`/stations/${report.stationId}`} className="truncate text-sm font-medium text-ink hover:underline">
                        {report.stationName}
                      </Link>
                      <p className="text-[11px] text-ink/45">
                        <TimeAgo iso={report.createdAt.toISOString()} /> · ~{report.waitMinutes} min wait
                      </p>
                      {report.note ? <p className="mt-0.5 line-clamp-1 text-[11px] text-ink/55">{report.note}</p> : null}
                    </div>
                    <CrowdPill crowd={report.crowd} small />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-forest/10 bg-forest p-5 text-cream">
            <p className="text-sm font-semibold">Quick actions</p>
            <div className="mt-3 grid gap-2">
              {[
                { href: "/plan", label: "Plan a trip", icon: "🧭" },
                { href: "/stations", label: "Find a station", icon: "🚐" },
                { href: "/contribute", label: "Add or fix a tera", icon: "📍" },
                { href: "/feedback", label: "Send feedback", icon: "💬" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2.5 rounded-xl bg-cream/10 px-3.5 py-2.5 text-xs font-medium transition hover:bg-cream/15"
                >
                  <span aria-hidden>{action.icon}</span>
                  {action.label}
                  <span className="ml-auto" aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <p className="text-sm font-semibold text-ink">Badge ladder</p>
            <ul className="mt-3 space-y-2">
              {badges.map((tier) => {
                const unlocked = user.points >= tier.min;
                return (
                  <li
                    key={tier.name}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs ${
                      unlocked ? "bg-cream/80 text-ink" : "text-ink/45"
                    }`}
                  >
                    <span aria-hidden className={unlocked ? "" : "opacity-40"}>{tier.icon}</span>
                    <span className="font-medium">{tier.name}</span>
                    <span className="ml-auto text-[10px] uppercase tracking-wide">{tier.min} pts</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-gold/15 p-5">
            <p className="text-sm font-semibold text-ink">Keep the streak alive</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/65">
              Reports expire after three hours. A quick update from your morning commute keeps the whole map
              accurate for everyone behind you.
            </p>
            <Link href="/stations" className="mt-3 inline-block rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream">
              Report a queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

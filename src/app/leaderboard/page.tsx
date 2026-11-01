import Link from "next/link";
import { Avatar, BadgeChip, SectionHeading } from "@/app/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getLeaderboard, getUserRank } from "@/lib/data";
import { badges, badgeFor, nextBadge } from "@/lib/badges";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  const [leaders, standing] = await Promise.all([getLeaderboard(15), user ? getUserRank(user.id) : Promise.resolve(null)]);
  const myBadge = user ? badgeFor(user.points) : null;
  const progress = user ? nextBadge(user.points) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="hero-pattern rounded-[28px] border border-forest/10 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">City leaderboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">The riders who keep Addis moving</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
          Every verified station, corrected fare and queue report earns points. These are the riders whose updates
          made the map more useful this season.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white">
          <div className="flex items-center justify-between border-b border-forest/5 px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Top contributors</h2>
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink/40">all time</span>
          </div>
          <ul className="divide-y divide-forest/5">
            {leaders.map((leader, index) => {
              const isMe = user?.id === leader.id;
              return (
                <li
                  key={leader.id}
                  className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${isMe ? "bg-gold/10" : ""}`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      index === 0
                        ? "bg-gold text-ink"
                        : index === 1
                          ? "bg-stone-200 text-ink"
                          : index === 2
                            ? "bg-amber-200 text-ink"
                            : "bg-cream text-ink/45"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Avatar name={leader.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {leader.name} {isMe ? <span className="text-[10px] font-bold uppercase tracking-wide text-moss">· you</span> : null}
                    </p>
                    <p className="text-[11px] text-ink/50">
                      {leader.homeArea ?? "Addis Ababa"} · {leader.approved} verified · {leader.submitted} submitted
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <BadgeChip points={leader.points} />
                  </div>
                  <div className="w-14 text-right">
                    <p className="text-sm font-semibold text-ink">{leader.points}</p>
                    <p className="text-[10px] text-ink/40">points</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4">
          {user && myBadge ? (
            <div className="rounded-3xl border border-forest/10 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">Your standing</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-2xl" aria-hidden>{myBadge.icon}</span>
                <div>
                  <p className="text-lg font-semibold text-ink">{user.name}</p>
                  <p className="text-xs text-ink/55">{myBadge.name} · {user.points} points</p>
                </div>
              </div>
              {standing ? (
                <p className="mt-3 rounded-xl bg-cream/70 px-3 py-2 text-xs text-ink/65">
                  Rank <span className="font-bold text-ink">#{standing.rank}</span> of {standing.total} riders on Guzo.
                </p>
              ) : null}
              {progress ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-ink/55">
                    <span>Next: {progress.badge.name}</span>
                    <span>{progress.remaining} pts to go</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-moss"
                      style={{ width: `${Math.min(100, Math.round((user.points / progress.badge.min) * 100))}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs font-medium text-moss">You have reached the highest badge. Legend status.</p>
              )}
              <Link href="/dashboard" className="mt-3 inline-block text-xs font-semibold text-forest hover:underline">
                Open my rider profile →
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-forest/10 bg-white p-5">
              <p className="text-sm font-semibold text-ink">Want your name here?</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                Create a free rider account, log your first queue report and start climbing from Newcomer.
              </p>
              <Link href="/register" className="mt-3 inline-block rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream">
                Join Guzo
              </Link>
            </div>
          )}

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <SectionHeading eyebrow="Badges" title="Rider levels" />
            <ul className="mt-4 space-y-2.5">
              {badges.map((badge) => (
                <li key={badge.name} className={`flex items-start gap-3 rounded-2xl p-3 ring-1 ring-inset ${user && badgeFor(user.points).name === badge.name ? "bg-gold/10 ring-gold/30" : "bg-cream/50 ring-forest/5"}`}>
                  <span className="text-xl" aria-hidden>{badge.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{badge.name} <span className="text-[11px] font-normal text-ink/45">· {badge.am}</span></p>
                    <p className="text-[11px] leading-relaxed text-ink/55">{badge.blurb}</p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/40">{badge.min}+ points</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

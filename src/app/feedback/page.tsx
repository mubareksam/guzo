import Link from "next/link";
import FeedbackForm from "@/app/components/FeedbackForm";
import TimeAgo from "@/app/components/TimeAgo";
import { getCurrentUser } from "@/lib/auth";
import { getPublicFeedback } from "@/lib/data";
import { feedbackCategories } from "@/lib/format";

export const dynamic = "force-dynamic";

const categoryStyle: Record<string, string> = {
  suggestion: "bg-sky-50 text-sky-900 ring-sky-200",
  bug: "bg-brick/10 text-brick ring-brick/20",
  praise: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partnership: "bg-gold/20 text-yellow-900 ring-gold/30",
};

export default async function FeedbackPage() {
  const [user, messages] = await Promise.all([getCurrentUser(), getPublicFeedback(14)]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">Talk to the team</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Your suggestions shape Guzo</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Guzo is built with Addis riders, not just for them. Tell us what is missing, what feels wrong, or what
          your neighbourhood tera needs. Suggestions appear on the public board below so other riders can back
          them up.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <FeedbackForm defaultName={user?.name} isLoggedIn={Boolean(user)} />
          <div className="rounded-3xl border border-forest/10 bg-forest p-5 text-cream">
            <p className="text-sm font-semibold">What we act on fastest</p>
            <ul className="mt-2 space-y-1.5 text-xs text-cream/80">
              <li>• A station that has moved or disappeared</li>
              <li>• Missing lines and wrong fares</li>
              <li>• Accessibility problems at a stand</li>
              <li>• Neighbourhood coverage requests</li>
            </ul>
            <p className="mt-3 text-[11px] text-cream/60">
              Guzo is a community project. Data is rider-reported and not an official government source.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-forest/10 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Rider suggestions board</h2>
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink/40">{messages.length} recent</span>
          </div>
          <ul className="mt-3 divide-y divide-forest/5">
            {messages.map((item) => (
              <li key={item.id} className="py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${
                      categoryStyle[item.category] ?? "bg-stone-100 text-stone-700 ring-stone-200"
                    }`}
                  >
                    {feedbackCategories[item.category] ?? item.category}
                  </span>
                  <span className="text-xs font-medium text-ink">{item.userName ?? item.name ?? "Anonymous rider"}</span>
                  <span className="text-[10px] text-ink/40">
                    <TimeAgo iso={item.createdAt.toISOString()} />
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{item.message}</p>
              </li>
            ))}
          </ul>
          {messages.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-cream/70 p-4 text-xs text-ink/60">
              The board is empty. Be the first rider to leave a suggestion.
            </p>
          ) : null}
          <Link href="/contribute" className="mt-4 inline-block text-xs font-semibold text-forest hover:underline">
            Or contribute a station update →
          </Link>
        </div>
      </div>
    </div>
  );
}

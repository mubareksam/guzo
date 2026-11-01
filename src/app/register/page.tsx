import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/app/components/AuthForm";
import { GuzoMark } from "@/app/components/SiteHeader";
import { badges } from "@/lib/badges";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid overflow-hidden rounded-[28px] border border-forest/10 bg-white shadow-[0_24px_60px_rgba(13,32,24,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-forest p-8 text-cream lg:flex">
          <div className="flex items-center gap-3">
            <GuzoMark size={40} />
            <div>
              <p className="text-lg font-bold leading-none">Guzo</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cream/60">ጉዞ · Addis tera map</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold leading-snug">Join the riders mapping Addis.</h2>
            <p className="mt-3 text-xs leading-relaxed text-cream/70">
              Your queue reports and corrections are what make the map trustworthy for thousands of commuters.
            </p>
            <ul className="mt-5 space-y-2">
              {badges.slice(0, 4).map((badge) => (
                <li key={badge.name} className="flex items-center gap-2.5 rounded-xl bg-cream/5 px-3 py-2 text-xs">
                  <span aria-hidden>{badge.icon}</span>
                  <span className="font-semibold">{badge.name}</span>
                  <span className="ml-auto text-cream/50">{badge.min}+ pts</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] text-cream/50">Free forever. No spam, no location tracking.</p>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">Create account</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Start earning rider points</h1>
          <p className="mt-1 text-xs text-ink/55">Reports +2 · contributions +12 · feedback +3</p>
          <div className="mt-5">
            <AuthForm mode="register" />
          </div>
          <p className="mt-4 text-center text-[11px] text-ink/45">
            By joining you agree to keep contributions honest.{" "}
            <Link href="/feedback" className="font-semibold text-forest hover:underline">Questions?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
